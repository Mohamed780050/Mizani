import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import {
  dodopayments,
  checkout,
  portal,
  webhooks,
} from "@dodopayments/better-auth";
import db from "./db";
import { dodo } from "./dodo";
import { sendEmailVerification, sendOTPToChangePassword } from "./resend";
import { resolveSlugFromProductId } from "./resolve-plan";

// ─── Helpers ────────────────────────────────────────────────────
/** Resolve user from Dodo customer ID embedded in webhook payload */
async function findUserByCustomerId(customerId?: string | null) {
  if (!customerId) return null;
  return db.user.findFirst({ where: { dodoCustomerId: customerId } });
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      onboardingComplete: {
        type: "boolean",
        defaultValue: false,
      },
      dodoCustomerId: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 256,
    sendResetPassword: async ({ user, url }) => {
      void sendEmailVerification(url, user.name, user.email);
    },
  },
  rateLimit: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmailVerification(url, user.name, user.email);
    },
    expiresIn: 600,
  },
  plugins: [
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type === "forget-password") {
          await sendOTPToChangePassword(email, otp);
        }
      },
      expiresIn: 300,
    }),
    dodopayments({
      client: dodo,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: `${process.env.DODO_PRO_PRODUCT_ID}`,
              slug: "pro",
            },
          ],
          successUrl: "/dashboard",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET || "",

          // ── Subscription Activated ──────────────────────────
          onSubscriptionActive: async (payload: any) => {
            const user = await findUserByCustomerId(
              payload.data?.customer?.customer_id
            );
            if (!user) return;

            const planSlug = resolveSlugFromProductId(
              payload.data?.product_id
            );

            await db.subscription.upsert({
              where: { userId: user.id },
              create: {
                userId: user.id,
                plan: planSlug,
                status: "active",
                dodoSubscriptionId: payload.data?.subscription_id,
                dodoProductId: payload.data?.product_id,
                currentPeriodEnd: payload.data?.current_period_end
                  ? new Date(payload.data.current_period_end)
                  : null,
              },
              update: {
                plan: planSlug,
                status: "active",
                dodoSubscriptionId: payload.data?.subscription_id,
                dodoProductId: payload.data?.product_id,
                currentPeriodEnd: payload.data?.current_period_end
                  ? new Date(payload.data.current_period_end)
                  : null,
                cancelledAt: null,
              },
            });
          },

          // ── Subscription Renewed ───────────────────────────
          onSubscriptionRenewed: async (payload: any) => {
            const user = await findUserByCustomerId(
              payload.data?.customer?.customer_id
            );
            if (!user) return;

            await db.subscription.update({
              where: { userId: user.id },
              data: {
                status: "active",
                currentPeriodEnd: payload.data?.current_period_end
                  ? new Date(payload.data.current_period_end)
                  : undefined,
                cancelledAt: null,
              },
            });
          },

          // ── Subscription Cancelled ─────────────────────────
          onSubscriptionCancelled: async (payload: any) => {
            const user = await findUserByCustomerId(
              payload.data?.customer?.customer_id
            );
            if (!user) return;

            await db.subscription.update({
              where: { userId: user.id },
              data: {
                status: "cancelled",
                cancelledAt: new Date(),
              },
            });
          },

          // ── Subscription Failed ────────────────────────────
          onSubscriptionFailed: async (payload: any) => {
            const user = await findUserByCustomerId(
              payload.data?.customer?.customer_id
            );
            if (!user) return;

            await db.subscription.update({
              where: { userId: user.id },
              data: { status: "failed" },
            });
          },

          // ── Subscription Expired ───────────────────────────
          onSubscriptionExpired: async (payload: any) => {
            const user = await findUserByCustomerId(
              payload.data?.customer?.customer_id
            );
            if (!user) return;

            await db.subscription.update({
              where: { userId: user.id },
              data: { status: "expired" },
            });
          },


          // ── Subscription On Hold ───────────────────────────
          onSubscriptionOnHold: async (payload: any) => {
            const user = await findUserByCustomerId(
              payload.data?.customer?.customer_id
            );
            if (!user) return;

            await db.subscription.update({
              where: { userId: user.id },
              data: { status: "on_hold" },
            });
          },

          // ── Subscription Plan Changed ──────────────────────
          onSubscriptionPlanChanged: async (payload: any) => {
            const user = await findUserByCustomerId(
              payload.data?.customer?.customer_id
            );
            if (!user) return;

            const planSlug = resolveSlugFromProductId(
              payload.data?.product_id
            );

            await db.subscription.update({
              where: { userId: user.id },
              data: {
                plan: planSlug,
                dodoProductId: payload.data?.product_id,
              },
            });
          },
        }),
      ],
    }),
    nextCookies(),
  ],
});

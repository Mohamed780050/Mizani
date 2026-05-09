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
      }
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
              productId: `${process.env.DODO_STARTER_PRODUCT_ID}`,
              slug: "starter",
            },
            {
              productId: `${process.env.DODO_PRO_PRODUCT_ID}`,
              slug: "pro",
            },
            {
              productId: `${process.env.DODO_MAX_PRODUCT_ID}`,
              slug: "max",
            },
          ],
          successUrl: "/dashboard",
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_SECRET || "",
          onPayload: async (payload) => {
            console.log("Received webhook:", payload);
            // Handle subscription/payment events here
            // e.g., update user plan status in your database
          },
        }),
      ],
    }),
    nextCookies(),
  ],
});

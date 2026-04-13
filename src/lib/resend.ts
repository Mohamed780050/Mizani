import { EmailLinkVerification } from "@/components/emails/EmailLinkVerification";
import { ResetPasswordEmail } from "@/components/emails/ResetPasswordEmail";
import { Resend } from "resend";
import { getTranslations, getLocale } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Email Verification ─────────────────────────────────────────────────────

export async function sendEmailVerification(
  url: string,
  name: string,
  email: string
) {
  const t = await getSafeTranslations("Emails.EmailLinkVerification", {
    projectName: "Auth Template",
    title: "Verify your email",
    greeting: "Hello,",
    greetingDefault: "Hello",
    instruction:
      "Please verify your email address by clicking the link below.",
    button: "Verify Email",
    fallback: "Or copy and paste this URL into your browser:",
    ignore: "If you didn't request this email, you can safely ignore it.",
    secure: "This is a secure, automated email.",
    copyright: `© ${new Date().getFullYear()} Auth Template. All rights reserved.`,
  });

  await resend.emails.send({
    from: `Auth Template <${process.env.RESEND_FROM_EMAIL || "noreply@example.com"}>`,
    to: email,
    subject: t("title"),
    react: EmailLinkVerification({
      url,
      name,
      t: {
        projectName: t("projectName"),
        title: t("title"),
        greeting: t("greeting"),
        greetingDefault: t("greetingDefault"),
        instruction: t("instruction"),
        button: t("button"),
        fallback: t("fallback"),
        ignore: t("ignore"),
        secure: t("secure"),
        copyright: t("copyright"),
      },
    }),
  });
}

// ─── Password Reset OTP ─────────────────────────────────────────────────────

export async function sendOTPToChangePassword(email: string, otp: string) {
  const t = await getSafeTranslations("Emails.ResetPasswordEmail", {
    projectName: "Auth Template",
    title: "Reset your password",
    greeting: "Hello,",
    greetingDefault: "Hello",
    instruction: "Use the following OTP code to reset your password.",
    otpLabel: "OTP Code",
    ignore: "If you didn't request this email, you can safely ignore it.",
    secure: "This is a secure, automated email.",
    copyright: `© ${new Date().getFullYear()} Auth Template. All rights reserved.`,
  });

  await resend.emails.send({
    from: `Auth Template <${process.env.RESEND_FROM_EMAIL || "noreply@example.com"}>`,
    to: email,
    subject: t("title"),
    react: ResetPasswordEmail({
      otp,
      t: {
        projectName: t("projectName"),
        title: t("title"),
        greeting: t("greeting"),
        greetingDefault: t("greetingDefault"),
        instruction: t("instruction"),
        otpLabel: t("otpLabel"),
        ignore: t("ignore"),
        secure: t("secure"),
        copyright: t("copyright"),
      },
    }),
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Safely resolve next-intl translations.
 * Falls back to a static dictionary when running outside an RSC context
 * (e.g. during Better Auth's background email sending).
 */
async function getSafeTranslations<T extends Record<string, string>>(
  namespace: string,
  fallback: T
): Promise<(key: keyof T) => string> {
  try {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace });
    return (key: keyof T) => t(key as string);
  } catch {
    // Outside RSC context — use fallback strings
    return (key: keyof T) => fallback[key] ?? String(key);
  }
}

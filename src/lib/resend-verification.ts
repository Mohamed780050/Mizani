import { auth } from "./auth";

/**
 * Resend the email verification link to a user.
 * Call this from a server action or API route when a user
 * requests a new verification email.
 */
export async function ResendVerificationEmail(email: string) {
  try {
    await auth.api.sendVerificationEmail({
      body: {
        email,
        callbackURL: "/sign-in",
      },
    });
  } catch (error) {
    throw error;
  }
}

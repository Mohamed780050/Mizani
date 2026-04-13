"use server";

import { authClient } from "@/lib/auth-client";
import { ForgotPasswordSchema, ResetPasswordSchema } from "../schemas";
import { AuthActionState } from "../types";

export async function requestResetAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email") as string;

  const validatedFields = ForgotPasswordSchema.safeParse({ email });

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "forget-password",
    });

    if (error) {
      return {
        error: error.message || "Failed to send reset code. Please try again.",
      };
    }

    return {
      success: "A reset code has been sent to your email.",
    };
  } catch (err) {
    return {
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

export async function resetPasswordAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;
  const password = formData.get("password") as string;

  const validatedFields = ResetPasswordSchema.safeParse({ email, otp, password });

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { data, error } = await authClient.resetPassword({
      newPassword: password,
      token: otp, // Better Auth uses token field for OTP in resetPassword if configured
    });

    if (error) {
      return {
        error: error.message || "Failed to reset password. The code might be invalid or expired.",
      };
    }

    return {
      success: "Your password has been reset successfully. You can now sign in.",
    };
  } catch (err) {
    return {
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

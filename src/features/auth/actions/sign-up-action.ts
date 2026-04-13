"use server";

import { authClient } from "@/lib/auth-client";
import { SignUpSchema } from "../schemas";
import { AuthActionState } from "../types";

export async function signUpAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validatedFields = SignUpSchema.safeParse({ name, email, password, confirmPassword });

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/sign-in", // Redirect to sign-in after sign-up (since we require email verification)
    });

    if (error) {
      return {
        error: error.message || "Failed to create account.",
      };
    }

    return {
      success: "Account created successfully! Please check your email to verify your account.",
    };
  } catch (err) {
    return {
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

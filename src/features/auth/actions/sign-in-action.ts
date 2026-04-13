"use server";

import { authClient } from "@/lib/auth-client";
import { SignInSchema } from "../schemas";
import { AuthActionState } from "../types";

export async function signInAction(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = SignInSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard", // Or whatever redirect you want
    });

    if (error) {
      return {
        error: error.message || "Failed to sign in. Please check your credentials.",
      };
    }

    return {
      success: "Successfully signed in!",
    };
  } catch (err) {
    return {
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

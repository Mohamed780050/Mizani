"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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
    const res = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: "/dashboard", // Or whatever redirect you want
      },
      headers: await headers()
    });

    return {
      success: "Successfully signed in!",
    };
  } catch (err: any) {
    return {
      error: err?.message || "Failed to sign in. Please check your credentials.",
    };
  }
}

import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";
import { dodopaymentsClient } from "@dodopayments/better-auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [emailOTPClient(), dodopaymentsClient()],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  forgetPassword,
  resetPassword,
  emailOtp,
  dodopayments,
} = authClient;

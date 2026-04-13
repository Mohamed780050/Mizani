"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthInput } from "./AuthInput";
import { Button } from "@/components/ui/button";
import { requestResetAction } from "../actions/reset-password-action";
import { Loader2, ArrowRight } from "lucide-react";

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const t = useTranslations("Auth");
  
  const [state, action, isPending] = useActionState(requestResetAction, {
    error: "",
    fieldErrors: {},
  });

  const [submittedEmail, setSubmittedEmail] = useState("");

  // Handle success callback to switch to ResetPasswordForm
  useEffect(() => {
    if (state.success && submittedEmail) {
      onSuccess(submittedEmail);
    }
  }, [state.success, submittedEmail, onSuccess]);


  return (
    <form 
      action={(formData) => {
        setSubmittedEmail(formData.get("email") as string);
        action(formData);
      }} 
      className="space-y-6"
    >
      {state.error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-1">
          {state.error}
        </div>
      )}
      
      {state.success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-sm animate-in fade-in slide-in-from-top-1">
          {state.success}
        </div>
      )}

      <div className="space-y-4">
        <AuthInput
          label={t("emailLabel")}
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
          error={state.fieldErrors?.email}
          disabled={isPending || !!state.success}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold group flex items-center justify-center gap-2"
        disabled={isPending || !!state.success}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            {t("requestResetButton")}
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        <Link
          href="/sign-in"
          className="text-white hover:underline underline-offset-4"
        >
          {t("backToSignInLink")}
        </Link>
      </p>
    </form>
  );
}

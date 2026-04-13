"use client";

import React, { useActionState } from "react";
import { useTranslations } from "next-intl";
import { AuthInput } from "./AuthInput";
import { Button } from "@/components/ui/button";
import { resetPasswordAction } from "../actions/reset-password-action";
import { Loader2, ArrowRight, RefreshCcw } from "lucide-react";

interface ResetPasswordFormProps {
  email: string;
  onBack: () => void;
}

export function ResetPasswordForm({ email, onBack }: ResetPasswordFormProps) {
  const t = useTranslations("Auth");
  
  const [state, action, isPending] = useActionState(resetPasswordAction, {
    error: "",
    fieldErrors: {},
  });

  return (
    <form action={action} className="space-y-6">
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
        <input type="hidden" name="email" value={email} />
        
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
          <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center">
            <RefreshCcw className="size-4 text-zinc-400" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              {t("resetingPasswordFor")}
            </p>
            <p className="text-sm font-medium text-white truncate max-w-[200px]">
              {email}
            </p>
          </div>
        </div>

        <AuthInput
          label={t("resetCodeLabel")}
          name="otp"
          type="text"
          placeholder="123456"
          required
          maxLength={6}
          error={state.fieldErrors?.otp}
          disabled={isPending || !!state.success}
          className="text-center text-2xl tracking-[0.5em] font-mono"
        />
        
        <AuthInput
          label={t("newPasswordLabel")}
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          error={state.fieldErrors?.password}
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
            {t("resetPasswordButton")}
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-center text-sm text-zinc-500 hover:text-white transition-colors"
      >
        {t("changeEmailLink")}
      </button>
    </form>
  );
}

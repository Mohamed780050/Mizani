"use client";

import React, { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AuthInput } from "./AuthInput";
import { Button } from "@/components/ui/button";
import { signUpAction } from "../actions/sign-up-action";
import { Loader2, ArrowRight } from "lucide-react";

export function SignUpForm() {
  const t = useTranslations("Auth");
  
  const [state, action, isPending] = useActionState(signUpAction, {
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
        <AuthInput
          label={t("nameLabel")}
          name="name"
          type="text"
          placeholder="John Doe"
          required
          autoComplete="name"
          error={state.fieldErrors?.name}
          disabled={isPending}
        />
        <AuthInput
          label={t("emailLabel")}
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          autoComplete="email"
          error={state.fieldErrors?.email}
          disabled={isPending}
        />
        <AuthInput
          label={t("passwordLabel")}
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          error={state.fieldErrors?.password}
          disabled={isPending}
        />
        <AuthInput
          label={t("confirmPasswordLabel")}
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="new-password"
          error={state.fieldErrors?.confirmPassword}
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-semibold group flex items-center justify-center gap-2"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            {t("signUpButton")}
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-zinc-500">
        {t("alreadyHaveAccountText")}{" "}
        <Link
          href="/sign-in"
          className="text-white hover:underline underline-offset-4"
        >
          {t("signInLink")}
        </Link>
      </p>
    </form>
  );
}

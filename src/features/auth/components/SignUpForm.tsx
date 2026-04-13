"use client";

import React, { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { signUpAction } from "../actions/sign-up-action";
import { Loader2, ArrowRight, User, Mail, Lock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ElementType;
  error?: string[] | string;
}

const Field = ({ label, icon: Icon, error, className, ...props }: FieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-muted-foreground mx-1">
        {label}
      </label>
      <div className="relative">
        <span className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors peer-focus:text-primary">
          <Icon className="size-5" />
        </span>
        <input
          className={cn(
            "w-full peer ps-12 pe-4 py-4 bg-secondary border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-card transition-all text-foreground placeholder:text-muted-foreground/50",
            error && "ring-2 ring-destructive/50 bg-destructive/5",
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-destructive mx-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
};

export function SignUpForm() {
  const t = useTranslations("Auth");
  
  const [state, action, isPending] = useActionState(signUpAction, {
    error: "",
    fieldErrors: {},
  });

  return (
    <form action={action} className="space-y-6">
      {state.error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-1 font-medium">
          {state.error}
        </div>
      )}
      
      {state.success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-4 rounded-xl text-sm animate-in fade-in slide-in-from-top-1 font-medium">
          {state.success}
        </div>
      )}

      <div className="space-y-4">
        <Field
          label={t("nameLabel")}
          name="name"
          type="text"
          placeholder="أدخل اسمك الكامل"
          icon={User}
          required
          autoComplete="name"
          error={state.fieldErrors?.name}
          disabled={isPending}
        />
        <Field
          label={t("emailLabel")}
          name="email"
          type="email"
          placeholder="example@mail.com"
          icon={Mail}
          required
          autoComplete="email"
          error={state.fieldErrors?.email}
          disabled={isPending}
        />
        
        {/* Password Grid */}
        <div className="grid grid-cols-1 gap-4">
          <Field
            label={t("passwordLabel")}
            name="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
            autoComplete="new-password"
            error={state.fieldErrors?.password}
            disabled={isPending}
          />
          <Field
            label={t("confirmPasswordLabel")}
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            icon={Shield}
            required
            autoComplete="new-password"
            error={state.fieldErrors?.confirmPassword}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-3 py-2">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="mt-1 h-5 w-5 rounded-md border-border bg-secondary text-primary focus:ring-primary/20 transition-all cursor-pointer"
        />
        <label
          htmlFor="terms"
          className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
        >
          أوافق على{" "}
          <a href="#" className="text-primary font-bold hover:underline transition-all">شروط الخدمة</a>{" "}
          و{" "}
          <a href="#" className="text-primary font-bold hover:underline transition-all">سياسة الخصوصية</a>{" "}
          الخاصة بميزاني.
        </label>
      </div>

      <Button
        type="submit"
        className="w-full py-8 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <>
            <span>{t("signUpButton")}</span>
            <ArrowRight className="size-5 group-hover:rtl:-translate-x-1 group-hover:ltr:translate-x-1 transition-transform rtl:rotate-180" />
          </>
        )}
      </Button>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-muted-foreground">
          {t("alreadyHaveAccountText")}{" "}
          <Link
            href="/sign-in"
            className="text-primary font-bold hover:underline transition-all"
          >
            {t("signInLink")}
          </Link>
        </p>
      </div>
    </form>
  );
}

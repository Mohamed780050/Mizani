import React from "react";
import { useTranslations } from "next-intl";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpPage() {
  const t = useTranslations("Auth");

  return (
    <>
      <div className="mb-10 text-start">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {t("signUpTitle")}
        </h2>
        <p className="text-muted-foreground font-medium">
          {t("signUpDescription")}
        </p>
      </div>
      <SignUpForm />
    </>
  );
}
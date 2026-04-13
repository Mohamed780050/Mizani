import React from "react";
import { useTranslations } from "next-intl";
import { SignInForm } from "@/features/auth/components/SignInForm";

export default function SignInPage() {
  const t = useTranslations("Auth");

  return (
    <>
      <div className="mb-10 text-start">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {t("signInTitle")}
        </h2>
        <p className="text-muted-foreground font-medium">
          {t("signInDescription")}
        </p>
      </div>
      <SignInForm />
    </>
  );
}
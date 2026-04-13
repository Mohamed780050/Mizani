import React from "react";
import { useTranslations } from "next-intl";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { SignInForm } from "@/features/auth/components/SignInForm";

export default function SignInPage() {
  const t = useTranslations("Auth");

  return (
    <AuthLayout 
      title={t("signInTitle")} 
      description={t("signInDescription")}
    >
      <SignInForm />
    </AuthLayout>
  );
}
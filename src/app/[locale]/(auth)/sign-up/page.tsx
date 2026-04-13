import React from "react";
import { useTranslations } from "next-intl";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export default function SignUpPage() {
  const t = useTranslations("Auth");

  return (
    <AuthLayout 
      title={t("signUpTitle")} 
      description={t("signUpDescription")}
    >
      <SignUpForm />
    </AuthLayout>
  );
}
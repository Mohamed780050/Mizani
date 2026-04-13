"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const t = useTranslations("Auth");
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  const handleSuccess = (email: string) => {
    setResetEmail(email);
  };

  const handleBack = () => {
    setResetEmail(null);
  };

  return (
    <AuthLayout 
      title={t("forgotPasswordTitle")} 
      description={resetEmail ? undefined : t("forgotPasswordDescription")}
    >
      {resetEmail ? (
        <ResetPasswordForm email={resetEmail} onBack={handleBack} />
      ) : (
        <ForgotPasswordForm onSuccess={handleSuccess} />
      )}
    </AuthLayout>
  );
}
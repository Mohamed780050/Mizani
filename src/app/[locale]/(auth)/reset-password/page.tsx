"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
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
    <>
      <div className="mb-10 text-start">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {t("forgotPasswordTitle")}
        </h2>
        <p className="text-muted-foreground font-medium">
          {resetEmail ? undefined : t("forgotPasswordDescription")}
        </p>
      </div>
      
      {resetEmail ? (
        <ResetPasswordForm email={resetEmail} onBack={handleBack} />
      ) : (
        <ForgotPasswordForm onSuccess={handleSuccess} />
      )}
    </>
  );
}
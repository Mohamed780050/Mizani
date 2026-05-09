import React from "react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SignUpForm } from "@/features/auth/components/SignUpForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return { title: t('signUpTitle') };
}

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
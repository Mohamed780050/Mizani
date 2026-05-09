import React from "react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SignInForm } from "@/features/auth/components/SignInForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return { title: t('signInTitle') };
}

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
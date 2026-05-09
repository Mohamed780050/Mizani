import React from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { InvestCalcPage } from "@/features/invest-calc/components/InvestCalcPage";

export default async function InvestCalcRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <InvestCalcPage />;
}

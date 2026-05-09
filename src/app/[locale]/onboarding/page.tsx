import { setRequestLocale, getTranslations } from "next-intl/server";
import { OnboardingFlow } from "@/features/onboarding/components/OnboardingFlow";
import React from "react";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return { title: t('onboardingTitle') };
}

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen relative flex items-center justify-center pt-10 pb-20 px-4 bg-[#f7f9ff] dark:bg-[#080b0e] overflow-hidden">
      
      {/* Decorative ambient background noise & gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-lighten" />
      </div>

      <div className="relative z-10 w-full">
        <OnboardingFlow />
      </div>
    </div>
  );
}

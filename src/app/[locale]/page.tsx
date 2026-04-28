import { setRequestLocale } from "next-intl/server";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingHero } from "@/features/landing/components/LandingHero";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { Pricing } from "@/features/landing/components/Pricing";
import { FAQ } from "@/features/landing/components/FAQ";
import { LandingFooter } from "@/features/landing/components/LandingFooter";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-surface-container-lowest text-on-surface font-sans antialiased overflow-x-hidden">
      <LandingNav />
      <LandingHero />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <LandingFooter />
    </main>
  );
}

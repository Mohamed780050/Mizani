import React from "react";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { GovernanceTabs } from "@/features/settings/components/GovernanceTabs";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Governance");
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const [budgetSettings, preferences, subscription] = await Promise.all([
    db.budgetSetting.findUnique({
      where: { userId: session.user.id }
    }),
    db.userPreference.findUnique({
      where: { userId: session.user.id }
    }),
    db.subscription.findUnique({
      where: { userId: session.user.id }
    })
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 w-full pt-6 px-4 md:px-0">
       <div className="flex flex-col gap-2 mb-10">
         <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
           {t("title")}
         </h1>
         <p className="text-muted-foreground font-medium max-w-xl">
           {t("description")}
         </p>
       </div>

       <GovernanceTabs 
         budgetSettings={budgetSettings} 
         preferences={preferences} 
         subscription={subscription} 
       />
    </div>
  );
}

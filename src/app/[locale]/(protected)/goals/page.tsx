import React, { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { GoalsContent } from "@/features/goals/components/GoalsContent";
import { GoalsSkeleton } from "@/features/goals/components/GoalsSkeleton";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return { title: t('goalsTitle') };
}

export default async function GoalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Goals");
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-12 w-full pt-6 px-4 md:px-0">
       <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
           {t("title")}
         </h1>
         <p className="text-muted-foreground font-medium max-w-xl">
           {t("description")}
         </p>
       </div>

       <Suspense fallback={<GoalsSkeleton />}>
          <GoalsContent userId={session.user.id} />
       </Suspense>
    </div>
  );
}

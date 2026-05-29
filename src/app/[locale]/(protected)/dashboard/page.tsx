import React, { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  NetWorthOverview,
  NetWorthOverviewSkeleton,
} from "../../../../features/dashboard/components/NetWorthOverview";
import {
  AccountsGrid,
  AccountsGridSkeleton,
} from "../../../../features/dashboard/components/AccountsGrid";
import {
  RecentActivityLedger,
  RecentActivityLedgerSkeleton,
} from "../../../../features/dashboard/components/RecentActivityLedger";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return { title: t("dashboardTitle") };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <Suspense fallback={<NetWorthOverviewSkeleton />}>
        <NetWorthOverview userId={session.user.id} locale={locale} />
      </Suspense>

      <Suspense fallback={<AccountsGridSkeleton />}>
        <AccountsGrid userId={session.user.id} locale={locale} />
      </Suspense>

      <Suspense fallback={<RecentActivityLedgerSkeleton />}>
        <RecentActivityLedger userId={session.user.id} locale={locale} />
      </Suspense>
    </div>
  );
}

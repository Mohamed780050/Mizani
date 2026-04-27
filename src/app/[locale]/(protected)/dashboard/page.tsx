import React, { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { NetWorthOverview } from "./components/NetWorthOverview";
import { AccountsGrid } from "./components/AccountsGrid";
import { RecentActivityLedger } from "./components/RecentActivityLedger";
import { NetWorthSkeleton, GridSkeleton, LedgerSkeleton } from "./components/Skeletons";

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
       <Suspense fallback={<NetWorthSkeleton />}>
          <NetWorthOverview userId={session.user.id} locale={locale} />
       </Suspense>

       <Suspense fallback={<GridSkeleton />}>
          <AccountsGrid userId={session.user.id} locale={locale} />
       </Suspense>

       <Suspense fallback={<LedgerSkeleton />}>
          <RecentActivityLedger userId={session.user.id} locale={locale} />
       </Suspense>
    </div>
  );
}
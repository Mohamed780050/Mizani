import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import db from "@/lib/db";
import { AddIncomeSheet } from "@/features/income/components/AddIncomeSheet";
import { AddExpenseSheet } from "@/features/expense/components/AddExpenseSheet";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { Sidebar } from "@/features/navigation/components/Sidebar";
import { MobileNav } from "@/features/navigation/components/MobileNav";

import { Logo } from "@/components/ui/Logo";

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  // We fetch unread notifications count for the bell
  const unreadCount = await db.notification.count({
    where: { userId: session.user.id, isRead: false }
  });

  const budgetSetting = await db.budgetSetting.findUnique({
    where: { userId: session.user.id }
  });

  const categories = await db.category.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, emoji: true, isDefault: true },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="flex h-screen bg-[#f7f9ff] dark:bg-[#080b0e] overflow-hidden">
      
      {/* Sidebar Navigation (Client Component) */}
      <Sidebar user={{ name: session.user.name, email: session.user.email }} />

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="h-20 px-4 lg:px-8 flex items-center justify-between z-10 w-full shrink-0">
           <div className="flex items-center gap-4">
              <MobileNav user={{ name: session.user.name, email: session.user.email }} />
              <div className="lg:hidden flex items-center gap-2">
                <Logo width={28} height={28} />
                <span className="font-black text-xl tracking-tight text-emerald-950 dark:text-emerald-50">Mizani</span>
              </div>
           </div>

           <div className="flex items-center gap-2 sm:gap-4 ms-auto">
              {/* Notification Bell */}
              <NotificationBell initialCount={unreadCount} />

              <AddExpenseSheet categories={categories} />

              {/* Add Income Button */}
              <AddIncomeSheet 
                defaultAllocations={{
                  EXPENSES: Number(budgetSetting?.expensesPct || 50),
                  INVESTMENT: Number(budgetSetting?.investmentPct || 20),
                  SAVINGS: Number(budgetSetting?.savingsPct || 20),
                  CHARITY: Number(budgetSetting?.charityPct || 10),
                }}
              />
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-12 scroll-smooth">
           {children}
        </div>
      </main>
    </div>
  );
}

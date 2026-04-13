import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { 
  LayoutDashboard, 
  Wallet, 
  Target, 
  Settings, 
  LogOut,
  Bell,
  Plus
} from "lucide-react";
import db from "@/lib/db";
import { AddIncomeSheet } from "@/features/income/components/AddIncomeSheet";
import { AddExpenseSheet } from "@/features/expense/components/AddExpenseSheet";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("App");

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
      
      {/* Sidebar Navigation */}
      <aside className="w-72 flex-shrink-0 relative hidden lg:flex flex-col bg-card border-e border-border/50">
        <div className="p-8">
          <div className="flex items-center gap-3">
             <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-black text-xl">M</span>
             </div>
             <h1 className="font-extrabold text-2xl text-emerald-950 dark:text-emerald-50 tracking-tight">Mizani</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <SidebarItem href="/dashboard" icon={LayoutDashboard} label="Sanctuary" active />
          <SidebarItem href="/accounts" icon={Wallet} label="Ledger & Accounts" />
          <SidebarItem href="/goals" icon={Target} label="Wealth Goals" />
          <SidebarItem href="/settings" icon={Settings} label="Governance" />
        </nav>

        <div className="p-6 border-t border-border/50 mt-auto">
          <div className="bg-secondary/40 rounded-2xl p-4 flex items-center gap-3">
             <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                {session.user.name.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 overflow-hidden">
               <h3 className="font-semibold text-sm truncate">{session.user.name}</h3>
               <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between z-10 w-full">
           <div className="lg:hidden font-bold text-lg">Mizani</div>
           <div className="flex items-center gap-4 ms-auto">
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

function SidebarItem({ href, icon: Icon, label, active = false }: { href: string, icon: any, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm ${
        active 
        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" 
        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      }`}
    >
      <Icon className="size-5" />
      {label}
    </Link>
  );
}

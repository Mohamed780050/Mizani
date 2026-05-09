"use client";

import { useTransition } from "react";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  Target,
  TrendingUp,
  Settings,
  LogOut,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/accounts", icon: Wallet, labelKey: "accounts" },
  { href: "/budgets", icon: BarChart3, labelKey: "budgets" },
  { href: "/goals", icon: Target, labelKey: "goals" },
  { href: "/invest-calc", icon: TrendingUp, labelKey: "investCalc" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
] as const;

export function Sidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/"; } } });
    });
  };

  return (
    <aside className="w-72 shrink-0 relative hidden lg:flex flex-col bg-card border-e border-border/50">
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Logo width={64} height={64} />
          </div>
          <h1 className="font-extrabold text-3xl text-emerald-950 dark:text-emerald-50 tracking-tight">
            Mizani
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {navItems.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={t(item.labelKey as any)}
            active={pathname === item.href}
          />
        ))}
      </nav>

      <div className="p-6 border-t border-border/50 mt-auto">
        <div className="bg-secondary/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="size-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center font-bold text-emerald-700 dark:text-emerald-400">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold text-sm truncate">{user.name}</h3>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isPending}
            className="size-9 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 shrink-0 transition-colors"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
}) {
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

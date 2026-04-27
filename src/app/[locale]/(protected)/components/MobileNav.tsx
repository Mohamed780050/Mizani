"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  Wallet,
  BarChart3,
  Target,
  Settings,
  Menu,
  type LucideIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/accounts", icon: Wallet, labelKey: "accounts" },
  { href: "/budgets", icon: BarChart3, labelKey: "budgets" },
  { href: "/goals", icon: Target, labelKey: "goals" },
  { href: "/settings", icon: Settings, labelKey: "settings" },
] as const;

export function MobileNav({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0 flex flex-col bg-card border-e border-border/50 h-full">
        <SheetHeader className="p-8 text-start">
          <SheetTitle className="flex items-center gap-3">
            <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-black text-xl">M</span>
            </div>
            <span className="font-extrabold text-2xl text-emerald-950 dark:text-emerald-50 tracking-tight">
              Mizani
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm ${
                pathname === item.href
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <item.icon className="size-5" />
              {t(item.labelKey as any)}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-border/50 mt-auto">
          <div className="bg-secondary/40 rounded-2xl p-4 flex items-center gap-3">
            <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-semibold text-sm truncate">{user.name}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

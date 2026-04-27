"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { type LucideIcon } from "lucide-react";

export function SidebarItem({ 
  href, 
  icon: Icon, 
  label 
}: { 
  href: string, 
  icon: LucideIcon, 
  label: string 
}) {
  const pathname = usePathname();
  const active = pathname === href;

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

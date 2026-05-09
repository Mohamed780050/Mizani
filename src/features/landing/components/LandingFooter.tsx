"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Landmark } from "lucide-react";

export function LandingFooter() {
  const t = useTranslations("Landing.footer");

  return (
    <footer className="w-full pt-24 pb-12 bg-secondary/30 dark:bg-background border-t border-border/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-16 font-manrope">
        {/* Brand Column */}
        <div className="space-y-6">
          <Button asChild variant="link" className="text-2xl font-black text-primary block tracking-tighter p-0 h-auto">
            <Link href="/">Mizani</Link>
          </Button>
          <p className="text-muted-foreground font-medium leading-relaxed">
            {t("rights")}
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col space-y-2">
          <span className="text-primary font-black uppercase tracking-widest text-xs mb-4">
            {t("legal")}
          </span>
          <Button asChild variant="link" className="text-muted-foreground hover:text-primary transition-colors font-medium justify-start p-0 h-auto">
            <Link href="#">{t("privacy")}</Link>
          </Button>
          <Button asChild variant="link" className="text-muted-foreground hover:text-primary transition-colors font-medium justify-start p-0 h-auto">
            <Link href="#">{t("terms")}</Link>
          </Button>
          <Button asChild variant="link" className="text-muted-foreground hover:text-primary transition-colors font-medium justify-start p-0 h-auto">
            <Link href="#">{t("cookies")}</Link>
          </Button>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col space-y-2">
          <span className="text-primary font-black uppercase tracking-widest text-xs mb-4">
            {t("company")}
          </span>
          <Button asChild variant="link" className="text-muted-foreground hover:text-primary transition-colors font-medium justify-start p-0 h-auto">
            <Link href="#">{t("security")}</Link>
          </Button>
          <Button asChild variant="link" className="text-muted-foreground hover:text-primary transition-colors font-medium justify-start p-0 h-auto">
            <Link href="#">{t("sustainability")}</Link>
          </Button>
          <Button asChild variant="link" className="text-muted-foreground hover:text-primary transition-colors font-medium justify-start p-0 h-auto">
            <Link href="#">{t("careers")}</Link>
          </Button>
          <Button asChild variant="link" className="text-muted-foreground hover:text-primary transition-colors font-medium justify-start p-0 h-auto">
            <Link href="#">{t("press")}</Link>
          </Button>
        </div>

        {/* Decorative Column */}
        <div className="flex items-end justify-end opacity-20">
          <Landmark className="size-16 text-primary" />
        </div>
      </div>
    </footer>
  );
}

"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";

export function LandingNav() {
  const t = useTranslations("Landing.nav");

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/90 dark:bg-slate-950/90 backdrop-blur-md shadow-low border-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-12 font-manrope antialiased tracking-tight">
        {/* Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-2 text-2xl font-bold text-primary dark:text-teal-50 tracking-tighter hover:opacity-80 transition-opacity"
        >
          <Logo width={32} height={32} />
          <span>Mizani</span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8 space-x-reverse">
          <Link href="#" className="text-primary font-semibold border-b-2 border-primary pb-1">
            {t("personal")}
          </Link>
          <Link href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors hover:opacity-80">
            {t("business")}
          </Link>
          <Link href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors hover:opacity-80">
            {t("wealth")}
          </Link>
          <Link href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors hover:opacity-80">
            {t("security")}
          </Link>
          <Link href="#" className="text-on-surface-variant font-medium hover:text-primary transition-colors hover:opacity-80">
            {t("about")}
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/sign-in" 
            className="text-on-surface-variant font-medium hover:text-primary transition-colors hover:opacity-80 hidden md:inline-block"
          >
            {t("login")}
          </Link>
          <Button asChild className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
            <Link href="/sign-up">{t("openAccount")}</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

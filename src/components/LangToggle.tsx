"use client";

import React, { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LangToggleProps {
  variant?: "default" | "ghost" | "outline" | "secondary";
  className?: string;
}

export function LangToggle({ variant = "outline", className }: LangToggleProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <Button
      variant={variant}
      size="icon"
      className={className}
      onClick={toggleLocale}
      disabled={isPending}
    >
      <Globe className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}

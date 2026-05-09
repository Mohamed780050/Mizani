"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, PiggyBank, TrendingUp, Wallet, HeartHandshake, Settings } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LandingHero() {
  const t = useTranslations("Landing.hero");

  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 min-h-[921px] flex items-center overflow-hidden">
      {/* Abstract gradient blob */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[70%] bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] -left-[10%] w-[40%] h-[60%] bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 max-w-2xl text-start">
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary leading-tight whitespace-pre-line">
              {t("title")}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t("description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground px-8 py-7 rounded-xl font-bold text-xl hover:opacity-90 transition-opacity shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex items-center justify-center gap-2">
                <Link href="/sign-up">
                  <span>{t("cta")}</span>
                  <ArrowRight className="size-6 rtl:rotate-180" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" className="bg-muted text-primary px-8 py-7 rounded-xl font-bold text-xl hover:bg-muted/80 transition-colors flex items-center justify-center gap-2">
                <PlayCircle className="size-6" />
                <span>{t("howItWorks")}</span>
              </Button>
            </div>
          </div>

          {/* Hero Visual / Dashboard Preview */}
          <div className="relative lg:h-[600px] w-full flex justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="w-full max-w-md bg-card rounded-[2rem] shadow-high overflow-hidden border border-border/50">
              <div className="bg-card border-b border-border p-5 flex justify-between items-center">
                <span className="font-bold text-lg text-primary">{t("previewTitle")}</span>
                <Settings className="size-5 text-muted-foreground" />
              </div>
              <div className="p-8 space-y-8">
                <div className="text-center pb-8 border-b border-border/50">
                  <span className="block text-sm font-medium text-muted-foreground mb-2">{t("salaryLabel")}</span>
                  <span className="text-4xl font-black text-primary tracking-tight"> 15,000.00</span>
                </div>
                
                <div className="space-y-6">
                  {/* Allocation Items */}
                  <AllocationItem 
                    icon={<PiggyBank className="size-6" />}
                    title={t("emergencyFund")}
                    percent={20}
                    amount="3,000.00"
                    color="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                    progressColor="bg-primary"
                  />

                  <AllocationItem 
                    icon={<TrendingUp className="size-6" />}
                    title={t("investment")}
                    percent={15}
                    amount="2,250.00"
                    color="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                    progressColor="bg-amber-500"
                  />

                  <AllocationItem 
                    icon={<Wallet className="size-6" />}
                    title={t("currentAccount")}
                    percent={60}
                    amount="9,000.00"
                    color="bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                    progressColor="bg-blue-500"
                    fillOpacity="opacity-30"
                  />

                  <AllocationItem 
                    icon={<HeartHandshake className="size-6" />}
                    title={t("charity")}
                    percent={5}
                    amount="750.00"
                    color="bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400"
                    progressColor="bg-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AllocationItem({ 
  icon, 
  title, 
  percent, 
  amount, 
  color,
  progressColor,
  fillOpacity = "opacity-15"
}: { 
  icon: React.ReactNode; 
  title: string; 
  percent: number; 
  amount: string;
  color: string;
  progressColor: string;
  fillOpacity?: string;
}) {
  return (
    <div className="relative bg-secondary rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform shadow-sm group">
      {/* Background Fill Layer */}
      <div 
        className={cn("absolute inset-0 transition-all duration-1000 ease-out", progressColor, fillOpacity)}
        style={{ width: `${percent}%` }}
      />
      
      <div className="relative z-10 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300", color)}>
            {icon}
          </div>
          <div>
            <span className="block font-bold text-foreground">{title}</span>
            <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">{percent}%</span>
          </div>
        </div>
        <span className="font-bold text-lg text-primary">{amount}</span>
      </div>
    </div>
  );
}

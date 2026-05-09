"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Zap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function Pricing() {
  const t = useTranslations("Landing.pricing");

  return (
    <section className="relative py-32 px-6 md:px-12 overflow-hidden bg-background">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-lg h-128 bg-emerald-500/5 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black tracking-tightest text-primary mb-8 text-balance">
              {t("title")}
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-xl">
              {t("description")}
            </p>
          </div>
          <div className="hidden md:block pb-2">
            <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-2xl border border-border/50 text-sm font-bold text-primary">
              <Zap className="size-4 fill-primary" />
              <span>Scale with your wealth</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-center">
          {/* Basic Plan - The Minimalist */}
          <div className="lg:col-span-5 lg:order-1">
            <Card className="relative bg-card/40 backdrop-blur-sm rounded-[2.5rem] p-4 shadow-sm border-border/40 hover:border-primary/20 transition-all duration-700 group h-full">
              <CardHeader className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    {t("basic.name")}
                  </CardTitle>
                  <div className="size-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
                    <Zap className="size-6" />
                  </div>
                </div>
                <CardDescription className="text-lg font-medium text-muted-foreground leading-snug">
                  {t("basic.desc")}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-0">
                <div className="mb-12">
                  <span className="text-6xl font-black tracking-tighter text-foreground">
                    {t("basic.price")}
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-6">What's included</p>
                  {(t.raw("basic.features") as string[]).map((feature, i) => (
                    <FeatureItem key={i} text={feature} />
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-8">
                <Button 
                  variant="outline" 
                  className="w-full py-8 rounded-2xl font-bold text-lg border-2 hover:bg-secondary transition-all active:scale-[0.98]"
                >
                  {t("basic.cta")}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Premium Plan - The Monolith */}
          <div className="lg:col-span-7 lg:order-2">
            <Card className="relative bg-primary rounded-[3rem] p-1 shadow-2xl shadow-primary/20 border-none overflow-hidden group transition-all duration-700 hover:shadow-primary/30">
              {/* Internal spacing wrapper */}
              <div className="bg-primary p-8 md:p-12 h-full flex flex-col">
                {/* Badge Overlay */}
                <div className="absolute top-0 inset-e-0 p-8">
                  <Badge className="bg-amber-400 text-amber-950 px-6 py-2.5 rounded-full border-none font-black text-xs uppercase tracking-widest shadow-lg shadow-black/20 hover:bg-amber-300">
                    {t("pro.badge")}
                  </Badge>
                </div>

                <CardHeader className="p-0 mb-12">
                  <div className="size-16 rounded-3xl bg-white/10 flex items-center justify-center text-white mb-8 group-hover:rotate-12 transition-transform duration-500">
                    <Sparkles className="size-8" />
                  </div>
                  <CardTitle className="text-4xl md:text-5xl font-black text-white tracking-tightest mb-4">
                    {t("pro.name")}
                  </CardTitle>
                  <CardDescription className="text-xl font-medium text-white/70 leading-relaxed max-w-md">
                    {t("pro.desc")}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 grow">
                  <div className="flex items-baseline gap-3 mb-16">
                    <span className="text-7xl md:text-8xl font-black tracking-tightest text-white">
                      {t("pro.price")}
                    </span>
                    <span className="text-2xl font-bold text-white/50 tracking-tight">
                      {t("pro.period")}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="md:col-span-2">
                      <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">Premium Capabilities</p>
                    </div>
                    {(t.raw("pro.features") as string[]).map((feature, i) => (
                      <FeatureItem key={i} text={feature} isDark />
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-0 mt-16 bg-transparent">
                  <Button 
                    className="w-full py-10 rounded-[2rem] font-black text-2xl bg-white text-primary hover:bg-white/90 transition-all shadow-xl hover:translate-y-[-4px] active:translate-y-0 group"
                  >
                    <span className="flex items-center gap-3">
                      {t("pro.cta")}
                      <ArrowRight className="size-6 group-hover:translate-x-2 rtl:rotate-180 rtl:group-hover:-translate-x-2 transition-transform" />
                    </span>
                  </Button>
                </CardFooter>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-24 -inset-e-24 size-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -inset-s-24 size-96 bg-black/20 rounded-full blur-3xl" />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ text, isDark = false }: { text: string; isDark?: boolean }) {
  return (
    <li className="flex items-center gap-4 list-none">
      <div className={cn(
        "size-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
        isDark ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
      )}>
        <CheckCircle2 className="size-3.5 stroke-3" />
      </div>
      <span className={cn(
        "text-base md:text-lg font-bold transition-colors",
        isDark ? "text-white/80" : "text-foreground/80"
      )}>
        {text}
      </span>
    </li>
  );
}

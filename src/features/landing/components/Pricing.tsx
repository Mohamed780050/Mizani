"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
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
    <section className="py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-6">
            {t("title")}
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <Card className="bg-card rounded-[3rem] p-6 shadow-low flex flex-col hover:shadow-md transition-shadow border border-border/50">
            <CardHeader>
              <CardTitle className="text-3xl font-black text-primary mb-3">
                {t("basic.name")}
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium text-lg">
                {t("basic.desc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-10">
                <span className="text-5xl font-black text-primary tracking-tighter">{t("basic.price")}</span>
              </div>
              
              <ul className="space-y-5 mb-10">
                {(t.raw("basic.features") as string[]).map((feature, i) => (
                  <FeatureItem key={i} text={feature} />
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-muted text-primary border-none py-8 rounded-2xl font-bold text-xl hover:bg-muted/80 transition-colors shadow-sm">
                {t("basic.cta")}
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="bg-primary rounded-[3rem] p-6 shadow-high flex flex-col relative overflow-hidden group border-none">
            <div className="absolute top-0 right-0 z-20">
              <Badge className="bg-amber-500 text-amber-950 px-6 py-2 rounded-bl-[1.5rem] rounded-tr-none rounded-tl-none border-none font-bold text-sm shadow-md hover:bg-amber-500">
                {t("pro.badge")}
              </Badge>
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <CardHeader>
                <CardTitle className="text-3xl font-black text-primary-foreground mb-3">
                  {t("pro.name")}
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 font-medium text-lg">
                  {t("pro.desc")}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <div className="mb-10 flex items-baseline gap-2">
                  <span className="text-5xl font-black text-primary-foreground tracking-tighter">{t("pro.price")}</span>
                  <span className="text-xl font-bold text-primary-foreground/80">{t("pro.period")}</span>
                </div>
                
                <ul className="space-y-5 mb-10">
                  {(t.raw("pro.features") as string[]).map((feature, i) => (
                    <FeatureItem key={i} text={feature} isDark />
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button className="w-full bg-primary-foreground text-primary py-8 rounded-2xl font-bold text-xl hover:opacity-90 transition-opacity shadow-xl shadow-black/10">
                  {t("pro.cta")}
                </Button>
              </CardFooter>
            </div>
            
            {/* Ambient decoration */}
            <div className="absolute -bottom-20 -left-20 size-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
          </Card>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ text, isDark = false }: { text: string; isDark?: boolean }) {
  return (
    <li className="flex items-start gap-4">
      <CheckCircle2 className={cn("size-6 shrink-0 mt-0.5", isDark ? "text-primary-foreground/90" : "text-primary")} />
      <span className={cn("text-lg font-semibold leading-tight", isDark ? "text-primary-foreground" : "text-foreground")}>
        {text}
      </span>
    </li>
  );
}

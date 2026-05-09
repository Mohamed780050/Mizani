"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HowItWorks() {
  const t = useTranslations("Landing.howItWorks");

  const steps = [
    {
      id: 1,
      title: t("step1.title"),
      description: t("step1.description"),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwxQOk97AIT-AjNybnVmpuc-JDy7kkoAtu-Y8_RytNHAZbEnaSTypYc0s9O17loFfzEkl7zYkimelEzbpuHTOGHcsxDSMIpY3xKuzYgGGJ1J53xh397Ft4bGt_QOo24UiyaFVzdB_3swmL86DMDpr6TwidzalHFMhLb__l0qj5vqiJVUXt5ehndt9kLW57JGUi_uBWZVnZwm_d-aQ1uMreYqZEaWfRwSwT12ylTAUO5l79AcMfpuUeb4YTbkfZ47eF_yqGN3au6A",
      alt: "Dashboard showing secure bank connection and percentage sliders"
    },
    {
      id: 2,
      title: t("step2.title"),
      description: t("step2.description"),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBId5oebSIepPW0Z-2aIwhSI3os-VkCAa--k606usJUEdHmmths1iM7j1LTZdmLFl_y4AiPh04vl8Vgwvuhuk3Qh8YXbz1BWeNe35srs9ZsSiimJ0k0hR8HcUOB3iiZjcGr7PDS4tqTEFadBPQvDf0B-ijuQGNAy2gsvXJnbZCTIC3X55N0bcFNbgq23nO5sukQpkmFWyOb2I5EHIugm7C-ADUW07sGCgycIseshpAIN4xsyjeqyxxkQ1WsDoYs_MEdA2VVyE6O-A",
      alt: "Abstract visualization of money flowing into different accounts"
    },
    {
      id: 3,
      title: t("step3.title"),
      description: t("step3.description"),
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1MvjDBcM18xupYGwdzye57lzsoESAcbbPjjeVDbihaVnSmE4-1pZRmyvskznJkk2ObipqflOT2-nlYgcggNhvRaEntbLSAuPPhPvLc6q_qh45nlose-VSBN1fioyS4y7y29zPHduC5vzHO34kXjNPioPjKImJha7apaU4jSIYa36657bibpX1Hoe8PLsclDmvqKgDsnLtf3XYBvI9RHyvmg7RapDvLqs66cENrPpphCtTuSy1vb3q-W0ddTc-uO5kKzb-TKgw_A",
      alt: "Clean chart showing financial growth"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-6">{t("title")}</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <Card key={step.id} className="group bg-card rounded-[2.5rem] p-4 h-full shadow-low hover:shadow-high transition-all duration-500 hover:-translate-y-2 border border-border/10">
              <CardHeader className="p-6">
                <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-8 text-2xl font-black shadow-lg shadow-primary/20">
                  {step.id}
                </div>
                <CardTitle className="text-2xl font-black text-primary mb-4 leading-tight">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground leading-relaxed font-medium mb-10">
                  {step.description}
                </p>
                <div className="bg-background rounded-3xl p-4 shadow-low overflow-hidden group-hover:shadow-md transition-shadow">
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden">
                    <Image
                      src={step.image}
                      alt={step.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const t = useTranslations("Landing.faq");

  const faqs = [
    { 
      id: "item-1",
      q: t("q1"), 
      a: t("a1") 
    },
    { 
      id: "item-2",
      q: t("q2"), 
      a: "ميزاني يدعم حالياً معظم البنوك الكبرى في المملكة العربية السعودية ومصر، بما في ذلك الراجحي، الأهلي، بنك مصر، والبنك التجاري الدولي (CIB). نحن نعمل باستمرار على إضافة المزيد من البنوك والاتحادات الائتمانية." 
    },
    { 
      id: "item-3",
      q: t("q3"), 
      a: "بالتأكيد. يمكنك إلغاء اشتراكك في باقة 'برو' في أي وقت بضغطة واحدة من إعدادات حسابك. ستظل ميزات البرو فعالة حتى نهاية فترة الاشتراك الحالية." 
    },
    { 
      id: "item-4",
      q: t("q4"), 
      a: "ميزاني مصمم للتعامل مع الدخل المتغير. القواعد التي تضعها تعتمد على النسب المئوية (مثل 20% للادخار)، لذا مهما كان المبلغ الذي يصل، سيتم تقسيمه بدقة بناءً على تلك النسب." 
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-6">{t("title")}</h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id}
              className="bg-card rounded-[2rem] px-8 border border-border/50 shadow-low overflow-hidden"
            >
              <AccordionTrigger className="text-xl font-bold text-primary hover:no-underline py-8">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-lg text-muted-foreground leading-relaxed font-medium pb-8">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

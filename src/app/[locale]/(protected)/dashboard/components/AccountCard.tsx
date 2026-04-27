import React from "react";

export function AccountCard({ title, amount, icon: Icon, color, locale }: { title: string; amount: number; icon: any; color: string, locale: string }) {
  return (
    <div className="bg-card border border-border/50 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
       <div className={`absolute -inset-e-4 -top-4 size-24 rounded-full opacity-10 blur-2xl transition-all group-hover:scale-150 ${color.split(' ')[1]}`} />
       
       <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
         <Icon className="size-6" />
       </div>
       
       <div className="space-y-1 relative z-10">
         <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
         <p className="text-3xl font-black font-mono text-foreground tracking-tight">
           {amount.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
         </p>
       </div>
    </div>
  );
}

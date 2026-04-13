"use client";

import React, { useState, useTransition } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Target, CheckCircle2, ChevronRight, Loader2, Calendar } from "lucide-react";
import { createGoalAction, fundGoalAction } from "../actions/goal-actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | null;
  isCompleted: boolean;
};

export function GoalGrid({ goals, savingsBalance }: { goals: Goal[], savingsBalance: number }) {
  const [openCreate, setOpenCreate] = useState(false);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Goals");

  return (
    <div className="space-y-6">
      
      {/* Header specific to Goals */}
      <div className="flex items-center justify-between bg-card border border-border/50 p-6 rounded-3xl shadow-sm">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">{t("power")}</p>
          <div className="flex items-baseline gap-1.5">
             <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-500">
               {savingsBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
             <span className="text-sm font-bold text-muted-foreground">EGP</span>
          </div>
        </div>
        
        <Sheet open={openCreate} onOpenChange={setOpenCreate}>
          <SheetTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full px-6 py-6 shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform">
              <Plus className="size-5 mr-2" />
              {t("createBtn")}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md bg-[#f7f9ff] dark:bg-[#080b0e] border-s-border/50">
             <CreateGoalForm onSuccess={() => setOpenCreate(false)} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} currentSavings={savingsBalance} />
         ))}
         
         {goals.length === 0 && (
           <div className="col-span-full py-16 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-[32px] text-center">
              <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                 <Target className="size-8 text-emerald-500 opacity-80" />
              </div>
              <h3 className="text-xl font-bold">{t("emptyTitle")}</h3>
              <p className="text-muted-foreground mt-2 max-w-sm font-medium">
                {t("emptyDesc")}
              </p>
              <Button variant="outline" className="mt-6 font-bold rounded-xl" onClick={() => setOpenCreate(true)}>
                {t("draftFirst")}
              </Button>
           </div>
         )}
      </div>

    </div>
  );
}

function CreateGoalForm({ onSuccess }: { onSuccess: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const t = useTranslations("Goals");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    
    startTransition(async () => {
      const fd = new FormData();
      fd.append("data", JSON.stringify({
        title,
        targetAmount: Number(amount),
        deadline: date ? new Date(date).toISOString() : undefined,
      }));
      const res = await createGoalAction(null, fd);
      if (res.success) onSuccess();
      else setError(res.error || "Failed");
    });
  };

  return (
    <>
      <SheetHeader className="text-left space-y-2 pt-6">
         <SheetTitle className="text-2xl font-black tracking-tight">{t("newTitle")}</SheetTitle>
         <SheetDescription className="text-muted-foreground">
            {t("newDesc")}
         </SheetDescription>
      </SheetHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-8">
        {error && <div className="text-rose-500 text-sm font-bold bg-rose-500/10 p-3 rounded-lg">{error}</div>}
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">{t("goalIdentity")}</label>
          <Input required value={title} onChange={e => setTitle(e.target.value)} placeholder={t("goalPlaceholder")} className="bg-card border-none py-6 rounded-xl font-bold shadow-sm" />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">{t("targetCapital")}</label>
          <Input required type="number" min="1" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="0.00" className="bg-card border-none py-6 rounded-xl font-mono font-black text-emerald-600 text-lg shadow-sm" />
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">{t("deadline")}</label>
          <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
             <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="bg-card border-none py-6 pl-9 rounded-xl font-bold shadow-sm" />
          </div>
        </div>
        
        <Button disabled={isPending} type="submit" className="w-full py-6 font-bold rounded-xl mt-4 bg-emerald-600 hover:bg-emerald-700">
          {isPending ? <Loader2 className="size-5 animate-spin" /> : t("establishBtn")}
        </Button>
      </form>
    </>
  );
}

function GoalCard({ goal, currentSavings }: { goal: Goal, currentSavings: number }) {
  const t = useTranslations("Goals");
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const [fundingAmount, setFundingAmount] = useState<number | "">("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleFund = () => {
    if (!fundingAmount || fundingAmount <= 0) return;
    setError("");

    if (fundingAmount > currentSavings) {
      setError("Insufficient unallocated liquid savings.");
      return;
    }

    startTransition(async () => {
       const fd = new FormData();
       fd.append("data", JSON.stringify({
         goalId: goal.id,
         amount: Number(fundingAmount)
       }));
       const res = await fundGoalAction(null, fd);
       if (res.success) {
         setFundingAmount("");
       } else {
         setError(res.error || "Failed to route funds.");
       }
    });
  };

  return (
    <div className="bg-card rounded-[32px] border border-border/50 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      {goal.isCompleted && (
        <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center border-2 border-emerald-500/20 rounded-[32px]">
          <div className="size-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mb-3 animate-in zoom-in">
             <CheckCircle2 className="size-8" />
          </div>
          <h3 className="font-black text-emerald-700 dark:text-emerald-400 text-lg">{t("achieved")}</h3>
        </div>
      )}
      
      <div>
        <div className="flex items-center justify-between mb-4">
           <div className="size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
             <Target className="size-6" />
           </div>
           {goal.deadline && (
              <div className="text-xs font-bold text-muted-foreground uppercase bg-secondary/50 px-3 py-1 rounded-full">
                 🎯 {new Date(goal.deadline).toLocaleDateString()}
              </div>
           )}
        </div>
        
        <h3 className="font-extrabold tracking-tight text-xl mb-1">{goal.title}</h3>
        <div className="flex items-baseline space-x-1 mb-6">
           <span className="font-bold text-muted-foreground">EGP</span>
           <span className="font-mono font-black text-2xl tracking-tighter">
             {Number(goal.currentAmount).toLocaleString()}
           </span>
           <span className="text-muted-foreground/50 font-bold mx-1">/</span>
           <span className="font-mono font-bold text-muted-foreground">
             {Number(goal.targetAmount).toLocaleString()}
           </span>
        </div>
      </div>
      
      <div className="space-y-6">
         <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>{t("progress")}</span>
              <span className="text-foreground">{percentage.toFixed(1)}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
         </div>
         
         {error && <div className="text-xs font-bold text-rose-500 bg-rose-500/10 p-2 rounded-lg text-center">{error}</div>}

         <div className="flex gap-2 relative z-20">
            <Input 
              type="number"
              placeholder={t("inject")}
              className="bg-secondary/40 border-none font-bold placeholder:text-muted-foreground/50 rounded-xl"
              value={fundingAmount}
              onChange={e => setFundingAmount(Number(e.target.value))}
              disabled={goal.isCompleted || isPending}
            />
            <Button 
              size="icon" 
              className="rounded-xl flex-shrink-0 bg-primary hover:bg-primary/90 transition-transform active:scale-95"
              disabled={goal.isCompleted || isPending || !fundingAmount}
              onClick={handleFund}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : <ChevronRight className="size-5" /> }
            </Button>
         </div>
      </div>
    </div>
  );
}

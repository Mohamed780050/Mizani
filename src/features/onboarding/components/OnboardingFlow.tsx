"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { submitOnboardingAction } from "../actions/onboarding-actions";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, Wallet, TrendingUp, PiggyBank, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type Allocations = {
  EXPENSES: number;
  INVESTMENT: number;
  SAVINGS: number;
  CHARITY: number;
};

const STEPS = [
  { id: 1, title: "The Sanctuary Blueprint", subtitle: "Set your financial pillars. Every income will automatically flow according to these ratios." },
  { id: 2, title: "Initial Foundations", subtitle: "Declare the balances currently in your possession to seed the ledger." },
  { id: 3, title: "Establishing Ledger", subtitle: "Preparing your Financial Sanctuary." },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [allocations, setAllocations] = useState<Allocations>({
    EXPENSES: 50,
    INVESTMENT: 20,
    SAVINGS: 20,
    CHARITY: 10,
  });

  const [balances, setBalances] = useState<Allocations>({
    EXPENSES: 0,
    INVESTMENT: 0,
    SAVINGS: 0,
    CHARITY: 0,
  });

  const handleAllocationChange = (key: keyof Allocations, val: number[]) => {
    // In a production app, we would dynamically balance the others to equal 100.
    // For now, we enforce it on submission, but let's provide visual feedback.
    setAllocations((prev) => ({ ...prev, [key]: val[0] }));
  };

  const currentTotal = Object.values(allocations).reduce((a, b) => a + b, 0);

  const nextStep = () => {
    if (step === 1 && currentTotal !== 100) {
      setError("Allocations must sum precisely to 100%.");
      return;
    }
    setError("");
    setStep((s) => Math.min(3, s + 1));
  };

  const prevStep = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const submitToSanctuary = async () => {
    setError("");
    startTransition(async () => {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          percentages: allocations,
          initialBalances: balances,
        })
      );

      const res = await submitOnboardingAction(null, formData);

      if (res.success) {
        router.push("/dashboard");
      } else {
        setError(res.error || "A disruption occurred in the sanctuary initialization.");
        setStep(2); // Go back so they can see Error.
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-950 dark:text-emerald-50">
          {STEPS[step - 1].title}
        </h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          {STEPS[step - 1].subtitle}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl text-center text-sm font-medium animate-in fade-in">
          {error}
        </div>
      )}

      {/* Step 1: Allocations */}
      {step === 1 && (
        <div className="space-y-8 bg-card border border-border p-8 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-end border-b border-border pb-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Allocation</span>
            <span className={cn(
              "text-3xl font-black transition-colors duration-300",
              currentTotal === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"
            )}>
              {currentTotal}%
            </span>
          </div>

          <div className="space-y-10 pt-2">
            <AllocationSlider
              label="Expenses"
              icon={Wallet}
              value={allocations.EXPENSES}
              onChange={(v) => handleAllocationChange("EXPENSES", v)}
              color="bg-slate-500"
            />
            <AllocationSlider
              label="Investment"
              icon={TrendingUp}
              value={allocations.INVESTMENT}
              onChange={(v) => handleAllocationChange("INVESTMENT", v)}
              color="bg-emerald-500"
            />
            <AllocationSlider
              label="Savings"
              icon={PiggyBank}
              value={allocations.SAVINGS}
              onChange={(v) => handleAllocationChange("SAVINGS", v)}
              color="bg-blue-500"
            />
            <AllocationSlider
              label="Charity"
              icon={HeartHandshake}
              value={allocations.CHARITY}
              onChange={(v) => handleAllocationChange("CHARITY", v)}
              color="bg-rose-500"
            />
          </div>
        </div>
      )}

      {/* Step 2: Initial Balances */}
      {step === 2 && (
        <div className="space-y-6 bg-card border border-border p-8 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)]">
           <BalanceInput 
             label="Expenses Account" 
             icon={Wallet} 
             value={balances.EXPENSES} 
             onChange={(val) => setBalances(p => ({ ...p, EXPENSES: val }))} 
           />
           <BalanceInput 
             label="Investment Account" 
             icon={TrendingUp} 
             value={balances.INVESTMENT} 
             onChange={(val) => setBalances(p => ({ ...p, INVESTMENT: val }))} 
           />
           <BalanceInput 
             label="Savings Account" 
             icon={PiggyBank} 
             value={balances.SAVINGS} 
             onChange={(val) => setBalances(p => ({ ...p, SAVINGS: val }))} 
           />
           <BalanceInput 
             label="Charity Account" 
             icon={HeartHandshake} 
             value={balances.CHARITY} 
             onChange={(val) => setBalances(p => ({ ...p, CHARITY: val }))} 
           />
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="py-12 flex flex-col items-center justify-center space-y-6 bg-card border border-border p-8 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)]">
           <div className="size-20 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center animate-pulse">
             <CheckCircle2 className="size-10 text-emerald-600 dark:text-emerald-400" />
           </div>
           <p className="text-center text-muted-foreground max-w-sm">
             The framework for your wealth is complete. Click below to immortalize your ledger.
           </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        {step > 1 ? (
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={isPending}
            className="rounded-xl px-6 text-muted-foreground hover:text-foreground hover:bg-secondary/50 font-semibold h-14"
          >
            <ArrowLeft className="size-5 me-2" /> Back
          </Button>
        ) : <div />}

        {step < 3 ? (
          <Button 
            onClick={nextStep}
            className="rounded-xl px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-14 text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue <ArrowRight className="size-5 ms-2" />
          </Button>
        ) : (
          <Button 
            onClick={submitToSanctuary}
            disabled={isPending}
            className="rounded-xl px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 text-lg shadow-xl shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPending ? <Loader2 className="size-5 animate-spin mx-4" /> : "Enter Sanctuary"}
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function AllocationSlider({ label, icon: Icon, value, onChange, color }: { label: string, icon: any, value: number, onChange: (v: number[]) => void, color: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 font-semibold text-foreground">
          <span className={cn("p-1.5 rounded-md text-white", color)}>
            <Icon className="size-4" />
          </span>
          {label}
        </label>
        <span className="text-xl font-bold font-mono">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={onChange}
        max={100}
        step={1}
        className="py-2 cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}

function BalanceInput({ label, icon: Icon, value, onChange }: { label: string, icon: any, value: number, onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-2xl border border-border/50 focus-within:border-primary/50 focus-within:bg-card transition-all">
       <div className="p-3 bg-card rounded-xl shadow-sm border border-border flex-shrink-0">
         <Icon className="size-6 text-muted-foreground" />
       </div>
       <div className="flex-1 space-y-1">
         <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
         <div className="flex items-center gap-2">
           <span className="text-lg font-black text-foreground">EGP</span>
           <Input 
             type="number"
             min={0}
             value={value || ""}
             onChange={(e) => onChange(Number(e.target.value))}
             placeholder="0.00"
             className="border-0 shadow-none bg-transparent text-2xl font-black focus-visible:ring-0 px-0 placeholder:text-muted-foreground/30 font-mono text-emerald-950 dark:text-emerald-50"
           />
         </div>
       </div>
    </div>
  );
}

"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, PiggyBank, TrendingUp, Wallet, HeartHandshake, Settings } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { formatNumber } from "@/lib/format-utils";

export function LandingHero() {
  const t = useTranslations("Landing.hero");

  const [salary, setSalary] = React.useState<number>(15000);
  const [salaryInput, setSalaryInput] = React.useState("15,000.00");
  const [allocations, setAllocations] = React.useState({
    emergencyFund: 20,
    investment: 15,
    currentAccount: 60,
    charity: 5,
  });

  const adjustAllocation = (key: keyof typeof allocations, newPercent: number) => {
    const keys = Object.keys(allocations) as Array<keyof typeof allocations>;
    const otherKeys = keys.filter((k) => k !== key);
    const oldPercent = allocations[key];
    const diff = newPercent - oldPercent;
    
    // We need to distribute -diff among otherKeys.
    const otherSum = otherKeys.reduce((sum, k) => sum + allocations[k], 0);
    
    let newAllocations = { ...allocations, [key]: newPercent };
    
    if (otherSum === 0) {
      // If others are all 0, distribute evenly
      const share = -diff / otherKeys.length;
      otherKeys.forEach((k) => {
        newAllocations[k] = Math.max(0, Math.min(100, newAllocations[k] + share));
      });
    } else {
      // Distribute proportionally
      let remainingDiff = -diff;
      let activeKeys = [...otherKeys];
      
      while (Math.abs(remainingDiff) > 0.01 && activeKeys.length > 0) {
        const activeSum = activeKeys.reduce((sum, k) => sum + newAllocations[k], 0);
        if (activeSum === 0) {
          const share = remainingDiff / activeKeys.length;
          activeKeys.forEach((k) => {
            newAllocations[k] = Math.max(0, newAllocations[k] + share);
          });
          break;
        }
        
        let nextActiveKeys: typeof activeKeys = [];
        let distributed = 0;
        
        for (const k of activeKeys) {
          const proportion = newAllocations[k] / activeSum;
          const share = remainingDiff * proportion;
          const target = newAllocations[k] + share;
          
          if (target < 0) {
            distributed += -newAllocations[k];
            newAllocations[k] = 0;
          } else if (target > 100) {
            distributed += (100 - newAllocations[k]);
            newAllocations[k] = 100;
          } else {
            newAllocations[k] = target;
            distributed += share;
            nextActiveKeys.push(k);
          }
        }
        remainingDiff -= distributed;
        activeKeys = nextActiveKeys;
      }
    }
    
    // Round to whole numbers and ensure they sum to exactly 100
    let roundedAllocations = {
      emergencyFund: Math.round(newAllocations.emergencyFund),
      investment: Math.round(newAllocations.investment),
      currentAccount: Math.round(newAllocations.currentAccount),
      charity: Math.round(newAllocations.charity),
    };
    
    // Adjust for any rounding error to make sum exactly 100
    const sum = roundedAllocations.emergencyFund + roundedAllocations.investment + roundedAllocations.currentAccount + roundedAllocations.charity;
    const error = 100 - sum;
    if (error !== 0) {
      const targetKey = key;
      const targetVal = roundedAllocations[targetKey] + error;
      if (targetVal >= 0 && targetVal <= 100) {
        roundedAllocations[targetKey] = targetVal;
      } else {
        roundedAllocations.currentAccount = Math.max(0, Math.min(100, roundedAllocations.currentAccount + error));
      }
    }
    
    setAllocations(roundedAllocations);
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9,.]*$/.test(val)) {
      setSalaryInput(val);
      const numericVal = parseFloat(val.replace(/,/g, ""));
      if (!isNaN(numericVal) && numericVal >= 0) {
        setSalary(numericVal);
      }
    }
  };

  const handleSalaryBlur = () => {
    if (!salaryInput || isNaN(parseFloat(salaryInput.replace(/,/g, "")))) {
      setSalaryInput(formatNumber(15000, { precision: 2 }));
      setSalary(15000);
    } else {
      setSalaryInput(formatNumber(salary, { precision: 2 }));
    }
  };

  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 min-h-[921px] flex items-center overflow-hidden rtl:flex-col-reverse">
      {/* Abstract gradient blob */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[70%] bg-linear-to-br from-primary/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-[30%] -left-[10%] w-[40%] h-[60%] bg-linear-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-50"></div>
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
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer focus:outline-none">
                      <Settings className="size-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="end">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-sm text-primary leading-none mb-1">
                          {t("adjustAllocations") || "Adjust Allocations"}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {t("adjustAllocationsDesc") || "Drag sliders to change your distribution splits."}
                        </p>
                      </div>
                      <div className="space-y-4 border-t border-border pt-3">
                        {/* Emergency Fund */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold flex items-center gap-1.5">
                              <PiggyBank className="size-3.5 text-primary" />
                              {t("emergencyFund")}
                            </span>
                            <span className="font-bold text-primary">{allocations.emergencyFund}%</span>
                          </div>
                          <Slider 
                            value={[allocations.emergencyFund]} 
                            onValueChange={(val) => adjustAllocation("emergencyFund", val[0])}
                            max={100}
                            step={1}
                          />
                        </div>

                        {/* Investment */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold flex items-center gap-1.5">
                              <TrendingUp className="size-3.5 text-amber-500" />
                              {t("investment")}
                            </span>
                            <span className="font-bold text-amber-500">{allocations.investment}%</span>
                          </div>
                          <Slider 
                            value={[allocations.investment]} 
                            onValueChange={(val) => adjustAllocation("investment", val[0])}
                            max={100}
                            step={1}
                          />
                        </div>

                        {/* Current Account */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold flex items-center gap-1.5">
                              <Wallet className="size-3.5 text-blue-500" />
                              {t("currentAccount")}
                            </span>
                            <span className="font-bold text-blue-500">{allocations.currentAccount}%</span>
                          </div>
                          <Slider 
                            value={[allocations.currentAccount]} 
                            onValueChange={(val) => adjustAllocation("currentAccount", val[0])}
                            max={100}
                            step={1}
                          />
                        </div>

                        {/* Charity */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold flex items-center gap-1.5">
                              <HeartHandshake className="size-3.5 text-teal-500" />
                              {t("charity")}
                            </span>
                            <span className="font-bold text-teal-500">{allocations.charity}%</span>
                          </div>
                          <Slider 
                            value={[allocations.charity]} 
                            onValueChange={(val) => adjustAllocation("charity", val[0])}
                            max={100}
                            step={1}
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="p-8 space-y-8">
                <div className="text-center pb-8 border-b border-border/50 flex flex-col items-center justify-center">
                  <span className="block text-sm font-medium text-muted-foreground mb-2">{t("salaryLabel")}</span>
                  <div className="relative flex items-center justify-center w-full max-w-[240px]">
                    <input
                      type="text"
                      value={salaryInput}
                      onChange={handleSalaryChange}
                      onBlur={handleSalaryBlur}
                      className="w-full text-center text-4xl font-black text-primary tracking-tight bg-transparent border-b border-dashed border-primary/20 hover:border-primary/40 focus:border-primary focus:outline-none py-0.5 transition-colors font-sans"
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Allocation Items */}
                  <AllocationItem 
                    icon={<PiggyBank className="size-6" />}
                    title={t("emergencyFund")}
                    percent={allocations.emergencyFund}
                    amount={formatNumber(salary * (allocations.emergencyFund / 100), { precision: 2 })}
                    color="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                    progressColor="bg-primary"
                  />

                  <AllocationItem 
                    icon={<TrendingUp className="size-6" />}
                    title={t("investment")}
                    percent={allocations.investment}
                    amount={formatNumber(salary * (allocations.investment / 100), { precision: 2 })}
                    color="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                    progressColor="bg-amber-500"
                  />

                  <AllocationItem 
                    icon={<Wallet className="size-6" />}
                    title={t("currentAccount")}
                    percent={allocations.currentAccount}
                    amount={formatNumber(salary * (allocations.currentAccount / 100), { precision: 2 })}
                    color="bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                    progressColor="bg-blue-500"
                    fillOpacity="opacity-30"
                  />

                  <AllocationItem 
                    icon={<HeartHandshake className="size-6" />}
                    title={t("charity")}
                    percent={allocations.charity}
                    amount={formatNumber(salary * (allocations.charity / 100), { precision: 2 })}
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

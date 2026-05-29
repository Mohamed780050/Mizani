"use client";

import { useState, useActionState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addIncomeAction } from "../actions/income-actions";
import { Loader2, Plus, Coins, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { DatePicker } from "@/components/ui/date-picker";
import { NumberFormatting } from "@/components/ui/NumberFormatting";

const initialState = { success: false as const, error: "" };

export function AddIncomeSheet({
  defaultAllocations,
}: {
  defaultAllocations: {
    EXPENSES: number;
    INVESTMENT: number;
    SAVINGS: number;
    CHARITY: number;
  };
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Income");
  const td = useTranslations("Dashboard");
  const locale = useLocale();

  const [amount, setAmount] = useState<number | "">("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [allocations, setAllocations] = useState(defaultAllocations);

  const [state, formAction, isPending] = useActionState(
    addIncomeAction,
    initialState,
  );

  // Reset form when sheet opens
  useEffect(() => {
    if (open) {
      setAmount("");
      setSource("");
      setDate(new Date());
      setAllocations(defaultAllocations);
    }
  }, [open, defaultAllocations]);

  // React to successful submission
  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state]);

  // Derive display error from action result
  const displayError = !state.success && state.error ? state.error : "";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 bg-emerald-950 dark:bg-emerald-50 text-white dark:text-emerald-950 font-bold p-2.5 sm:px-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_4px_16px_-4px_rgba(4,43,38,0.3)]">
          <Plus className="size-4" />
          <span className="hidden sm:inline">{t("trigger")}</span>
        </button>
      </SheetTrigger>
      <SheetContent
        className="w-full sm:max-w-md border-s-border/50 bg-[#f7f9ff] dark:bg-[#080b0e] overflow-y-auto px-4"
        side="right"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <SheetHeader className="text-start space-y-2 pt-6">
          <SheetTitle className="text-2xl font-black tracking-tight text-emerald-950 dark:text-emerald-50">
            {t("title")}
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {t("description")}
          </SheetDescription>
        </SheetHeader>

        <form
          dir={locale === "ar" ? "rtl" : "ltr"}
          action={formAction}
          className="space-y-8 mt-8 pb-10"
        >
          {/* Hidden field for server action */}
          <input
            disabled={isPending}
            type="hidden"
            name="data"
            value={JSON.stringify({
              amount: Number(amount),
              source,
              date: date?.toISOString(),
              allocations,
            })}
          />

          {displayError && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-xl border border-destructive/20 text-sm font-medium">
              {displayError}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">
                {t("sourceLabel")}
              </label>
              <Input
                disabled={isPending}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder={t("sourcePlaceholder")}
                required
                maxLength={100}
                className="bg-card border-none shadow-sm rounded-xl py-6 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">
                {t("amountLabel")}
              </label>
              <div className="relative">
                <Coins className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
                <Input
                  disabled={isPending}
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="0.00"
                  required
                  className="bg-card border-none shadow-sm rounded-xl py-6 pl-12 rtl:pl-4 rtl:pr-12 font-black text-xl text-emerald-600 dark:text-emerald-400 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">
                {t("dateLabel")}
              </label>
              <DatePicker
                date={date}
                setDate={setDate}
                placeholder={t("dateLabel")}
              />
            </div>
          </div>

          {/* Dynamic Splitting Preview */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("allocationTitle")}
              </label>
              <span className="text-xs font-bold font-mono text-muted-foreground">
                <NumberFormatting
                  value={Object.values(allocations).reduce((a, b) => a + b, 0)}
                  precision={0}
                />
                %
              </span>
            </div>

            <div className="space-y-3 bg-card p-4 rounded-2xl border border-border/50">
              <AllocationRow
                name={td("expenses")}
                color="bg-slate-500"
                value={allocations.EXPENSES}
              />
              <AllocationRow
                name={td("investment")}
                color="bg-emerald-500"
                value={allocations.INVESTMENT}
              />
              <AllocationRow
                name={td("savings")}
                color="bg-blue-500"
                value={allocations.SAVINGS}
              />
              <AllocationRow
                name={td("charity")}
                color="bg-rose-500"
                value={allocations.CHARITY}
              />
            </div>

            <p className="text-xs text-muted-foreground text-center pt-2">
              {t("allocationNote")}
            </p>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full py-7 bg-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            {isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                <span>{t("submitButton")}</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
              </>
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function AllocationRow({
  name,
  color,
  value,
}: {
  name: string;
  color: string;
  value: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm font-semibold">
        <div className="flex items-center gap-2">
          <div className={`size-2.5 rounded-full ${color}`} />
          <span>{name}</span>
        </div>
        <span className="font-mono text-muted-foreground">
          <NumberFormatting value={value} precision={0} />%
        </span>
      </div>
      {/* Visual Bar */}
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

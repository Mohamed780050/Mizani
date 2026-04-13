"use client";

import React, { useState, useTransition, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addExpenseAction } from "../actions/expense-actions";
import { Loader2, Calendar, Coins, ArrowRight, Minus } from "lucide-react";

type Category = { id: string; name: string; emoji: string; isDefault: boolean };

export function AddExpenseSheet({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [amount, setAmount] = useState<number | "">("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [expenseType, setExpenseType] = useState("VARIABLE");
  const [necessity, setNecessity] = useState("ESSENTIAL");
  const [frequency, setFrequency] = useState("ONE_TIME");

  useEffect(() => {
    if (open) {
      setAmount("");
      setTitle("");
      setDate(new Date().toISOString().split("T")[0]);
      setExpenseType("VARIABLE");
      setNecessity("ESSENTIAL");
      setFrequency("ONE_TIME");
      if (categories.length > 0) setCategoryId(categories[0].id);
      setError("");
    }
  }, [open, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    if (!categoryId) {
      setError("Please select a category");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          amount: Number(amount),
          title,
          date: new Date(date).toISOString(),
          categoryId,
          expenseType,
          necessity,
          frequency,
        })
      );

      const res = await addExpenseAction(null, formData);

      if (res.success) {
        setOpen(false);
      } else {
        if (res.error === "LIMIT_EXCEEDED") {
           setError("Your free tier limit of 50 monthly expenses has been reached. Upgrade to Pro for unlimited.");
        } else {
           setError(res.error || "Failed to log expense");
        }
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-2 bg-rose-500 text-white font-bold px-4 py-2.5 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_4px_16px_-4px_rgba(244,63,94,0.3)]">
          <Minus className="size-4" />
          <span>Log Expense</span>
        </button>
      </SheetTrigger>
      <SheetContent
        className="w-full sm:max-w-md border-s-border/50 bg-[#f7f9ff] dark:bg-[#080b0e] overflow-y-auto"
        side="right"
      >
        <SheetHeader className="text-left space-y-2 pt-6">
           <SheetTitle className="text-2xl font-black tracking-tight text-rose-950 dark:text-rose-50">Log Deduction</SheetTitle>
           <SheetDescription className="text-muted-foreground">
              Record a withdrawal from your expenses pillar.
           </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8 pb-10">
           {error && (
             <div className="bg-destructive/10 text-destructive p-4 rounded-2xl border border-destructive/20 text-sm font-medium">
               {error}
             </div>
           )}

           <div className="space-y-4">
             {/* Amount */}
             <div className="space-y-1.5">
               <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">Amount (EGP)</label>
               <div className="relative">
                 <Coins className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
                 <Input
                   type="number"
                   min="0.01"
                   step="0.01"
                   value={amount}
                   onChange={(e) => setAmount(Number(e.target.value))}
                   placeholder="0.00"
                   required
                   className="bg-card border-none shadow-sm rounded-xl py-6 pl-12 font-black text-xl text-rose-600 dark:text-rose-400 font-mono"
                 />
               </div>
             </div>

             {/* Title */}
             <div className="space-y-1.5">
               <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">Title / Merchant</label>
               <Input
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
                 placeholder="e.g. Amazon, Uber, Grocery Store"
                 required
                 maxLength={100}
                 className="bg-card border-none shadow-sm rounded-xl py-6 font-semibold"
               />
             </div>

             {/* Category */}
             <div className="space-y-1.5">
               <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">Category</label>
               <Select value={categoryId} onValueChange={setCategoryId}>
                 <SelectTrigger className="w-full bg-card border-none rounded-xl py-6 shadow-sm">
                   <SelectValue placeholder="Select a category" />
                 </SelectTrigger>
                 <SelectContent>
                   {categories.map((c) => (
                     <SelectItem key={c.id} value={c.id}>
                       <div className="flex items-center gap-2 font-medium">
                         <span>{c.emoji}</span>
                         <span>{c.name}</span>
                       </div>
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>

             <div className="grid grid-cols-2 gap-4">
               {/* Necessity */}
               <div className="space-y-1.5">
                 <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">Necessity</label>
                 <Select value={necessity} onValueChange={setNecessity}>
                   <SelectTrigger className="w-full bg-card border-none rounded-xl py-6 shadow-sm font-semibold">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="ESSENTIAL">Essential</SelectItem>
                     <SelectItem value="LUXURY">Luxury</SelectItem>
                   </SelectContent>
                 </Select>
               </div>

               {/* Type */}
               <div className="space-y-1.5">
                 <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">Type</label>
                 <Select value={expenseType} onValueChange={setExpenseType}>
                   <SelectTrigger className="w-full bg-card border-none rounded-xl py-6 shadow-sm font-semibold">
                     <SelectValue />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="FIXED">Fixed</SelectItem>
                     <SelectItem value="VARIABLE">Variable</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             </div>

             {/* Frequency & Date */}
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">Frequency</label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="w-full bg-card border-none rounded-xl py-6 shadow-sm font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_TIME">One Time</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ms-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="bg-card border-none shadow-sm rounded-xl py-6 pl-9 font-semibold"
                    />
                  </div>
                </div>
             </div>
           </div>

           <Button
             type="submit"
             disabled={isPending}
             className="w-full py-7 bg-rose-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-rose-500/20 hover:bg-rose-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4"
           >
             {isPending ? (
               <Loader2 className="size-5 animate-spin" />
             ) : (
               <>
                 <span>Record Deduction</span>
                 <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
               </>
             )}
           </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

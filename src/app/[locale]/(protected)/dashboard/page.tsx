import React from "react";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { Wallet, TrendingUp, PiggyBank, HeartHandshake, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  // Aggregate current balances and recent transactions
  const accounts = await db.financialAccount.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" }
  });

  const recentTransactions = await db.transactionLedger.findMany({
    where: { financialAccount: { userId: session.user.id } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { financialAccount: true }
  });

  const totalWealth = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);

  const getAccountData = (type: string) => {
    return accounts.find(a => a.type === type) || { balance: 0, targetPct: 0 };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
       {/* High Level Overview */}
       <section className="bg-emerald-950 dark:bg-card text-emerald-50 relative overflow-hidden rounded-[32px] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(4,43,38,0.2)]">
          {/* Ambient Abstract glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
             <div className="space-y-1">
               <h2 className="text-emerald-500 font-bold uppercase tracking-widest text-sm">Sanctuary Net Worth</h2>
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl md:text-7xl font-black tracking-tight font-mono">
                   {totalWealth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </span>
                 <span className="text-xl md:text-2xl font-bold text-emerald-500">EGP</span>
               </div>
             </div>
             
             <p className="max-w-md text-emerald-50/70 font-medium">
               Your financial framework is fully initialized. Your wealth is actively distributed across {accounts.length} core pillars.
             </p>
          </div>
       </section>

       {/* Grid of Accounts */}
       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AccountCard 
            title="Expenses" 
            amount={Number(getAccountData("EXPENSES").balance)} 
            icon={Wallet} 
            color="text-slate-600 bg-slate-100 dark:bg-slate-900 dark:text-slate-400"
          />
          <AccountCard 
            title="Investment" 
            amount={Number(getAccountData("INVESTMENT").balance)} 
            icon={TrendingUp} 
            color="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400"
          />
          <AccountCard 
            title="Savings" 
            amount={Number(getAccountData("SAVINGS").balance)} 
            icon={PiggyBank} 
            color="text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
          />
          <AccountCard 
            title="Charity" 
            amount={Number(getAccountData("CHARITY").balance)} 
            icon={HeartHandshake} 
            color="text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400"
          />
       </section>

       {/* Recent Immutable Ledger */}
       <section className="bg-card border border-border/50 rounded-[32px] p-8 shadow-sm">
          <h3 className="text-xl font-bold mb-6 text-emerald-950 dark:text-emerald-50">Recent Ledger Activity</h3>
          
          {recentTransactions.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground font-medium">
                The sanctuary ledger is currently peaceful. Log revenue to begin.
             </div>
          ) : (
            <div className="space-y-1">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-secondary/20 hover:bg-secondary/50 transition-colors rounded-2xl group">
                  <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-xl ${tx.type === "CREDIT" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                        {tx.type === "CREDIT" ? <ArrowDownRight className="size-5" /> : <ArrowUpRight className="size-5" />}
                     </div>
                     <div>
                        <p className="font-semibold text-foreground truncate">{tx.note || tx.refType}</p>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mt-0.5">{tx.financialAccount.type}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className={`font-black font-mono text-lg ${tx.type === "CREDIT" ? "text-emerald-600" : "text-foreground"}`}>
                        {tx.type === "CREDIT" ? "+" : "-"}{Number(tx.amount).toLocaleString()}
                     </p>
                     <p className="text-xs text-muted-foreground font-medium">
                        {new Date(tx.createdAt).toLocaleDateString()}
                     </p>
                  </div>
                </div>
              ))}
            </div>
          )}
       </section>
    </div>
  );
}

function AccountCard({ title, amount, icon: Icon, color }: { title: string; amount: number; icon: any; color: string }) {
  return (
    <div className="bg-card border border-border/50 rounded-[32px] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
       <div className={`absolute -right-4 -top-4 size-24 rounded-full opacity-10 blur-2xl transition-all group-hover:scale-150 ${color.split(' ')[1]}`} />
       
       <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 ${color}`}>
         <Icon className="size-6" />
       </div>
       
       <div className="space-y-1 relative z-10">
         <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
         <p className="text-3xl font-black font-mono text-foreground tracking-tight">
           {amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
         </p>
       </div>
    </div>
  );
}
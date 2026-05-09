"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { dodopayments, useSession } from "@/lib/auth-client";
import { useTranslations } from "next-intl";
import { Loader2, Crown } from "lucide-react";

export function SubscriptionPanel({ subscription }: { subscription: any }) {
  const t = useTranslations("Governance");
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const isPro = subscription?.plan === "pro" && subscription?.status === "active";

  const handleCheckout = () => {
    if (!session?.user) return;
    setError("");
    startTransition(async () => {
      try {
        const { data, error: checkoutError } = await dodopayments.checkout({
          slug: "pro",
          customer: {
            email: session.user.email,
            name: session.user.name,
          },
          billing: {
            city: "",
            country: "US",
            state: "",
            street: "",
            zipcode: "",
          },
        });
        if (checkoutError) {
          setError(t("checkoutError"));
          return;
        }
        if (data?.url) {
          window.location.href = data.url;
        }
      } catch {
        setError(t("checkoutError"));
      }
    });
  };

  const handlePortal = () => {
    setError("");
    startTransition(async () => {
      try {
        const { data: portal, error: portalError } = await dodopayments.customer.portal();
        if (portalError) {
          setError(t("portalError"));
          return;
        }
        if (portal?.url) {
          window.location.href = portal.url;
        }
      } catch {
        setError(t("portalError"));
      }
    });
  };

  return (
    <div className="bg-card border border-border/50 p-5 sm:p-8 rounded-[32px] shadow-sm max-w-2xl relative overflow-hidden">
      <ProBadgeDecoration isActive={true} />
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-2">{t("subsTitle")}</h3>
        <p className="text-muted-foreground text-sm font-medium mb-8">
          {t("subsDesc")}
        </p>

        {error && (
          <div className="text-rose-500 bg-rose-500/10 p-4 rounded-xl text-sm font-bold mb-6">
            {error}
          </div>
        )}

        <SubscriptionDetailsCard 
          subscription={subscription}
          isPending={isPending}
          onCheckout={handleCheckout}
          onPortal={handlePortal}
        />
      </div>
    </div>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────────────────────

function ProBadgeDecoration({ isActive }: { isActive: boolean }) {
  const t = useTranslations("Governance");
  if (!isActive) return null;
  
  return (
    <>
      <div className="absolute -top-10 ltr:-right-10 rtl:-left-10 size-40 bg-amber-500/20 blur-3xl rounded-full" />
      <div className="absolute top-0 ltr:right-0 rtl:left-0 p-4">
        <div className="bg-amber-500 text-white text-[10px] font-black uppercase tracking-tighter px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
           <Crown className="size-3 fill-white" />
           {t("planActive")}
        </div>
      </div>
    </>
  );
}

function SubscriptionDetailsCard({ 
  subscription, 
  isPending, 
  onCheckout, 
  onPortal 
}: { 
  subscription: any, 
  isPending: boolean, 
  onCheckout: () => void, 
  onPortal: () => void 
}) {
  const t = useTranslations("Governance");
  
  const isPro = subscription?.plan === "pro" && subscription?.status === "active";
  const isCancelled = subscription?.status === "cancelled";
  const isExpired = subscription?.status === "expired";
  const isFailed = subscription?.status === "failed";
  const isPaused = subscription?.status === "paused";
  const isOnHold = subscription?.status === "on_hold";
  const needsResubscribe = isCancelled || isExpired || isFailed;

  const statusKey = subscription?.status as string;
  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: t("planActive"), color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    cancelled: { label: t("planCancelled"), color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
    expired: { label: t("planExpired"), color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
    on_hold: { label: t("planOnHold"), color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    paused: { label: t("planPaused"), color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    failed: { label: t("planFailed"), color: "bg-rose-500/10 text-rose-600 border-rose-500/20" },
  };
  const statusInfo = statusMap[statusKey] || statusMap.active;

  return (
    <div className={`p-6 rounded-2xl border ${isPro ? 'border-amber-500/30 bg-linear-to-br from-amber-500/[0.07] to-amber-500/2 backdrop-blur-sm' : 'border-border/50 bg-secondary/20'} flex flex-col sm:flex-row items-start gap-4 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/5`}>
      <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${isPro ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40' : 'bg-primary/10 text-primary'}`}>
         <Crown className="size-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <div className="flex flex-col">
            <h4 className="font-bold text-lg">{isPro ? t("proTitle") : t("freeTitle")}</h4>
            {isPro && <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest -mt-1">Pro Member</span>}
          </div>
          {subscription?.status && (
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-muted-foreground mt-1 mb-2">
          {isPro ? t("proDesc") : t("freeDesc")}
        </p>

        {isPro && subscription?.currentPeriodEnd && (
          <p className="text-xs font-bold text-muted-foreground/70 mb-4">
            {t("renewsOn", { date: new Date(subscription.currentPeriodEnd).toLocaleDateString() })}
          </p>
        )}
        {isCancelled && subscription?.cancelledAt && (
          <p className="text-xs font-bold text-rose-500/70 mb-4">
            {t("cancelledOn", { date: new Date(subscription.cancelledAt).toLocaleDateString() })}
          </p>
        )}

        <SubscriptionActions 
          isPro={isPro} 
          needsResubscribe={needsResubscribe} 
          isPaused={isPaused} 
          isOnHold={isOnHold} 
          isPending={isPending} 
          onPortal={onPortal} 
          onCheckout={onCheckout} 
        />
      </div>
    </div>
  );
}

function SubscriptionActions({ 
  isPro, 
  needsResubscribe, 
  isPaused, 
  isOnHold, 
  isPending, 
  onPortal, 
  onCheckout 
}: { 
  isPro: boolean, 
  needsResubscribe: boolean, 
  isPaused: boolean, 
  isOnHold: boolean, 
  isPending: boolean, 
  onPortal: () => void, 
  onCheckout: () => void 
}) {
  const t = useTranslations("Governance");
  
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {isPro && (
        <Button 
          onClick={onPortal}
          disabled={isPending}
          variant="outline" 
          className="rounded-xl font-bold border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
        >
          {isPending ? <Loader2 className="size-4 animate-spin me-2" /> : null}
          {isPending ? t("portalLoading") : t("managePro")}
        </Button>
      )}

      {!isPro && !needsResubscribe && (
        <Button 
          onClick={onCheckout}
          disabled={isPending}
          className="rounded-xl font-bold"
        >
          {isPending ? <Loader2 className="size-4 animate-spin me-2" /> : null}
          {t("upgrade")}
        </Button>
      )}

      {needsResubscribe && (
        <Button 
          onClick={onCheckout}
          disabled={isPending}
          className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isPending ? <Loader2 className="size-4 animate-spin me-2" /> : null}
          {t("resubscribe")}
        </Button>
      )}

      {(isPaused || isOnHold) && (
        <Button 
          onClick={onPortal}
          disabled={isPending}
          variant="outline" 
          className="rounded-xl font-bold"
        >
          {isPending ? <Loader2 className="size-4 animate-spin me-2" /> : null}
          {t("managePro")}
        </Button>
      )}
    </div>
  );
}

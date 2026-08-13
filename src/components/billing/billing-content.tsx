"use client";

import { useMemo } from "react";

import { useSubscriptionQuery } from "@/services/billingService";
import { PAYMENT_METHOD } from "@/lib/constants/billing";

import { AvailablePlans } from "./available-plans";
import { InvoiceHistory } from "./invoice-history";
import { PaymentMethodCard } from "./payment-method-card";
import { PlanUsageBanner } from "./plan-usage-banner";

import { useAuthStore } from "@/store/auth-store";

export function BillingContent() {
  const { user } = useAuthStore();
  const subscriptionQuery = useSubscriptionQuery();

  const usage = useMemo(() => {
    const sub = subscriptionQuery.data;
    if (!sub) return null;

    return {
      planName: sub.plan_name,
      priceLabel: sub.plan_code,
      designsLabel: `${sub.monthly_designs_used} / ${sub.monthly_design_limit === null ? "Unlimited" : sub.monthly_design_limit
        } designs`,
      used: sub.monthly_designs_used,
      total: sub.monthly_design_limit === 0 ? sub.monthly_designs_used || 0 : sub.monthly_design_limit,
    };
  }, [subscriptionQuery.data]);

  const handleUpgradeClick = () => {
    const plansSection = document.getElementById("available-plans");
    plansSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const planCode = subscriptionQuery.data?.plan_code || (typeof user?.plan === 'string' ? user.plan : user?.plan?.name?.toLowerCase());

  return (
    <div className="flex w-full flex-col gap-6">
      {/* {usage ? (
        <PlanUsageBanner usage={usage} onUpgrade={handleUpgradeClick} />
      ) : null} */}
      <PaymentMethodCard paymentMethod={PAYMENT_METHOD} />
      <div id="available-plans">
        <AvailablePlans currentPlanCode={planCode} />
      </div>
      <InvoiceHistory />
    </div>
  );
}
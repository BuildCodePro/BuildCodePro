// import { BILLING_PLANS } from "@/lib/constants/billing";
// import type { BillingPlan } from "@/lib/constants/billing";

// import { PlanCard } from "./plan-card";

// interface AvailablePlansProps {
//   plans?: BillingPlan[];
//   onSwitch?: (planId: string) => void;
// }

// export function AvailablePlans({
//   plans = BILLING_PLANS,
//   onSwitch,
// }: AvailablePlansProps) {
//   return (
//     <section className="space-y-4">
//       <h2 className="text-section-title font-body">Available Plans</h2>

//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//         {plans.map((plan) => (
//           <PlanCard key={plan.id} plan={plan} onSwitch={onSwitch} />
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

import { useMemo } from "react";

import { useCheckoutMutation, usePlansQuery } from "@/services/billingService";
import type { Plan } from "@/services/billingService";
import type { BillingPlan } from "@/lib/constants/billing";

import { PlanCard } from "./plan-card";

interface AvailablePlansProps {
  currentPlanCode?: string;
  onSwitch?: (planId: string) => void;
}

function mapPlanFeatures(plan: Plan): string[] {
  const labels: Record<keyof Plan["features"], string> = {
    ai_design_engine: "AI Design Engine",
    bom_generation: "BOM Generation",
    pdf_export: "PDF Export",
    compliance_engine: "Compliance Engine",
    csv_export: "CSV Export",
    team_accounts: "Team Accounts",
    dedicated_support: "Dedicated Support",
  };

  return (Object.keys(plan.features) as (keyof Plan["features"])[])
    .filter((key) => plan.features[key])
    .map((key) => labels[key]);
}

function mapToBillingPlan(plan: Plan, currentPlanCode?: string): BillingPlan {
  return {
    id: plan.code,
    name: plan.name,
    price: plan.amount_cents / 100,
    period: "month",
    designsPerMonth:
      plan.monthly_design_limit === 0 ? "Unlimited" : plan.monthly_design_limit,
    features: mapPlanFeatures(plan),
    isCurrentPlan: plan.code === currentPlanCode,
    isPopular: false,
  } as BillingPlan;
}

export function AvailablePlans({
  currentPlanCode,
  onSwitch,
}: AvailablePlansProps) {
  const plansQuery = usePlansQuery();
  const checkoutMutation = useCheckoutMutation();

  const plans = useMemo(() => {
    const items = plansQuery.data?.items ?? [];
    return items.map((plan : any) => mapToBillingPlan(plan, currentPlanCode));
  }, [plansQuery.data, currentPlanCode]);

  const handleSwitch = (planCode: string) => {
    if (onSwitch) {
      onSwitch(planCode);
      return;
    }

    checkoutMutation.mutate(
      { plan_code: planCode },
      {
        onSuccess: (data : any) => {
          window.location.href = data.checkout_url;
        },
      },
    );
  };

  return (
    <section className="space-y-4">
      <h2 className="text-section-title font-body">Available Plans</h2>

      {plansQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-64 animate-pulse rounded-[16px] border border-border bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {plans.map((plan : any) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSwitch={handleSwitch}
            />
          ))}
        </div>
      )}
    </section>
  );
}
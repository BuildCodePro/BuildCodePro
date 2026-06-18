import { BILLING_PLANS } from "@/lib/constants/billing";
import type { BillingPlan } from "@/lib/constants/billing";

import { PlanCard } from "./plan-card";

interface AvailablePlansProps {
  plans?: BillingPlan[];
  onSwitch?: (planId: string) => void;
}

export function AvailablePlans({
  plans = BILLING_PLANS,
  onSwitch,
}: AvailablePlansProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-section-title font-body">Available Plans</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSwitch={onSwitch} />
        ))}
      </div>
    </section>
  );
}

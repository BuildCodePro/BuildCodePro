import { Check, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { BillingPlan } from "@/lib/constants/billing";

interface PlanCardProps {
  plan: BillingPlan;
  onSwitch?: (planId: string) => void;
  isSwitching?: boolean;
  disableSwitch?: boolean;
  className?: string;
}

function formatDesigns(value: BillingPlan["designsPerMonth"]): string {
  if (value === "unlimited") return "Unlimited designs";
  return `${value} designs / month`;
}

export function PlanCard({
  plan,
  onSwitch,
  isSwitching = false,
  disableSwitch = false,
  className,
}: PlanCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-[16px] border bg-white px-6 py-6",
        plan.isCurrent ? "border-primary shadow-sm" : "border-border",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-base font-bold text-foreground">
          {plan.name}
        </h3>
        {plan.isCurrent ? (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 font-body text-xs font-medium text-primary">
            Current Plan
          </span>
        ) : null}
      </div>

      <div className="mt-3 space-y-0.5">
        <p className="font-heading text-[32px] font-bold leading-none text-foreground">
          ${plan.price}
          <span className="font-body text-base font-normal text-stat-label">
            {" "}/mo
          </span>
        </p>
        <p className="font-body text-sm text-stat-label">
          {formatDesigns(plan.designsPerMonth )}
        </p>
      </div>

      <ul className="mt-5 flex flex-1 flex-col gap-2.5">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 font-body text-sm text-foreground"
          >
            <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {plan.isCurrent ? (
          <button
            type="button"
            disabled
            className="h-11 w-full rounded-[10px] border border-border bg-white font-body text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-70"
          >
            Current Plan
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSwitch?.(plan.id)}
            disabled={isSwitching || disableSwitch}
            className={cn(
              "flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-primary font-body text-sm font-semibold text-white transition-colors hover:bg-primary-hover",
              "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-primary",
            )}
          >
            {isSwitching ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Switching...
              </>
            ) : (
              "Switch Plan"
            )}
          </button>
        )}
      </div>
    </article>
  );
}
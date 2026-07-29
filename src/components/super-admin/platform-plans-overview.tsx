
import { Card, CardContent } from "@/components/ui/card";
import type { Plan } from "@/services/billingService";
import type { PlanDistributionItem } from "@/services/adminService";
import { cn } from "@/lib/utils/cn";

interface PlatformPlansOverviewProps {
  plans: Plan[];
  planDistribution: PlanDistributionItem[];
  isLoading?: boolean;
  className?: string;
}

function formatPrice(amountCents: number): string {
  return (amountCents / 100).toFixed(0);
}

export function PlatformPlansOverview({
  plans,
  planDistribution,
  isLoading = false,
  className,
}: PlatformPlansOverviewProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-section-title">Plan Management</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
            <Card key={idx} className="p-5 sm:p-6">
              <CardContent className="space-y-3 p-0">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                <div className="h-8 w-16 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
              </CardContent>
            </Card>
          ))
          : plans.map((plan) => {
            const distribution = planDistribution.find(
              (item) => item.plan_code === plan.code,
            );

            return (
              <Card key={plan.code} className="p-5 sm:p-6">
                <CardContent className="space-y-3 p-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {plan.name}
                    </h3>
                    <span className="font-body text-xs text-stat-label">
                      {distribution?.company_count ?? 0} companies
                    </span>
                  </div>

                  <p className="font-heading text-3xl font-bold text-foreground">
                    ${formatPrice(plan.amount_cents)}
                    <span className="font-body text-sm font-normal text-stat-label">
                      {" "}
                      /mo
                    </span>
                  </p>

                  <p className="font-body text-sm text-stat-label">
                    {plan.monthly_design_limit === 0
                      ? "Unlimited designs"
                      : `${plan.monthly_design_limit} designs / month`}
                  </p>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </section>
  );
}
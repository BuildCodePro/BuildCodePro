import { Card, CardContent } from "@/components/ui/card";
import { PLATFORM_PLANS } from "@/lib/constants/super-admin";
import { cn } from "@/lib/utils/cn";

interface PlatformPlansOverviewProps {
  className?: string;
}

export function PlatformPlansOverview({ className }: PlatformPlansOverviewProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-section-title">Plan Management</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLATFORM_PLANS.map((plan) => (
          <Card key={plan.id} className="p-5 sm:p-6">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-base font-bold text-foreground">
                  {plan.name}
                </h3>
                <span className="font-body text-xs text-stat-label">
                  {plan.activeCompanies} companies
                </span>
              </div>

              <p className="font-heading text-3xl font-bold text-foreground">
                ${plan.price}
                <span className="font-body text-sm font-normal text-stat-label">
                  {" "}/mo
                </span>
              </p>

              <p className="font-body text-sm text-stat-label">
                {typeof plan.designsPerMonth === "number"
                  ? `${plan.designsPerMonth} designs / month`
                  : `${plan.designsPerMonth} designs`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

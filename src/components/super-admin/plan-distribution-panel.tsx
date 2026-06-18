import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { planDistribution } from "@/lib/data/super-admin";
import { cn } from "@/lib/utils/cn";

interface PlanDistributionPanelProps {
  className?: string;
}

export function PlanDistributionPanel({ className }: PlanDistributionPanelProps) {
  return (
    <Card className={cn(className)}>
      <CardContent className="p-5 sm:p-6">
        <CardHeader className="mb-4">
          <CardTitle>Subscription Distribution</CardTitle>
        </CardHeader>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {planDistribution.map((item) => (
            <div
              key={item.plan}
              className="rounded-[12px] border border-border bg-surface px-4 py-4"
            >
              <p className="font-body text-sm font-semibold text-foreground">
                {item.plan}
              </p>
              <p className="mt-1 font-heading text-2xl font-bold text-foreground">
                {item.count}
              </p>
              <p className="mt-1 font-body text-xs text-stat-label">
                {item.revenue}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils/cn";
import type { EstimatorUsage } from "@/types/estimator";

interface EstimatorUsageBannerProps {
  usage: EstimatorUsage;
  className?: string;
}

export function EstimatorUsageBanner({
  usage,
  className,
}: EstimatorUsageBannerProps) {
  const usagePercent = usage.total > 0 ? Math.round((usage.used / usage.total) * 100) : 0;

  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-[16px] border border-border bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8",
        className,
      )}
    >
      <div className="min-w-0 space-y-1">
        <h2 className="font-body text-sm font-semibold text-foreground">
          Monthly Design Usage
        </h2>
        <p className="font-body text-xs text-stat-label">
          {usage.planName} &bull; Contact your admin to upgrade if limit is
          reached
        </p>
      </div>

      <div className="w-full space-y-2 sm:max-w-xs">
        <p className="text-right font-body text-xs text-stat-label">
          {usage.used} / {usage.total} designs used this month
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${usagePercent}%` }}
            role="progressbar"
            aria-valuenow={usage.used}
            aria-valuemin={0}
            aria-valuemax={usage.total}
            aria-label="Designs used this month"
          />
        </div>
      </div>
    </section>
  );
}

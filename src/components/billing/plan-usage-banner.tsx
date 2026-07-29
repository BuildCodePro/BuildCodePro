
import { ArrowUpRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface UsageData {
  planName: string;
  priceLabel: string;
  designsLabel: string;
  used: number;
  total: number;
}

interface PlanUsageBannerProps {
  usage: UsageData;
  onUpgrade?: () => void;
  className?: string;
}

export function PlanUsageBanner({
  usage,
  onUpgrade,
  className,
}: PlanUsageBannerProps) {
  const usagePercent =
    usage.total > 0 ? Math.round((usage.used / usage.total) * 100) : 0;

  return (
    <section
      className={cn(
        "flex flex-col gap-6 rounded-[16px] bg-sidebar px-6 py-6 text-white sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="min-w-0 shrink-0 space-y-1">
        <h2 className="font-heading text-xl font-bold sm:text-2xl">
          {usage.planName || "No Subscription"}
        </h2>
        {usage.priceLabel && usage.designsLabel && (

          <p className="font-body text-sm text-slate-400">
            {usage.priceLabel} &bull; {usage.designsLabel}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-4 lg:max-w-xl lg:flex-1 lg:flex-row lg:items-center lg:justify-end lg:gap-6">
        <div className="w-full space-y-2 lg:max-w-sm">
          {usage.used === 1 && usage.total && (
            <>
              <p className="text-right font-body text-xs text-slate-400">
                {usage.used} / {usage.total} designs used this month
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-ai-cyan transition-all duration-500"
                  style={{ width: `${usagePercent}%` }}
                  role="progressbar"
                  aria-valuenow={usage.used}
                  aria-valuemin={0}
                  aria-valuemax={usage.total}
                  aria-label="Designs used this month"
                />
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onUpgrade}
          className={cn(
            buttonVariants({ variant: "primary" }),
            "h-11 w-full max-w-none shrink-0 gap-2 px-6 lg:w-auto",
          )}
        >
          <ArrowUpRight className="size-4" aria-hidden="true" />
          Upgrade Plan
        </button>
      </div>
    </section>
  );
}
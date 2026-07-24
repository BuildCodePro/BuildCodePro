import { AlertTriangle, Check, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/circular-progress";
import { cn } from "@/lib/utils/cn";
import { formatGeneratedDate } from "@/lib/utils/format-project-metadata";

interface ComplianceScoreHeaderProps {
  score: number;
  subtitle: string;
  statusLabel: string;
  reviewCount: number;
  generatedAt?: string;
  onExport?: () => void;
  className?: string;
}

export function ComplianceScoreHeader({
  score,
  subtitle,
  statusLabel,
  reviewCount,
  generatedAt,
  onExport,
  className,
}: ComplianceScoreHeaderProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-6 rounded-[16px] bg-sidebar px-6 py-6 text-white sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center">
        <CircularProgress
          value={score}
          size={104}
          strokeWidth={8}
          trackClassName="text-slate-700"
          valueClassName="!text-2xl text-white"
          aria-label={`NFPA ${Math.round(score)}% compliance score`}
          className="shrink-0"
        />

        <div className="min-w-0 space-y-3">
          <div className="space-y-2">
            <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
              {`NFPA ${Math.round(score)}% Compliance Score`}
            </h2>
            <p className="font-body text-sm text-slate-400">{subtitle}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 font-body text-xs font-medium text-emerald-400">
              <Check className="size-3.5" aria-hidden="true" />
              {statusLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 font-body text-xs font-medium text-amber-400">
              <AlertTriangle className="size-3.5" aria-hidden="true" />
              {reviewCount} Items to Review
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
        <Button
          type="button"
          variant="primary"
          className="h-11 max-w-none gap-2 px-5"
          onClick={onExport}
        >
          <Upload className="size-4" aria-hidden="true" />
          Export Report
        </Button>
        <p className="font-body text-xs text-slate-500">
          Generated {formatGeneratedDate(generatedAt)}
        </p>
      </div>
    </section>
  );
}

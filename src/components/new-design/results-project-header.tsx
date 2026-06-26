import { Check, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatGeneratedDate } from "@/lib/utils/format-project-metadata";

interface ResultsProjectHeaderProps {
  projectName: string;
  metadata: string;
  generatedAt?: string;
  onExport?: () => void;
  className?: string;
}

export function ResultsProjectHeader({
  projectName,
  metadata,
  generatedAt,
  onExport,
  className,
}: ResultsProjectHeaderProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-6 rounded-[16px] bg-sidebar px-6 py-6 text-white sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 font-body text-xs font-medium text-emerald-400">
          <Check className="size-3.5" aria-hidden="true" />
          Completed
        </span>

        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-[28px]">
            {projectName}
          </h2>
          <p className="font-body text-sm text-slate-400">{metadata}</p>
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

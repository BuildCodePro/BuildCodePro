import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisInputRow } from "@/lib/utils/format-analysis-inputs";
import { cn } from "@/lib/utils/cn";

interface AnalysisInputsPanelProps {
  rows: AnalysisInputRow[];
  onCancel?: () => void;
  retryAi?: () => void;
  // Whether each action is currently allowed given the analysis job's
  // lifecycle state (running / completed / failed / cancelled).
  canRetry?: boolean;
  canCancel?: boolean;
  // Whether each action's mutation is currently in flight.
  isRetrying?: boolean;
  isCancelling?: boolean;
  className?: string;
}

export function AnalysisInputsPanel({
  rows,
  onCancel,
  retryAi,
  canRetry = false,
  canCancel = false,
  isRetrying = false,
  isCancelling = false,
  className,
}: AnalysisInputsPanelProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Card>
        <CardContent className="space-y-4">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Analysis Inputs</CardTitle>
            <CardDescription>Submitted project data</CardDescription>
          </CardHeader>

          <dl className="divide-y divide-border">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <dt className="shrink-0 font-body text-sm text-stat-label">
                  {row.label}
                </dt>
                <dd className="font-body text-sm font-semibold text-foreground sm:text-right">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>


      <div className="flex justify-end flex-col gap-2">
        <Button
          type="button"
          variant="primary"
          className="h-11 max-w-none px-6 "
          onClick={retryAi}
          disabled={!canRetry || isRetrying}
        >
          {isRetrying ? "Retrying..." : "Retry Analysis"}
        </Button>
        {/* <Button
          type="button"
          variant="outline"
          className="h-11 max-w-none px-6"
          onClick={onCancel}
          disabled={!canCancel || isCancelling}
        >
          {isCancelling ? "Cancelling..." : "Cancel Analysis"}
        </Button> */}
      </div>

    </div>
  );
}
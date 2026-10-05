import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProjectIntakeResponse } from "@/types/project-intake";

const ACTIVITY_LABELS: Record<string, string> = {
  list_pages: "Listing sheets",
  view_page: "Looking at a sheet",
  zoom_page_region: "Reading the title block and code table",
  get_page_text: "Reading sheet text",
  find_pages: "Finding the code analysis sheet",
  reading_drawings: "Opening drawings",
};

interface IntakeStatusBannerProps {
  intake: ProjectIntakeResponse | undefined;
  activity: string | null;
  filledFieldCount: number;
  onRetry: () => void;
  isRetrying: boolean;
}

export function IntakeStatusBanner({ intake, activity, filledFieldCount, onRetry, isRetrying }: IntakeStatusBannerProps) {
  if (!intake) return null;
  if (intake.status === "pending" || intake.status === "running") {
    return (
      <div role="status" className="flex items-center gap-3 rounded-xl border border-accent-cyan/40 bg-accent-cyan/5 px-4 py-3" data-testid="intake-status">
        <Loader2 className="size-4 animate-spin text-accent-cyan" />
        <p className="font-body text-sm text-accent-cyan">
          Reading cover and code sheets{activity ? ` · ${ACTIVITY_LABELS[activity] ?? activity}` : ""}. The form fills in when it&apos;s done.
        </p>
      </div>
    );
  }
  if (intake.status === "failed") {
    return (
      <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/50 bg-amber-50 px-4 py-3 dark:bg-amber-950/30" data-testid="intake-status">
        <p className="font-body text-sm text-amber-800 dark:text-amber-300">
          We couldn&apos;t read the project details from the drawings{intake.error_message ? ` (${intake.error_message})` : ""}. Fill in the form below.
        </p>
        <Button type="button" variant="outline" className="h-9 w-auto px-4 text-sm" onClick={onRetry} disabled={isRetrying}>
          Try again
        </Button>
      </div>
    );
  }
  const reviewFieldCount = Object.values(intake.result ?? {}).filter(
    (intakeField) => typeof intakeField === "object" && intakeField !== null && "review_note" in intakeField && Boolean(intakeField.review_note),
  ).length;
  return (
    <div role="status" className="space-y-2 rounded-xl border border-emerald-500/40 bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30" data-testid="intake-status">
      <p className="font-body text-sm font-semibold text-emerald-800 dark:text-emerald-300">
        Filled {filledFieldCount} field{filledFieldCount === 1 ? "" : "s"} from the drawings
        {reviewFieldCount > 0 ? ` · ${reviewFieldCount} need${reviewFieldCount === 1 ? "s" : ""} review` : ""}. Check each one, especially any highlighted in amber.
      </p>
    </div>
  );
}

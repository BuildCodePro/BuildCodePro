import { cn } from "@/lib/utils/cn";
import { INTAKE_LOW_CONFIDENCE } from "@/lib/utils/project-intake";
import type { IntakeFieldSource as IntakeFieldSourceData } from "@/types/project-intake";

export function IntakeFieldSource({ source }: { source?: IntakeFieldSourceData }) {
  if (!source) return null;
  const needsReview = source.confidence < INTAKE_LOW_CONFIDENCE || Boolean(source.reviewNote);
  return (
    <p
      className={cn(
        "-mt-2 font-body text-xs",
        needsReview ? "rounded-md bg-amber-50 px-2 py-1 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300" : "text-stat-label",
      )}
      data-testid="intake-field-source"
    >
      {source.confidence > 0
        ? `${source.sourceLabel} · ${Math.round(source.confidence * 100)}% confidence${source.reviewNote ? ` — ${source.reviewNote}` : needsReview ? " — please check" : ""}`
        : source.reviewNote ?? "Not found on drawings"}
    </p>
  );
}

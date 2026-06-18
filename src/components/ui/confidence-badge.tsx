import { cn } from "@/lib/utils/cn";

const CONFIDENCE_HIGH_THRESHOLD = 90;

interface ConfidenceBadgeProps {
  confidence: number;
  className?: string;
}

export function ConfidenceBadge({ confidence, className }: ConfidenceBadgeProps) {
  const isHigh = confidence >= CONFIDENCE_HIGH_THRESHOLD;

  return (
    <span
      className={cn(
        "inline-flex min-w-[44px] items-center justify-center rounded-full px-2.5 py-1 font-body text-xs font-semibold",
        isHigh ? "bg-emerald-50 text-success" : "bg-amber-50 text-warning",
        className,
      )}
    >
      {confidence}%
    </span>
  );
}

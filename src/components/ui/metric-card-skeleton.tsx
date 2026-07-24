import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardSkeletonProps {
  className?: string;
  hasDescription?: boolean;
}

export function MetricCardSkeleton({
  className,
  hasDescription = false,
}: MetricCardSkeletonProps) {
  return (
    <article
      className={cn(
        "flex min-h-[100px] flex-col justify-center gap-2 rounded-[16px] border border-border bg-white px-5 py-3",
        className,
      )}
    >
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-7 w-3/4" />
      {hasDescription ? (
        <Skeleton className="mt-1 h-3 w-5/6" />
      ) : null}
    </article>
  );
}

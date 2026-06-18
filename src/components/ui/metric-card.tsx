import { cn } from "@/lib/utils/cn";

export interface MetricCardProps {
  label: string;
  value: string;
  description?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  description,
  className,
}: MetricCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[100px] flex-col justify-center gap-1.5 rounded-[16px] border border-border bg-white px-5 py-3",
        className,
      )}
    >
      <p className="text-stat-label">{label}</p>
      <p className="text-stat-value">{value}</p>
      {description ? (
        <p className="font-body text-xs text-stat-label">{description}</p>
      ) : null}
    </article>
  );
}

interface MetricCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export function MetricCardGrid({ children, className }: MetricCardGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

import { cn } from "@/lib/utils/cn";
import type { DashboardStat } from "@/types/dashboard";

interface StatCardProps {
  stat: DashboardStat;
  className?: string;
}

const changeStyles = {
  success: "text-success",
  warning: "text-warning",
  neutral: "text-stat-label",
} as const;

export function StatCard({ stat, className }: StatCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[100px] min-w-[200px] flex-1 flex-col justify-center gap-[7px] rounded-[16px] border border-border bg-white px-5 py-[11px]",
        className,
      )}
    >
      <p className="text-stat-label">{stat.label}</p>
      <p className="text-stat-value">{stat.value}</p>
      {stat.change ? (
        <p className={cn("font-body text-xs leading-none", changeStyles[stat.change.variant])}>
          {stat.change.text}
        </p>
      ) : null}
      {stat.progress !== undefined ? (
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${stat.progress}%` }}
          />
        </div>
      ) : null}
    </article>
  );
}

interface StatsGridProps {
  stats: DashboardStat[];
  className?: string;
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}

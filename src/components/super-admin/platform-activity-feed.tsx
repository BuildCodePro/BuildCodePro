import { platformActivity } from "@/lib/data/super-admin";
import type { PlatformActivity } from "@/types/super-admin";
import { cn } from "@/lib/utils/cn";

interface PlatformActivityFeedProps {
  activities?: PlatformActivity[];
  className?: string;
}

const typeStyles: Record<PlatformActivity["type"], string> = {
  signup: "bg-sky-50 text-sky-700",
  upgrade: "bg-emerald-50 text-success",
  design: "bg-violet-50 text-violet-700",
  support: "bg-amber-50 text-warning",
  billing: "bg-primary/10 text-primary",
};

const typeLabels: Record<PlatformActivity["type"], string> = {
  signup: "Signup",
  upgrade: "Upgrade",
  design: "Design",
  support: "Support",
  billing: "Billing",
};

export function PlatformActivityFeed({
  activities = platformActivity,
  className,
}: PlatformActivityFeedProps) {
  return (
    <section
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <h2 className="mb-4 text-section-title">Recent Platform Activity</h2>

      <ul className="space-y-3">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex flex-col gap-2 rounded-[12px] border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={cn(
                  "inline-flex shrink-0 rounded-full px-2 py-1 font-body text-[11px] font-semibold uppercase",
                  typeStyles[activity.type],
                )}
              >
                {typeLabels[activity.type]}
              </span>
              <p className="font-body text-sm text-foreground">
                {activity.message}
              </p>
            </div>
            <span className="shrink-0 font-body text-xs text-stat-label sm:pl-4">
              {activity.timestamp}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

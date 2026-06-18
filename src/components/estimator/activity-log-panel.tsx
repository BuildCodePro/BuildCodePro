import { Activity } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { ProjectActivityEntry } from "@/types/estimator";

interface ActivityLogPanelProps {
  entries: ProjectActivityEntry[];
  className?: string;
}

export function ActivityLogPanel({ entries, className }: ActivityLogPanelProps) {
  return (
    <section
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-2">
        <Activity className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-section-title">Activity Log</h2>
      </div>

      <ul className="space-y-0">
        {entries.map((entry, index) => (
          <li
            key={entry.id}
            className={cn(
              "relative flex gap-4 pb-6 pl-6",
              index < entries.length - 1 &&
                "before:absolute before:top-2 before:left-[7px] before:h-[calc(100%-8px)] before:w-px before:bg-border",
            )}
          >
            <span
              className="absolute top-1.5 left-0 size-[14px] rounded-full border-2 border-primary bg-white"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-surface px-2.5 py-0.5 font-body text-xs font-medium text-foreground">
                  {entry.action}
                </span>
                <span className="font-body text-xs text-stat-label">
                  {entry.timestamp}
                </span>
              </div>
              <p className="font-body text-sm text-foreground">
                {entry.description}
              </p>
              <p className="font-body text-xs text-stat-label">
                by {entry.actor}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// import { platformActivity } from "@/lib/data/super-admin";
// import type { PlatformActivity } from "@/types/super-admin";
// import { cn } from "@/lib/utils/cn";

// interface PlatformActivityFeedProps {
//   activities?: PlatformActivity[];
//   className?: string;
// }

// const typeStyles: Record<PlatformActivity["type"], string> = {
//   signup: "bg-sky-50 text-sky-700",
//   upgrade: "bg-emerald-50 text-success",
//   design: "bg-violet-50 text-violet-700",
//   support: "bg-amber-50 text-warning",
//   billing: "bg-primary/10 text-primary",
// };

// const typeLabels: Record<PlatformActivity["type"], string> = {
//   signup: "Signup",
//   upgrade: "Upgrade",
//   design: "Design",
//   support: "Support",
//   billing: "Billing",
// };

// export function PlatformActivityFeed({
//   activities = platformActivity,
//   className,
// }: PlatformActivityFeedProps) {
//   return (
//     <section
//       className={cn(
//         "rounded-[16px] border border-border bg-white p-5 sm:p-6",
//         className,
//       )}
//     >
//       <h2 className="mb-4 text-section-title">Recent Platform Activity</h2>

//       <ul className="space-y-3">
//         {activities.map((activity) => (
//           <li
//             key={activity.id}
//             className="flex flex-col gap-2 rounded-[12px] border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
//           >
//             <div className="flex min-w-0 items-start gap-3">
//               <span
//                 className={cn(
//                   "inline-flex shrink-0 rounded-full px-2 py-1 font-body text-[11px] font-semibold uppercase",
//                   typeStyles[activity.type],
//                 )}
//               >
//                 {typeLabels[activity.type]}
//               </span>
//               <p className="font-body text-sm text-foreground">
//                 {activity.message}
//               </p>
//             </div>
//             <span className="shrink-0 font-body text-xs text-stat-label sm:pl-4">
//               {activity.timestamp}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }



"use client";

import { useAdminActivityQuery } from "@/services/adminService";
import type { ActivityTag } from "@/services/adminService";
import { cn } from "@/lib/utils/cn";

interface PlatformActivityFeedProps {
  className?: string;
}

const typeStyles: Record<ActivityTag, string> = {
  signup: "bg-sky-50 text-sky-700",
  billing: "bg-primary/10 text-primary",
  design: "bg-violet-50 text-violet-700",
  suspension: "bg-red-50 text-red-700",
  user: "bg-amber-50 text-warning",
  project: "bg-emerald-50 text-success",
};

const typeLabels: Record<ActivityTag, string> = {
  signup: "Signup",
  billing: "Billing",
  design: "Design",
  suspension: "Suspension",
  user: "User",
  project: "Project",
};

function formatTimestamp(dateString: string): string {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PlatformActivityFeed({ className }: PlatformActivityFeedProps) {
  const { data, isLoading } = useAdminActivityQuery({
    page: 1,
    page_size: 20,
  });

  const activities = data?.items ?? [];

  return (
    <section
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <h2 className="mb-4 text-section-title">Recent Platform Activity</h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-14 animate-pulse rounded-[12px] border border-border bg-surface"
            />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="font-body text-sm text-stat-label">
          No recent activity.
        </p>
      ) : (
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
                    typeStyles[activity.tag],
                  )}
                >
                  {typeLabels[activity.tag]}
                </span>
                <p className="font-body text-sm text-foreground">
                  {activity.description}
                </p>
              </div>
              <span className="shrink-0 font-body text-xs text-stat-label sm:pl-4">
                {formatTimestamp(activity.created_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
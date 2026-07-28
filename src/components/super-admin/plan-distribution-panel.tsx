// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { planDistribution } from "@/lib/data/super-admin";
// import { cn } from "@/lib/utils/cn";

// interface PlanDistributionPanelProps {
//   className?: string;
// }

// export function PlanDistributionPanel({ className }: PlanDistributionPanelProps) {
//   return (
//     <Card className={cn(className)}>
//       <CardContent className="p-5 sm:p-6">
//         <CardHeader className="mb-4">
//           <CardTitle>Subscription Distribution</CardTitle>
//         </CardHeader>

//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
//           {planDistribution.map((item) => (
//             <div
//               key={item.plan}
//               className="rounded-[12px] border border-border bg-surface px-4 py-4"
//             >
//               <p className="font-body text-sm font-semibold text-foreground">
//                 {item.plan}
//               </p>
//               <p className="mt-1 font-heading text-2xl font-bold text-foreground">
//                 {item.count}
//               </p>
//               <p className="mt-1 font-body text-xs text-stat-label">
//                 {item.revenue}
//               </p>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }



"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboardStatsQuery } from "@/services/adminService";
import { cn } from "@/lib/utils/cn";
import { TableEmptyState } from "../ui/emptyState";
import { Waypoints } from "lucide-react";

interface PlanDistributionPanelProps {
  className?: string;
}

function formatRevenue(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} / mo`;
}

export function PlanDistributionPanel({ className }: PlanDistributionPanelProps) {
  const { data, isLoading } = useAdminDashboardStatsQuery();
  const planDistribution = data?.plan_distribution ?? [];

  return (
    <Card className={cn(className)}>
      <CardContent className="p-5 sm:p-6">
        <CardHeader className="mb-4">
          <CardTitle>Subscription Distribution</CardTitle>
        </CardHeader>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-24 animate-pulse rounded-[12px] border border-border bg-surface"
              />
            ))}
          </div>
        ) : planDistribution.length === 0 ? (
          <p className="font-body text-sm text-stat-label">
            <TableEmptyState title="No plan data available." icon={<Waypoints className="w-8 h-8" />} />
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {planDistribution.map((item) => (
              <div
                key={item.plan_code}
                className="rounded-[12px] border border-border bg-surface px-4 py-4"
              >
                <p className="font-body text-sm font-semibold text-foreground">
                  {item.plan_name}
                </p>
                <p className="mt-1 font-heading text-2xl font-bold text-foreground">
                  {item.company_count}
                </p>
                <p className="mt-1 font-body text-xs text-stat-label">
                  {formatRevenue(item.monthly_revenue_cents)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
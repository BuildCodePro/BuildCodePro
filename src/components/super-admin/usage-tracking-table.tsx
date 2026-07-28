
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SubscriptionUsage } from "@/types/super-admin";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { cn } from "@/lib/utils/cn";
import { TableEmptyState } from "../ui/emptyState";
import { Ticket } from "lucide-react";

interface UsageTrackingTableProps {
  usage: SubscriptionUsage[];
  className?: string;
  isLoading?: boolean;
}

function formatPlan(plan: SubscriptionUsage["plan"]): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

function formatDesignUsage(item: SubscriptionUsage): string {
  if (item.designLimit === "unlimited") {
    return `${item.designsUsed} / Unlimited`;
  }

  return `${item.designsUsed} / ${item.designLimit}`;
}

function formatBillingCycle(cycle: SubscriptionUsage["billingCycle"]): string {
  return cycle
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");
}

export function UsageTrackingTable({
  usage,
  className,
  isLoading = false,
}: UsageTrackingTableProps) {
  if (isLoading) {
    return (
      <TableSkeleton
        columns={7}
        rows={5}
        className={cn("mt-4", className)}
      />
    );
  }

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-section-title">Usage Tracking</h2>

      <div className="rounded-[16px] border border-border bg-white p-5 sm:p-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Company</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Designs Used</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Next Billing</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usage.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-sm text-stat-label"
                >
                  <TableEmptyState title="No subscriptions found." icon={<Ticket className="w-8 h-8" />} />
                </TableCell>
              </TableRow>
            ) : (
              usage.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.companyName}
                  </TableCell>
                  <TableCell className="text-stat-label">
                    {formatPlan(item.plan)}
                  </TableCell>
                  <TableCell className="text-stat-label">
                    {formatDesignUsage(item)}
                  </TableCell>
                  <TableCell className="text-stat-label">
                    {formatBillingCycle(item.billingCycle)}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${item.monthlyAmount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-stat-label">
                    {item.nextBillingDate}
                  </TableCell>
                  <TableCell>
                    {item.atLimit ? (
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 font-body text-xs font-medium text-warning">
                        At Limit
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 font-body text-xs font-medium text-success">
                        Active
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { routes } from "@/config/routes";
import { ENGINEER_REVIEW_STATUS_LABELS } from "@/lib/constants/engineer";
import { cn } from "@/lib/utils/cn";
import type { EngineerReviewStatus, ReviewQueueItem } from "@/types/engineer";

const statusStyles: Record<EngineerReviewStatus, string> = {
  "pending-review": "bg-amber-50 text-amber-700",
  "changes-requested": "bg-red-50 text-primary",
  approved: "bg-emerald-50 text-emerald-700",
  "permit-ready": "bg-violet-50 text-violet-700",
};

interface ReviewQueueTableProps {
  items: ReviewQueueItem[];
  projectsBasePath?: string;
  className?: string;
}

export function ReviewQueueTable({
  items,
  projectsBasePath = routes.engineer.projects,
  className,
}: ReviewQueueTableProps) {
  return (
    <section
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-section-title">Review Queue</h2>
          <p className="mt-1 font-body text-sm text-stat-label">
            Projects submitted for licensed PE review and final approval
          </p>
        </div>
        <Link
          href={routes.engineer.projects}
          className="inline-flex items-center gap-1 font-body text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Project</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Compliance</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>Review Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{item.projectName}</p>
                  <p className="text-stat-label">{item.address}</p>
                </div>
              </TableCell>
              <TableCell className="text-stat-label">
                {item.submittedBy}
              </TableCell>
              <TableCell className="text-stat-label">
                {item.complianceScore}%
              </TableCell>
              <TableCell className="text-stat-label">
                {item.reviewFlags}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-1 font-body text-xs font-semibold",
                    statusStyles[item.reviewStatus],
                  )}
                >
                  {ENGINEER_REVIEW_STATUS_LABELS[item.reviewStatus]}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`${projectsBasePath}/${item.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 rounded-[10px] px-4",
                  )}
                >
                  Review
                  <ArrowRight className="size-3.5" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

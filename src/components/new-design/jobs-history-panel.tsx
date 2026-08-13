"use client";

import { useRouter } from "next/navigation";
import {
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/config/routes";
import { useAnalysisJobsQuery, type AnalysisJobItem, type AnalysisJobStatus } from "@/services/analysisService";

// --- Status helpers ---

interface StatusConfig {
  label: string;
  className: string;
  icon: React.ElementType;
}

const STATUS_CONFIG: Record<AnalysisJobStatus, StatusConfig> = {
  pending: {
    label: "Pending",
    className: "bg-slate-100 text-slate-600",
    icon: Clock,
  },
  running: {
    label: "Running",
    className: "bg-sky-50 text-sky-700",
    icon: Activity,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-amber-50 text-amber-700",
    icon: AlertCircle,
  },
};

function JobStatusBadge({ status }: { status: AnalysisJobStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-xs font-medium leading-none",
        config.className,
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      {config.label}
    </span>
  );
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// --- Row ---

interface JobRowProps {
  job: AnalysisJobItem;
  projectId: string;
}

function JobRow({ job, projectId }: JobRowProps) {
  const router = useRouter();
  const isTerminal = job.status === "completed" || job.status === "failed" || job.status === "cancelled";

  const handleViewResult = () => {
    if (job.status === "completed") {
      router.push(`/engineer/projects/${projectId}/jobs/${job.id}`);
    }
  };

  return (
    <tr
      className={cn(
        "border-b border-border transition-colors last:border-0",
        job.status === "completed" && "cursor-pointer hover:bg-slate-50",
      )}
      onClick={job.status === "completed" ? handleViewResult : undefined}
      tabIndex={job.status === "completed" ? 0 : undefined}
      onKeyDown={(e) => {
        if (job.status === "completed" && (e.key === "Enter" || e.key === " ")) {
          handleViewResult();
        }
      }}
      aria-label={job.status === "completed" ? `View result for job started ${formatRelativeDate(job.created_at)}` : undefined}
    >
      {/* Status */}
      <td className="px-4 py-3">
        <JobStatusBadge status={job.status} />
      </td>

      {/* Progress */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                job.status === "completed" ? "bg-emerald-500" :
                  job.status === "failed" || job.status === "cancelled" ? "bg-red-400" :
                    "bg-sky-500",
              )}
              style={{ width: `${isTerminal && job.status === "completed" ? 100 : job.progress_pct}%` }}
            />
          </div>
          <span className="font-body text-xs text-stat-label">
            {isTerminal && job.status === "completed" ? "100" : Math.round(job.progress_pct)}%
          </span>
        </div>
      </td>

      {/* Pages */}
      <td className="px-4 py-3 font-body text-sm text-stat-label">
        {job.pages_total != null
          ? `${job.pages_processed ?? 0} / ${job.pages_total} pages`
          : "—"}
      </td>

      {/* Started */}
      <td className="px-4 py-3 font-body text-sm text-stat-label">
        {formatRelativeDate(job.created_at)}
      </td>

      {/* Action */}
      <td className="px-4 py-3 text-right">
        {job.status === "completed" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleViewResult();
            }}
            className="inline-flex items-center gap-1 font-body text-sm font-medium text-primary hover:underline"
            aria-label={`View result for job started ${formatRelativeDate(job.created_at)}`}
          >
            View Result
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <span className="font-body text-sm text-stat-label">—</span>
        )}
      </td>
    </tr>
  );
}

// --- Skeleton rows ---

function JobRowSkeleton() {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
      <td className="px-4 py-3"><Skeleton className="h-1.5 w-24 rounded-full" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="px-4 py-3 text-right"><Skeleton className="ml-auto h-4 w-20" /></td>
    </tr>
  );
}

// --- Main component ---

interface JobsHistoryPanelProps {
  projectId: string;
  className?: string;
}

export function JobsHistoryPanel({ projectId, className }: JobsHistoryPanelProps) {
  const { data, isLoading, isError } = useAnalysisJobsQuery(projectId);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">Analysis Jobs</h2>
          <p className="mt-0.5 font-body text-sm text-stat-label">
            History of all analysis runs for this project
          </p>
        </div>
        {data && (
          <span className="font-body text-sm text-stat-label">
            {data.total} {data.total === 1 ? "job" : "jobs"}
          </span>
        )}
      </div>

      <CardContent className="p-0">
        {isError ? (
          <div className="flex items-center gap-3 px-6 py-8 text-sm text-stat-label">
            <AlertCircle className="size-4 shrink-0 text-red-500" aria-hidden="true" />
            Jobs details not found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border bg-slate-50/60">
                  <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wide text-stat-label">Status</th>
                  <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wide text-stat-label">Progress</th>
                  <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wide text-stat-label">Pages</th>
                  <th className="px-4 py-3 font-body text-xs font-semibold uppercase tracking-wide text-stat-label">Started</th>
                  <th className="px-4 py-3 text-right font-body text-xs font-semibold uppercase tracking-wide text-stat-label">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                    <JobRowSkeleton key={`skeleton-${i}`} />
                  ))
                  : data?.items.length === 0
                    ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center font-body text-sm text-stat-label">
                          No analysis jobs yet. Start your first analysis to see results here.
                        </td>
                      </tr>
                    )
                    : data?.items.map((job) => (
                      <JobRow key={job.id} job={job} projectId={projectId} />
                    ))
                }
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

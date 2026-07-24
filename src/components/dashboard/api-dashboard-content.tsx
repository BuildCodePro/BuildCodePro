"use client";

import { useMemo, useState } from "react";

import { RecentProjectsTable, StatsGrid } from "@/components/dashboard";
import { DashboardUsageBanner } from "@/components/dashboard/dashboard-usage-banner";
import { EngineerHeroBanner, ReviewQueueTable } from "@/components/engineer";
import { EstimatorHeroBanner, EstimatorUsageBanner } from "@/components/estimator";
import { routes } from "@/config/routes";
import { useDashboardStatsQuery } from "@/services/dashboardService";
import { useGetProjectsQuery, type ProjectDto } from "@/services/projectService";
import type { DashboardProject, DashboardStat } from "@/types/dashboard";
import type { ReviewQueueItem, EngineerReviewStatus } from "@/types/engineer";

import { HeroBanner } from "./hero-banner";

const DASHBOARD_PAGE_SIZE = 5;

function formatNumber(value?: number): string {
  return (value ?? 0).toLocaleString("en-US");
}

function getDetailText(detailCount?: number, detailLabel?: string): string {
  const count = detailCount ?? 0;
  return `${formatNumber(count)} ${detailLabel ?? ""}`.trim();
}

function mapStatsToCards(data?: ReturnType<typeof useDashboardStatsQuery>["data"]): DashboardStat[] {
  if (!data) return [];

  const usageLimit = data.monthly_design_usage.limit || 0;
  const usagePercent = usageLimit
    ? Math.min(100, Math.round((data.monthly_design_usage.used / usageLimit) * 100))
    : 0;

  return [
    {
      id: "active-estimates",
      label: "Active Estimates",
      value: formatNumber(data.active_estimates.total),
      change: {
        text: getDetailText(data.active_estimates.detail_count, data.active_estimates.detail_label),
        variant: "neutral",
      },
    },
    {
      id: "boms-ready",
      label: "BOMs Ready",
      value: formatNumber(data.boms_ready.total),
      change: {
        text: getDetailText(data.boms_ready.detail_count, data.boms_ready.detail_label),
        variant: "success",
      },
    },
    {
      id: "compliance-flags",
      label: "Compliance Flags",
      value: formatNumber(data.compliance_flags.total),
      change: {
        text: getDetailText(data.compliance_flags.detail_count, data.compliance_flags.detail_label),
        variant: data.compliance_flags.total > 0 ? "warning" : "neutral",
      },
    },
    {
      id: "exports-this-week",
      label: "Exports This Week",
      value: formatNumber(data.exports_this_week.total),
      change: {
        text: getDetailText(data.exports_this_week.detail_count, data.exports_this_week.detail_label),
        variant: "success",
      },
    },
  ];
}

function mapProjectToDashboardProject(project: ProjectDto): DashboardProject {
  return {
    id: project.id,
    name: project.name,
    address: project.address || project.jurisdiction || "—",
    occupancyType: project.occupancy_type || "—",
    status: project.status as DashboardProject["status"],
    display_status: project.display_status,
    lastUpdated: project.updated_at,
    createdAt: project.created_at,
  };
}

function normalizeEngineerReviewStatus(status: string): EngineerReviewStatus {
  if (status === "approved") return "approved";
  if (status === "permit-ready" || status === "permit_ready") return "permit-ready";
  if (status === "changes-requested" || status === "changes_requested" || status === "rejected") {
    return "changes-requested";
  }
  return "pending-review";
}

function mapProjectToReviewQueueItem(project: ProjectDto): ReviewQueueItem {
  return {
    id: project.id,
    projectName: project.name,
    address: project.address || project.jurisdiction || "—",
    submittedBy: project.created_by_user_id || "—",
    submittedAt: project.created_at,
    complianceScore: 0,
    reviewFlags: 0,
    reviewStatus: normalizeEngineerReviewStatus(project.engineer_review_status ?? project.display_status ?? project.status),
  };
}

function useDashboardProjects() {
  const [page, setPage] = useState(1);
  const projectsQuery = useGetProjectsQuery({
    page,
    page_size: DASHBOARD_PAGE_SIZE,
  });

  const totalPages = projectsQuery.data?.total
    ? Math.ceil(projectsQuery.data.total / DASHBOARD_PAGE_SIZE)
    : 0;

  return {
    page,
    setPage,
    projectsQuery,
    totalPages,
  };
}

export function CompanyDashboardContent() {
  const statsQuery = useDashboardStatsQuery();
  const { page, setPage, projectsQuery, totalPages } = useDashboardProjects();

  const stats = useMemo(() => mapStatsToCards(statsQuery.data), [statsQuery.data]);
  const projects = useMemo(
    () => (projectsQuery.data?.items ?? []).map(mapProjectToDashboardProject),
    [projectsQuery.data?.items],
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <HeroBanner />
      <DashboardUsageBanner usage={statsQuery.data?.monthly_design_usage} />
      <StatsGrid stats={stats} />
      <RecentProjectsTable
        projects={projects}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export function EstimatorDashboardContent() {
  const statsQuery = useDashboardStatsQuery();
  const { page, setPage, projectsQuery, totalPages } = useDashboardProjects();

  const stats = useMemo(() => mapStatsToCards(statsQuery.data), [statsQuery.data]);
  const projects = useMemo(
    () => (projectsQuery.data?.items ?? []).map(mapProjectToDashboardProject),
    [projectsQuery.data?.items],
  );
  const usage = statsQuery.data?.monthly_design_usage
    ? {
        used: statsQuery.data.monthly_design_usage.used,
        total: statsQuery.data.monthly_design_usage.limit,
        planName: statsQuery.data.monthly_design_usage.plan_name,
      }
    : { used: 0, total: 0, planName: "—" };

  return (
    <div className="flex w-full flex-col gap-6">
      <EstimatorHeroBanner />
      <EstimatorUsageBanner usage={usage} />
      <StatsGrid stats={stats} />
      <RecentProjectsTable
        projects={projects}
        projectsBasePath={routes.estimator.projects}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export function EngineerDashboardContent() {
  const statsQuery = useDashboardStatsQuery();
  const { page, setPage, projectsQuery, totalPages } = useDashboardProjects();

  const stats = useMemo(() => mapStatsToCards(statsQuery.data), [statsQuery.data]);
  const queueItems = useMemo(
    () => (projectsQuery.data?.items ?? []).map(mapProjectToReviewQueueItem),
    [projectsQuery.data?.items],
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <EngineerHeroBanner />
      <StatsGrid stats={stats} />
      <ReviewQueueTable
        items={queueItems}
        projectsBasePath={routes.engineer.projects}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

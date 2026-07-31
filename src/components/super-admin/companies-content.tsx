"use client";

import { useMemo, useState } from "react";

import { StatsGrid } from "@/components/dashboard/stat-card";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import {
  COMPANY_PLAN_FILTER_OPTIONS,
  COMPANY_STATUS_FILTER_OPTIONS,
} from "@/lib/constants/super-admin";
import { useAdminCompaniesQuery } from "@/services/adminService";
import type {
  AdminCompaniesStats,
  AdminCompanyItem,
  CompanyStatus,
} from "@/services/adminService";
import type { DashboardStat } from "@/types/dashboard";
import type { PlatformCompany } from "@/types/super-admin";

import { CompaniesTable } from "./companies-table";
import { SuperAdminModuleHeader } from "./super-admin-module-header";

function toSelectOptions<T extends { value: string; label: string }>(
  options: readonly T[],
) {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}

function formatLastActive(dateString: string): string {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function mapAdminCompanyToPlatformCompany(
  item: AdminCompanyItem,
): PlatformCompany {
  return {
    id: item.company_id,
    name: item.company_name,
    email: item.contact_email,
    plan: item.plan_name,
    users: item.user_count,
    projects: item.project_count,
    designsUsed: item.designs_used,
    designLimit: item.designs_limit === 0 ? "unlimited" : item.designs_limit,
    status: item.status,
    lastActive: formatLastActive(item.last_active_at),
  } as PlatformCompany;
}

function buildStats(stats?: AdminCompaniesStats): DashboardStat[] {
  if (!stats) return [];

  return [
    {
      label: "Total Companies",
      value: stats.total_companies.toLocaleString(),
    },
    {
      label: "Active Companies",
      value: stats.active_companies.toLocaleString(),
    },
    {
      label: "Suspended Companies",
      value: stats.suspended_companies.toLocaleString(),
    },
  ];
}

export function CompaniesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const companiesQuery = useAdminCompaniesQuery({
    page: 1,
    page_size: 10,
    search: searchQuery || undefined,
    plan: planFilter !== "all" ? planFilter : undefined,
    status:
      statusFilter !== "all" ? (statusFilter as CompanyStatus) : undefined,
  });

  const stats = useMemo(
    () => buildStats(companiesQuery.data?.stats),
    [companiesQuery.data],
  );

  const companies: PlatformCompany[] = useMemo(() => {
    const items = companiesQuery.data?.items ?? [];
    return items.map(mapAdminCompanyToPlatformCompany);
  }, [companiesQuery.data]);

  return (
    <div className="flex w-full flex-col gap-6">
      <SuperAdminModuleHeader
        title="Companies"
        description="Manage fire alarm company_owner accounts, subscription plans, and platform access."
      />
      <StatsGrid stats={stats} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search companies..."
          wrapperClassName="w-full lg:max-w-md"
          aria-label="Search companies"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FilterSelect
            value={planFilter}
            onChange={setPlanFilter}
            options={toSelectOptions(COMPANY_PLAN_FILTER_OPTIONS)}
            aria-label="Filter by plan"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={toSelectOptions(COMPANY_STATUS_FILTER_OPTIONS)}
            aria-label="Filter by status"
          />
        </div>
      </div>

      <CompaniesTable
        companies={companies}
        showActions
        isLoading={companiesQuery.isLoading}
      />
    </div>
  );
}
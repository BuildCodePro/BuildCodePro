"use client";

import { useMemo, useState } from "react";

import { StatsGrid } from "@/components/dashboard/stat-card";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import {
  COMPANY_PLAN_FILTER_OPTIONS,
  COMPANY_STATUS_FILTER_OPTIONS,
} from "@/lib/constants/super-admin";
import {
  companiesModuleStats,
  platformCompanies,
} from "@/lib/data/super-admin";

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

export function CompaniesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCompanies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return platformCompanies.filter((company) => {
      const matchesPlan = planFilter === "all" || company.plan === planFilter;
      const matchesStatus =
        statusFilter === "all" || company.status === statusFilter;
      const matchesSearch =
        !query ||
        company.name.toLowerCase().includes(query) ||
        company.email.toLowerCase().includes(query);

      return matchesPlan && matchesStatus && matchesSearch;
    });
  }, [planFilter, searchQuery, statusFilter]);

  return (
    <div className="flex w-full flex-col gap-6">
      <SuperAdminModuleHeader
        title="Companies"
        description="Manage fire alarm contractor accounts, subscription plans, and platform access."
      />
      <StatsGrid stats={companiesModuleStats} />

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

      <CompaniesTable companies={filteredCompanies} showActions />
    </div>
  );
}

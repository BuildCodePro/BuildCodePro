"use client";

import { useMemo, useState } from "react";

import { StatsGrid } from "@/components/dashboard/stat-card";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import { SUBSCRIPTION_PLAN_FILTER_OPTIONS } from "@/lib/constants/super-admin";
import {
  platformInvoices,
  subscriptionUsage,
  subscriptionsModuleStats,
} from "@/lib/data/super-admin";

import { PlatformInvoicesTable } from "./platform-invoices-table";
import { PlatformPlansOverview } from "./platform-plans-overview";
import { SuperAdminModuleHeader } from "./super-admin-module-header";
import { UsageTrackingTable } from "./usage-tracking-table";

function toSelectOptions<T extends { value: string; label: string }>(
  options: readonly T[],
) {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}

export function SubscriptionsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  const filteredUsage = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return subscriptionUsage.filter((item) => {
      const matchesPlan = planFilter === "all" || item.plan === planFilter;
      const matchesSearch =
        !query || item.companyName.toLowerCase().includes(query);

      return matchesPlan && matchesSearch;
    });
  }, [planFilter, searchQuery]);

  return (
    <div className="flex w-full flex-col gap-6">
      <SuperAdminModuleHeader
        title="Subscriptions & Billing"
        description="Manage Starter, Professional, and Enterprise plans with usage metering and billing history."
      />
      <StatsGrid stats={subscriptionsModuleStats} />
      <PlatformPlansOverview />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by company..."
          wrapperClassName="w-full sm:max-w-md"
          aria-label="Search subscriptions"
        />
        <FilterSelect
          value={planFilter}
          onChange={setPlanFilter}
          options={toSelectOptions(SUBSCRIPTION_PLAN_FILTER_OPTIONS)}
          wrapperClassName="w-full sm:w-[200px]"
          aria-label="Filter by plan"
        />
      </div>

      <UsageTrackingTable usage={filteredUsage} />
      <PlatformInvoicesTable invoices={platformInvoices} />
    </div>
  );
}




"use client";

import { useMemo, useState } from "react";

import { StatsGrid } from "@/components/dashboard/stat-card";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import { SUBSCRIPTION_PLAN_FILTER_OPTIONS } from "@/lib/constants/super-admin";
import { usePlansQuery } from "@/services/billingService";
import {
  useAdminInvoicesQuery,
  useAdminSubscriptionsQuery,
  useAdminSubscriptionStatsQuery,
} from "@/services/useAdminSubscriptions";
import type {
  AdminInvoiceItem,
  AdminSubscriptionItem,
  AdminSubscriptionStatus,
} from "@/services/useAdminSubscriptions";
import type { DashboardStat } from "@/types/dashboard";
import type { PlatformInvoice, SubscriptionUsage } from "@/types/super-admin";

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

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function buildStats(
  data: ReturnType<typeof useAdminSubscriptionStatsQuery>["data"],
): DashboardStat[] {
  if (!data) return [];

  return [
    {
      label: "Monthly Recurring Revenue",
      value: formatCurrency(data.monthly_recurring_revenue_cents.total),
      change: {
        text: data.monthly_recurring_revenue_cents.delta_label,
        variant:
          data.monthly_recurring_revenue_cents.delta >= 0
            ? "success"
            : "warning",
      },
    },
    {
      label: "Active Subscriptions",
      value: data.active_subscriptions.total.toLocaleString(),
      change: {
        text: data.active_subscriptions.delta_label,
        variant: data.active_subscriptions.delta >= 0 ? "success" : "warning",
      },
    },
    {
      label: "At Design Limit",
      value: data.at_design_limit.total.toLocaleString(),
      change: {
        text: data.at_design_limit.delta_label,
        variant: data.at_design_limit.delta >= 0 ? "warning" : "success",
      },
    },
    {
      label: "Upgrades This Month",
      value: data.upgrades_this_month.total.toLocaleString(),
      change: {
        text: data.upgrades_this_month.delta_label,
        variant: data.upgrades_this_month.delta >= 0 ? "success" : "warning",
      },
    },
  ];
}

function mapSubscriptionToUsage(item: AdminSubscriptionItem): SubscriptionUsage {
  return {
    id: item.company_id,
    companyName: item.company_name,
    plan: item.plan_name as SubscriptionUsage["plan"],
    designsUsed: item.designs_used,
    designLimit:
      item.designs_limit === 0 ? ("unlimited" as const) : item.designs_limit,
    billingCycle: (item.billing_cycle ||
      "monthly") as SubscriptionUsage["billingCycle"],
    monthlyAmount: item.amount_cents / 100,
    nextBillingDate: item.next_billing_at
      ? new Date(item.next_billing_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-",
    atLimit: item.status === "at_limit",
  } as SubscriptionUsage;
}

function mapInvoiceToPlatformInvoice(item: AdminInvoiceItem): PlatformInvoice {
  return {
    id: item.invoice_number || item.invoice_id,
    invoiceId: item.invoice_id,
    company: item.company_name,
    date: item.issued_at
      ? new Date(item.issued_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-",
    plan: item.plan_name,
    amount: item.amount_cents / 100,
    status: item.status,
  } as PlatformInvoice;
}

export function SubscriptionsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  const statsQuery = useAdminSubscriptionStatsQuery();
  const plansQuery = usePlansQuery();

  const subscriptionsQuery = useAdminSubscriptionsQuery({
    page: 1,
    page_size: 10,
    search: searchQuery || undefined,
    plan: planFilter !== "all" ? planFilter : undefined,
  });

  const invoicesQuery = useAdminInvoicesQuery({
    page: 1,
    page_size: 10,
  });

  const stats = useMemo(() => buildStats(statsQuery.data), [statsQuery.data]);

  const usage: SubscriptionUsage[] = useMemo(() => {
    const items = subscriptionsQuery.data?.items ?? [];
    return items.map(mapSubscriptionToUsage);
  }, [subscriptionsQuery.data]);

  const invoices: PlatformInvoice[] = useMemo(() => {
    const items = invoicesQuery.data?.items ?? [];
    return items.map(mapInvoiceToPlatformInvoice);
  }, [invoicesQuery.data]);

  const planDistribution = useMemo(() => {
    const plans = statsQuery.data?.plans ?? [];
    return plans.map((plan) => ({
      plan_code: plan.plan_code,
      plan_name: plan.plan_name,
      company_count: plan.company_count,
      monthly_revenue_cents: plan.amount_cents * plan.company_count,
    }));
  }, [statsQuery.data]);

  return (
    <div className="flex w-full flex-col gap-6">
      <SuperAdminModuleHeader
        title="Subscriptions & Billing"
        description="Manage Starter, Professional, and Enterprise plans with usage metering and billing history."
      />
      <StatsGrid stats={stats} />
      <PlatformPlansOverview
        plans={plansQuery.data?.items ?? []}
        planDistribution={planDistribution}
        isLoading={plansQuery.isLoading || statsQuery.isLoading}
      />

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

      <UsageTrackingTable
        usage={usage}
        isLoading={subscriptionsQuery.isLoading}
      />
      <PlatformInvoicesTable
        invoices={invoices}
        isLoading={invoicesQuery.isLoading}
      />
    </div>
  );
}
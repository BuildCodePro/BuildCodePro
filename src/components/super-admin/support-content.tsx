"use client";

import { useEffect, useMemo, useState } from "react";

import { StatsGrid } from "@/components/dashboard/stat-card";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import {
  TICKET_PRIORITY_FILTER_OPTIONS,
  TICKET_STATUS_FILTER_OPTIONS,
} from "@/lib/constants/super-admin";
import type { DashboardStat } from "@/types/dashboard";
import {
  useAdminTicketsQuery,
  useSupportStatsQuery,
  type SupportTicketListItem,
  type TicketPriority,
  type TicketStatus,
} from "@/services/supportService";

import { AdminTicketDetailDialog } from "./super-admin-ticket.dialog";
import { SuperAdminModuleHeader } from "./super-admin-module-header";
import { SupportTicketsTable } from "./support-tickets-table";
import { HelpArticlesContent } from "./help-article-parent";

function toSelectOptions<T extends { value: string; label: string }>(
  options: readonly T[],
) {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}

function useDebouncedValue<T>(value: T, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

const PAGE_SIZE = 20;

export function SupportContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(searchQuery);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, priorityFilter]);

  const queryParams = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      status:
        statusFilter === "all" ? undefined : (statusFilter as TicketStatus),
      priority:
        priorityFilter === "all"
          ? undefined
          : (priorityFilter as TicketPriority),
      search: debouncedSearch.trim() || undefined,
    }),
    [page, statusFilter, priorityFilter, debouncedSearch],
  );

  const {
    data: ticketsData,
    isLoading: isTicketsLoading,
    isFetching: isTicketsFetching,
    isError: isTicketsError,
  } = useAdminTicketsQuery(queryParams);

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useSupportStatsQuery();

  const stats: DashboardStat[] = useMemo(() => {
    if (!statsData) return [];

    return [
      {
        label: "Open Tickets",
        value: isStatsLoading ? "..." : String(statsData.open_ticket_count),
      },
      {
        label: "High Priority Open",
        value: isStatsLoading
          ? "..."
          : String(statsData.high_priority_open_count),
      },
      {
        label: "Resolved Today",
        value: isStatsLoading ? "..." : String(statsData.resolved_today_count),
      },
      {
        label: "Pending General Inquiries",
        value: isStatsLoading
          ? "..."
          : String(statsData.pending_general_inquiry_count),
      },
    ];
  }, [statsData, isStatsLoading]);

  const tickets = ticketsData?.items ?? [];
  const total = ticketsData?.total ?? 0;
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;

  const handleViewTicket = (ticket: SupportTicketListItem) => {
    setActiveTicketId(ticket.id);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <SuperAdminModuleHeader
        title="Support Center"
        description="Manage company_owner support tickets, contact requests, and help inquiries."
      />

      {isStatsError ? (
        <div className="rounded-[16px] border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Support stats not found.
        </div>
      ) : (
        <StatsGrid stats={stats} />
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search tickets..."
          wrapperClassName="w-full lg:max-w-md"
          aria-label="Search support tickets"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={toSelectOptions(TICKET_STATUS_FILTER_OPTIONS)}
            aria-label="Filter by status"
          />
          <FilterSelect
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={toSelectOptions(TICKET_PRIORITY_FILTER_OPTIONS)}
            aria-label="Filter by priority"
          />
        </div>
      </div>

      {isTicketsError ? (
        <div className="rounded-[16px] border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Ticket details not found.
        </div>
      ) : (
        <SupportTicketsTable
          tickets={tickets}
          isLoading={isTicketsLoading}
          isFetching={isTicketsFetching}
          onView={handleViewTicket}
        />
      )}

      {total > 0 ? (
        <div className="flex items-center justify-between text-sm text-stat-label">
          <span>
            Page {page} of {totalPages} &middot; {total} ticket
            {total === 1 ? "" : "s"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-[8px] border border-border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page <= 1 || isTicketsFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-[8px] border border-border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page >= totalPages || isTicketsFetching}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}



      <HelpArticlesContent />

      <AdminTicketDetailDialog
        ticketId={activeTicketId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
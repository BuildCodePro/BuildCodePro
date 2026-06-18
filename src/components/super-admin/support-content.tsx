"use client";

import { useMemo, useState } from "react";

import { StatsGrid } from "@/components/dashboard/stat-card";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import {
  TICKET_PRIORITY_FILTER_OPTIONS,
  TICKET_STATUS_FILTER_OPTIONS,
} from "@/lib/constants/super-admin";
import { supportModuleStats, supportTickets } from "@/lib/data/super-admin";

import { SuperAdminModuleHeader } from "./super-admin-module-header";
import { SupportTicketsTable } from "./support-tickets-table";

function toSelectOptions<T extends { value: string; label: string }>(
  options: readonly T[],
) {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}

export function SupportContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return supportTickets.filter((ticket) => {
      const matchesStatus =
        statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || ticket.priority === priorityFilter;
      const matchesSearch =
        !query ||
        ticket.id.toLowerCase().includes(query) ||
        ticket.company.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.contactName.toLowerCase().includes(query);

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [priorityFilter, searchQuery, statusFilter]);

  return (
    <div className="flex w-full flex-col gap-6">
      <SuperAdminModuleHeader
        title="Support Center"
        description="Manage contractor support tickets, contact requests, and help inquiries."
      />
      <StatsGrid stats={supportModuleStats} />

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

      <SupportTicketsTable tickets={filteredTickets} />
    </div>
  );
}

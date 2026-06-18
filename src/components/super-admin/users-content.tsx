"use client";

import { useMemo, useState } from "react";

import { StatsGrid } from "@/components/dashboard/stat-card";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import {
  USER_ROLE_FILTER_OPTIONS,
  USER_STATUS_FILTER_OPTIONS,
} from "@/lib/constants/super-admin";
import { platformUsers, usersModuleStats } from "@/lib/data/super-admin";

import { SuperAdminModuleHeader } from "./super-admin-module-header";
import { UsersTable } from "./users-table";

function toSelectOptions<T extends { value: string; label: string }>(
  options: readonly T[],
) {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}

export function UsersContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return platformUsers.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.company.toLowerCase().includes(query);

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [roleFilter, searchQuery, statusFilter]);

  return (
    <div className="flex w-full flex-col gap-6">
      <SuperAdminModuleHeader
        title="User Management"
        description="Manage contractor admins, estimators, and engineers across all companies."
      />
      <StatsGrid stats={usersModuleStats} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search users..."
          wrapperClassName="w-full lg:max-w-md"
          aria-label="Search users"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FilterSelect
            value={roleFilter}
            onChange={setRoleFilter}
            options={toSelectOptions(USER_ROLE_FILTER_OPTIONS)}
            aria-label="Filter by role"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={toSelectOptions(USER_STATUS_FILTER_OPTIONS)}
            aria-label="Filter by status"
          />
        </div>
      </div>

      <UsersTable users={filteredUsers} />
    </div>
  );
}

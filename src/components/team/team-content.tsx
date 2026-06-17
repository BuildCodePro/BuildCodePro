"use client";

import { useMemo, useState } from "react";

import { StatsGrid } from "@/components/dashboard/stat-card";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import {
  TEAM_ROLE_FILTER_OPTIONS,
  TEAM_STATUS_FILTER_OPTIONS,
} from "@/lib/constants/team";
import {
  COMPANY_NAME,
  companyTeamMembers,
  teamModuleStats,
} from "@/lib/data/company-team";
import type { CompanyTeamMember, InviteTeamMemberFormData } from "@/types/team";

import { InviteUserForm } from "./invite-user-form";
import { TeamMembersTable } from "./team-members-table";

function toSelectOptions<T extends { value: string; label: string }>(
  options: readonly T[],
) {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}

export function TeamContent() {
  const [members, setMembers] = useState<CompanyTeamMember[]>(companyTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return members.filter((member) => {
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query);

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [members, roleFilter, searchQuery, statusFilter]);

  const handleInvite = (data: InviteTeamMemberFormData) => {
    const newMember: CompanyTeamMember = {
      id: `team-${Date.now()}`,
      name: data.fullName,
      email: data.email,
      role: data.role,
      status: "pending",
      twoFactorEnabled: false,
      lastLogin: "—",
      invitedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setMembers((current) => [...current, newMember]);
  };

  const handleResendInvite = (memberId: string) => {
    void memberId;
    // Mock resend — API integration in Milestone 1
  };

  const handleRevokeInvite = (memberId: string) => {
    setMembers((current) => current.filter((member) => member.id !== memberId));
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-section-title font-body">Team Management</h2>
        <p className="font-body text-sm text-stat-label">
          Manage your {COMPANY_NAME} team — invite estimators, engineers, and
          admins
        </p>
      </div>

      <StatsGrid stats={teamModuleStats} />
      <InviteUserForm onInvite={handleInvite} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search team members..."
          wrapperClassName="w-full lg:max-w-md"
          aria-label="Search team members"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FilterSelect
            value={roleFilter}
            onChange={setRoleFilter}
            options={toSelectOptions(TEAM_ROLE_FILTER_OPTIONS)}
            aria-label="Filter by role"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={toSelectOptions(TEAM_STATUS_FILTER_OPTIONS)}
            aria-label="Filter by status"
          />
        </div>
      </div>

      <TeamMembersTable
        members={filteredMembers}
        onResendInvite={handleResendInvite}
        onRevokeInvite={handleRevokeInvite}
      />
    </div>
  );
}

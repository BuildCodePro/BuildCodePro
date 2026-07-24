"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

import { UserPlus, Users } from "lucide-react";

import { StatsGrid } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/filter-select";
import { Modal } from "@/components/ui/modal";
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
import { useSendInviteMutation } from "@/services/inviteService";
import {
  useTeamMembersQuery,
  useTeamStatsQuery,
  useResendInviteMutation,
  useRevokeInviteMutation,
  useActivateTeamMemberMutation,
  useDeactivateTeamMemberMutation
} from "@/services/teamService";

import { InviteUserForm } from "./invite-user-form";
import { TeamMembersTable } from "./team-members-table";
import { TableEmptyState } from "../ui/emptyState";

function toSelectOptions<T extends { value: string; label: string }>(
  options: readonly T[],
) {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
  }));
}

export function TeamContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const teamMembersQuery = useTeamMembersQuery({
    page: 1,
    pageSize: 100,
    role: roleFilter,
    status: statusFilter,
    search: debouncedSearchQuery,
  });

  const teamStatsQuery = useTeamStatsQuery();
  const sendInviteMutation = useSendInviteMutation();
  const resendInviteMutation = useResendInviteMutation();
  const revokeInviteMutation = useRevokeInviteMutation();
  const activateMemberMutation = useActivateTeamMemberMutation();
  const deactivateMemberMutation = useDeactivateTeamMemberMutation();




  const apiMembers: CompanyTeamMember[] = useMemo(() => {
    if (!teamMembersQuery.data) return [];
    return teamMembersQuery.data.items.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role,
      status: item.status as any,
      twoFactorEnabled: false,
      lastLogin: item.last_activity_at || "—",
      invitedAt: item.status === "pending" ? item.last_activity_at : undefined,
    }));
  }, [teamMembersQuery.data]);

  // Remove client-side filtering since server now handles filtering in API
  const filteredMembers = apiMembers;

  const handleInvite = async (data: InviteTeamMemberFormData) => {
    try {
      await sendInviteMutation.mutateAsync({
        email: data.email,
        role: data.role,
      });

      teamMembersQuery.refetch();
      toast.success(`Invite sent to ${data.email}`);
      setIsInviteModalOpen(false);
    } catch (error: any) {
      const message =
        error instanceof Error ? error.message : error.data.message;
      toast.error(message);
      throw error; // Throw to let form know it failed
    }
  };

  const handleResendInvite = async (memberId: string) => {
    try {
      await resendInviteMutation.mutateAsync(memberId);
      toast.success("Invite resent successfully.");
    } catch (error : any) {
      toast.error(error.data.message || error.message);
    }
  };

  const handleRevokeInvite = async (memberId: string) => {
    try {
      await revokeInviteMutation.mutateAsync(memberId);
      toast.success("Invite revoked successfully.");
    } catch (error : any) {
      toast.error(error.data.message || error.message);
    }
  };

  const handleActivateMember = async (memberId: string) => {
    try {
      await activateMemberMutation.mutateAsync(memberId);
      toast.success("Member activated successfully.");
    } catch (error : any) {
      toast.error(error.data.message || error.message);
    }
  };

  const handleDeactivateMember = async (memberId: string) => {
    try {
      await deactivateMemberMutation.mutateAsync(memberId);
      toast.success("Member deactivated successfully.");
    } catch (error : any) {
      toast.error(error.data.message || error.message);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-section-title font-body">Team Management</h2>
          <p className="font-body text-sm text-stat-label">
            Manage your {COMPANY_NAME} team invite estimators, engineers, and
            admins
          </p>
        </div>
        <Button size={"sm"} onClick={() => setIsInviteModalOpen(true)} className="sm:max-w-[250px] gap-2">
          <UserPlus className="size-4" />
          Invite Member
        </Button>
      </div>

      <StatsGrid stats={teamStatsQuery.data ? [
        { label: "Total Members", value: teamStatsQuery.data.team_members.toString() },
        { label: "Pending Invites", value: teamStatsQuery.data.pending_invites.toString() },
        { label: "Estimators", value: teamStatsQuery.data.estimators.toString() },
        { label: "Engineers", value: teamStatsQuery.data.engineers.toString() },
      ] : []} />

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        description="Invite estimators and engineers to collaborate on your company account."
        confirmText="Send Invitation"
        cancelText="Cancel"
        isConfirming={sendInviteMutation.isPending}
        formId="invite-user-form"
      >
        <InviteUserForm onInvite={handleInvite} isSubmitting={sendInviteMutation.isPending} />
      </Modal>

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
          isLoading={teamMembersQuery.isLoading}
          onResendInvite={handleResendInvite}
          onRevokeInvite={handleRevokeInvite}
          onActivateMember={handleActivateMember}
          onDeactivateMember={handleDeactivateMember}
        />
      
    </div>
  );
}
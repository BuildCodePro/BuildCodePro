import { Users } from "lucide-react";

import { UserRoleBadge } from "@/components/ui/user-role-badge";
import { UserStatusBadge } from "@/components/ui/user-status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";

import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format-date";

import type { CompanyTeamMember } from "@/types/team";
import { TableEmptyState } from "../ui/emptyState";
import { useAuthStore } from "@/store/auth-store";

interface TeamMembersTableProps {
  members: CompanyTeamMember[];
  isLoading?: boolean;
  onResendInvite?: (memberId: string) => void;
  onRevokeInvite?: (memberId: string) => void;
  onActivateMember?: (memberId: string) => void;
  onDeactivateMember?: (memberId: string) => void;
  className?: string;
}

export function TeamMembersTable({
  members,
  isLoading = false,
  onResendInvite,
  onRevokeInvite,
  onActivateMember,
  onDeactivateMember,
  className,
}: TeamMembersTableProps) {
  const currentUser = useAuthStore((state) => state.user);

  const handleResend = (memberId: string) => {
    if (typeof window === "undefined") return;

    const key = `resend-invite-${memberId}`;
    localStorage.setItem(key, Date.now().toString());
    onResendInvite?.(memberId);
  };

  const getMemberDate = (member: CompanyTeamMember) => {
    if (member.status === "pending") {
      return member.invitedAt
        ? `Invited ${formatDate(member.invitedAt)}`
        : "Invited —";
    }

    return member.lastLogin ? formatDate(member.lastLogin) : "—";
  };

  if (isLoading) {
    return <TableSkeleton columns={6} rows={5} className={className} />;
  }

  return (
    <section
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead>2FA</TableHead> */}
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="p-8">
                <TableEmptyState
                  title="No Team Member Found"
                  icon={<Users className="w-8 h-8" />}
                />
              </TableCell>
            </TableRow>
          ) : (
            members.map((member) => {
              const isCurrentUser = currentUser?.id === member.id;

              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-stat-label">
                        {member.email}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <UserRoleBadge role={member.role} />
                  </TableCell>

                  <TableCell>
                    <UserStatusBadge status={member.status} />
                  </TableCell>

                  {/* <TableCell>
                    {member.twoFactorEnabled ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <ShieldCheck className="size-3.5" />
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-stat-label">
                        <ShieldOff className="size-3.5" />
                        Off
                      </span>
                    )}
                  </TableCell> */}

                  <TableCell className="text-stat-label">
                    {getMemberDate(member)}
                  </TableCell>

                  <TableCell className="text-right">
                    {member.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleResend(member.id)}
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "sm",
                            }),
                            "h-9 rounded-[10px] px-3"
                          )}
                        >
                          Resend
                        </button>

                        <button
                          type="button"
                          onClick={() => onRevokeInvite?.(member.id)}
                          className={cn(
                            buttonVariants({
                              variant: "outline",
                              size: "sm",
                            }),
                            "h-9 rounded-[10px] px-3 text-primary"
                          )}
                        >
                          Revoke
                        </button>
                      </div>
                    ) : isCurrentUser ? null : (
                      <div className="flex justify-end gap-2">
                        {member.status === "active" ? (
                          <button
                            type="button"
                            onClick={() => onDeactivateMember?.(member.id)}
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "sm",
                              }),
                              "h-9 rounded-[10px] px-4"
                            )}
                          >
                            Deactivate
                          </button>
                        ) : member.status === "inactive" ? (
                          <button
                            type="button"
                            onClick={() => onActivateMember?.(member.id)}
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "sm",
                              }),
                              "h-9 rounded-[10px] px-4"
                            )}
                          >
                            Activate
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "sm",
                              }),
                              "h-9 rounded-[10px] px-4"
                            )}
                          >
                            Manage
                          </button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </section>
  );
}
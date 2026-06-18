import { ShieldCheck, ShieldOff } from "lucide-react";

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
import { cn } from "@/lib/utils/cn";
import type { CompanyTeamMember } from "@/types/team";

interface TeamMembersTableProps {
  members: CompanyTeamMember[];
  onResendInvite?: (memberId: string) => void;
  onRevokeInvite?: (memberId: string) => void;
  className?: string;
}

export function TeamMembersTable({
  members,
  onResendInvite,
  onRevokeInvite,
  className,
}: TeamMembersTableProps) {
  return (
    <section
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>2FA</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-stat-label">{member.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <UserRoleBadge role={member.role} />
              </TableCell>
              <TableCell>
                <UserStatusBadge status={member.status} />
              </TableCell>
              <TableCell>
                {member.twoFactorEnabled ? (
                  <span className="inline-flex items-center gap-1 font-body text-xs text-success">
                    <ShieldCheck className="size-3.5" aria-hidden="true" />
                    Enabled
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-body text-xs text-stat-label">
                    <ShieldOff className="size-3.5" aria-hidden="true" />
                    Off
                  </span>
                )}
              </TableCell>
              <TableCell className="text-stat-label">
                {member.status === "pending"
                  ? `Invited ${member.invitedAt ?? "—"}`
                  : member.lastLogin}
              </TableCell>
              <TableCell className="text-right">
                {member.status === "pending" ? (
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onResendInvite?.(member.id)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-9 rounded-[10px] px-3",
                      )}
                    >
                      Resend
                    </button>
                    <button
                      type="button"
                      onClick={() => onRevokeInvite?.(member.id)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-9 rounded-[10px] px-3 text-primary",
                      )}
                    >
                      Revoke
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 rounded-[10px] px-4",
                    )}
                  >
                    Manage
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

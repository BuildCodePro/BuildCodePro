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
import type { PlatformUser } from "@/types/super-admin";
import { cn } from "@/lib/utils/cn";

interface UsersTableProps {
  users: PlatformUser[];
  className?: string;
}

export function UsersTable({ users, className }: UsersTableProps) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>User</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>2FA</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-stat-label">{user.email}</p>
                </div>
              </TableCell>
              <TableCell className="text-stat-label">{user.company}</TableCell>
              <TableCell>
                <UserRoleBadge role={user.role} />
              </TableCell>
              <TableCell>
                <UserStatusBadge status={user.status} />
              </TableCell>
              <TableCell>
                {user.twoFactorEnabled ? (
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
              <TableCell className="text-stat-label">{user.lastLogin}</TableCell>
              <TableCell className="text-right">
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 rounded-[10px] px-4",
                  )}
                >
                  Manage
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRoleBadge } from "@/components/ui/user-role-badge";
import { UserStatusBadge } from "@/components/ui/user-status-badge";
import type { PlatformUser, PlatformUserRole } from "@/types/super-admin";
import { cn } from "@/lib/utils/cn";

import { TableSkeleton } from "@/components/ui/table-skeleton";
import { TableEmptyState } from "../ui/emptyState";
import { Users } from "lucide-react";

interface UsersTableProps {
  users: PlatformUser[];
  isLoading?: boolean;
  onBlockUser?: (userId: string) => void;
  className?: string;
}

// Valid keys that UserRoleBadge actually accepts.
const VALID_ROLES: PlatformUserRole[] = [
  "company_owner",
  "estimator",
  "engineer",
];

/**
 * Backend is sending the raw Python enum repr (e.g. "Userrole.Company Owner"
 * or "UserRole.COMPANY_OWNER") instead of just the enum value ("company_owner").
 * This converts whatever leaks through back into a valid PlatformUserRole key,
 * WITHOUT touching UserRoleBadge (which is used elsewhere and expects the
 * strict union type).
 *
 * Proper fix is backend-side: return `role.value` (or set
 * `use_enum_values = True` on the Pydantic model/schema) instead of
 * `str(role)`. This is just a safety-net so the UI never breaks or shows
 * a raw enum prefix.
 */
function normalizeRole(rawRole: string): PlatformUserRole {
  if (!rawRole) return "estimator";

  // "Userrole.Company Owner" -> "Company Owner"
  // "UserRole.COMPANY_OWNER" -> "COMPANY_OWNER"
  const withoutPrefix = rawRole.includes(".")
    ? rawRole.split(".").pop() ?? rawRole
    : rawRole;

  // "Company Owner" / "COMPANY_OWNER" -> "company_owner"
  const normalized = withoutPrefix
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

  return (VALID_ROLES as string[]).includes(normalized)
    ? (normalized as PlatformUserRole)
    : "estimator";
}

export function UsersTable({
  users,
  isLoading = false,
  onBlockUser,
  className,
}: UsersTableProps) {
  if (isLoading) {
    return <TableSkeleton columns={6} rows={5} className={className} />;
  }

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
            <TableHead>Last Login</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-sm text-stat-label"
              >
                <TableEmptyState title="Users Not Found" icon={<Users className="w-8 h-8" />} />
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-stat-label">{user.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-stat-label">
                  {user.company}
                </TableCell>
                <TableCell>
                  <UserRoleBadge role={normalizeRole(user.role)} />
                </TableCell>
                <TableCell>
                  <UserStatusBadge status={user.status} />
                </TableCell>
                <TableCell className="text-stat-label">
                  {user.lastLogin}
                </TableCell>

              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
"use client";

import { Ban, Factory, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { buttonVariants } from "@/components/ui/button";
import { CompanyStatusBadge } from "@/components/ui/company-status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  AdminCompanyItem,
  useAdminCompaniesQuery,
  useUpdateCompanyStatusMutation,
} from "@/services/adminService";
import { platformCompanies } from "@/lib/data/super-admin";
import type { PlatformCompany } from "@/types/super-admin";
import { cn } from "@/lib/utils/cn";
import { TableEmptyState } from "../ui/emptyState";

interface CompaniesTableProps {
  companies: PlatformCompany[];
  showActions?: boolean;
  isLoading?: boolean;
  className?: string;
}

function formatPlan(plan: PlatformCompany["plan"]): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

function formatDesignUsage(company: PlatformCompany): string {
  if (company.designLimit === "unlimited") {
    return `${company.designsUsed} / Unlimited`;
  }

  return `${company.designsUsed} / ${company.designLimit}`;
}

export function CompaniesTable({
  companies,
  showActions = false,
  isLoading = false,
  className,
}: CompaniesTableProps) {
  const queryClient = useQueryClient();
  const updateStatusMutation = useUpdateCompanyStatusMutation();

  const handleToggleStatus = (company: PlatformCompany) => {
    const isSuspended = company.status === "suspended";
    const action = isSuspended ? "activate" : "suspend";

    updateStatusMutation.mutate(
      {
        companyId: company.id,
        payload: { action },
      },
      {
        onSuccess: () => {
          // Refresh the companies list (and any admin-companies queries
          // regardless of page/filter params) after a successful status change.
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === "admin-companies",
          });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <TableSkeleton
        columns={showActions ? 8 : 7}
        rows={5}
        className={className}
      />
    );
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
            <TableHead>Company</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Projects</TableHead>
            <TableHead>Designs Used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            {showActions ? (
              <TableHead className="text-right">Action</TableHead>
            ) : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showActions ? 8 : 7}
                className="text-center text-sm text-stat-label"
              >
                <TableEmptyState title="Companies Not Found" icon={<Factory className="w-8 h-8" />} />
              </TableCell>
            </TableRow>
          ) : (
            companies.map((company) => {
              const isSuspended = company.status === "suspended";
              const isActive = company.status === "active";
              const isPending =
                updateStatusMutation.isPending &&
                updateStatusMutation.variables?.companyId === company.id;

              return (
                <TableRow key={company.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <p className="text-xs text-stat-label">
                        {company.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-stat-label">
                    {formatPlan(company.plan)}
                  </TableCell>
                  <TableCell className="text-stat-label">
                    {company.users}
                  </TableCell>
                  <TableCell className="text-stat-label">
                    {company.projects}
                  </TableCell>
                  <TableCell className="text-stat-label">
                    {formatDesignUsage(company)}
                  </TableCell>
                  <TableCell>
                    <CompanyStatusBadge status={company.status} />
                  </TableCell>
                  <TableCell className="text-stat-label">
                    {company.lastActive}
                  </TableCell>
                  {showActions ? (
                    <TableCell className="text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(company)}
                        disabled={isPending}
                        className={cn(
                          buttonVariants({ variant: "outline", size: "sm" }),
                          "h-9 rounded-[10px] px-4 disabled:opacity-60",
                        )}
                      >
                        {isSuspended ? (
                          <>
                            <ShieldCheck
                              className="size-3.5"
                              aria-hidden="true"
                            />
                            {isPending ? "Unsuspending..." : "Unsuspend"}
                          </>
                        ) : isActive ? (
                          <>
                            <Ban className="size-3.5" aria-hidden="true" />
                            {isPending ? "Suspending..." : "Suspend"}
                          </>
                        ) : (
                          <>
                            <ShieldCheck
                              className="size-3.5"
                              aria-hidden="true"
                            />
                            {isPending ? "Activating..." : "Activate"}
                          </>
                        )}
                      </button>
                    </TableCell>
                  ) : null}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface RecentCompaniesTableProps {
  companies?: PlatformCompany[];
  className?: string;
}

function formatLastActive(dateString: string): string {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function mapAdminCompanyToPlatformCompany(
  item: AdminCompanyItem,
): PlatformCompany {
  return {
    id: item.company_id,
    name: item.company_name,
    email: item.contact_email,
    plan: item.plan_name,
    users: item.user_count,
    projects: item.project_count,
    designsUsed: item.designs_used,
    designLimit: item.designs_limit === 0 ? "unlimited" : item.designs_limit,
    status: item.status,
    lastActive: formatLastActive(item.last_active_at),
  } as PlatformCompany;
}

interface RecentCompaniesTableProps {
  className?: string;
}

export function RecentCompaniesTable({ className }: RecentCompaniesTableProps) {
  const { data, isLoading } = useAdminCompaniesQuery({
    page: 1,
    page_size: 10,
  });

  const recentCompanies: PlatformCompany[] = (data?.items ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.last_active_at).getTime() -
        new Date(a.last_active_at).getTime(),
    )
    .slice(0, 5)
    .map(mapAdminCompanyToPlatformCompany);

  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-section-title">Recent Companies</h2>
      <CompaniesTable companies={recentCompanies} isLoading={isLoading} />
    </section>
  );
}
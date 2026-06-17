import { Eye } from "lucide-react";

import { CompanyStatusBadge } from "@/components/ui/company-status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { platformCompanies } from "@/lib/data/super-admin";
import type { PlatformCompany } from "@/types/super-admin";
import { cn } from "@/lib/utils/cn";

interface CompaniesTableProps {
  companies: PlatformCompany[];
  showActions?: boolean;
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
  className,
}: CompaniesTableProps) {
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
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{company.name}</p>
                  <p className="text-xs text-stat-label">{company.email}</p>
                </div>
              </TableCell>
              <TableCell className="text-stat-label">
                {formatPlan(company.plan)}
              </TableCell>
              <TableCell className="text-stat-label">{company.users}</TableCell>
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
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 rounded-[10px] px-4",
                    )}
                  >
                    <Eye className="size-3.5" aria-hidden="true" />
                    View
                  </button>
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface RecentCompaniesTableProps {
  companies?: PlatformCompany[];
  className?: string;
}

export function RecentCompaniesTable({
  companies = platformCompanies.slice(0, 5),
  className,
}: RecentCompaniesTableProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-section-title">Recent Companies</h2>
      <CompaniesTable companies={companies} />
    </section>
  );
}

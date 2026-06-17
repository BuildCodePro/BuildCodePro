import { History } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils/cn";
import type { ProjectVersion } from "@/types/estimator";

interface VersionHistoryPanelProps {
  versions: ProjectVersion[];
  className?: string;
}

export function VersionHistoryPanel({
  versions,
  className,
}: VersionHistoryPanelProps) {
  return (
    <section
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <div className="mb-5 flex items-center gap-2">
        <History className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-section-title">Version History</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Version</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Changes</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.map((version) => (
            <TableRow key={version.id}>
              <TableCell className="font-medium">{version.version}</TableCell>
              <TableCell>{version.label}</TableCell>
              <TableCell className="max-w-xs text-stat-label">
                {version.changes}
              </TableCell>
              <TableCell className="text-stat-label">
                {version.createdBy}
              </TableCell>
              <TableCell className="text-stat-label">
                {version.createdAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

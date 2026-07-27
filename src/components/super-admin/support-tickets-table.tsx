import { MessageSquare } from "lucide-react";

import { TicketPriorityBadge } from "@/components/ui/ticket-priority-badge";
import { TicketStatusBadge } from "@/components/ui/ticket-status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SupportTicketListItem } from "@/services/supportService";
import { cn } from "@/lib/utils/cn";
import { TableEmptyState } from "../ui/emptyState";

interface SupportTicketsTableProps {
  tickets: SupportTicketListItem[];
  isLoading?: boolean;
  isFetching?: boolean;
  onView?: (ticket: SupportTicketListItem) => void;
  className?: string;
}

function formatCategory(category: SupportTicketListItem["category"]): string {
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SupportTicketsTable({
  tickets,
  isLoading = false,
  isFetching = false,
  onView,
  className,
}: SupportTicketsTableProps) {
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
            <TableHead>Ticket ID</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-stat-label">
                Loading tickets...
              </TableCell>
            </TableRow>
          ) : tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-stat-label">
                <TableEmptyState title="No Tickets Found" />
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className={cn(isFetching && "opacity-60")}
              >
                <TableCell className="font-medium">
                  {ticket.ticket_reference}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{ticket.company.name}</p>
                    <p className="text-xs text-stat-label">
                      {ticket.created_by.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="max-w-[240px] text-stat-label">
                  {ticket.subject}
                </TableCell>
                <TableCell className="text-stat-label">
                  {formatCategory(ticket.category)}
                </TableCell>
                <TableCell>
                  <TicketPriorityBadge priority={ticket.priority} />
                </TableCell>
                <TableCell>
                  <TicketStatusBadge status={ticket.status} />
                </TableCell>
                <TableCell className="text-stat-label">
                  {formatDate(ticket.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 rounded-[10px] px-4",
                    )}
                    onClick={() => onView?.(ticket)}
                  >
                    <MessageSquare className="size-3.5" aria-hidden="true" />
                    View
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
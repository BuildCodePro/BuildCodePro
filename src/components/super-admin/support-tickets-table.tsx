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
import type { SupportTicket } from "@/types/super-admin";
import { cn } from "@/lib/utils/cn";

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  className?: string;
}

function formatCategory(category: SupportTicket["category"]): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function SupportTicketsTable({
  tickets,
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
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{ticket.company}</p>
                  <p className="text-xs text-stat-label">{ticket.contactName}</p>
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
                {ticket.submittedAt}
              </TableCell>
              <TableCell className="text-right">
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 rounded-[10px] px-4",
                  )}
                >
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                  View
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

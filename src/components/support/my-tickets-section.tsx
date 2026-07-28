"use client";

import { MessageSquare, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TicketPriorityBadge } from "@/components/ui/ticket-priority-badge";
import { TicketStatusBadge } from "@/components/ui/ticket-status-badge";
import { useSupportTicketsQuery } from "@/services/supportService";
import { TableEmptyState } from "../ui/emptyState";

interface MyTicketsSectionProps {
  onOpenTicket: (ticketId: string) => void;
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

export function MyTicketsSection({ onOpenTicket }: MyTicketsSectionProps) {
  const { data, isLoading, isError } = useSupportTicketsQuery({
    page: 1,
    page_size: 10,
  });

  const tickets = data?.items ?? [];

  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <CardHeader className="mb-6">
          <CardTitle>My Tickets</CardTitle>
          <CardDescription>
            View the status of tickets you&apos;ve submitted and add comments
          </CardDescription>
        </CardHeader>

        {isLoading ? (
          <p className="font-body text-sm text-stat-label">
            Loading your tickets...
          </p>
        ) : isError ? (
          <p className="font-body text-sm text-destructive" role="alert">
            Failed to load your tickets.
          </p>
        ) : tickets.length === 0 ? (
          <div className="font-body text-sm text-stat-label">
            <TableEmptyState icon={<Ticket className="w-8 h-8" />} title="You haven&apos;t submitted any tickets yet." />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-col gap-3 rounded-[12px] border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {ticket.ticket_reference}
                    </span>
                    <TicketStatusBadge status={ticket.status} />
                    <TicketPriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="truncate font-body text-sm text-stat-label">
                    {ticket.subject}
                  </p>
                  <p className="font-body text-xs text-stat-label">
                    Submitted {formatDate(ticket.created_at)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 shrink-0 rounded-[10px] px-4"
                  onClick={() => onOpenTicket(ticket.id)}
                >
                  <MessageSquare className="size-3.5" aria-hidden="true" />
                  View & Comment
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
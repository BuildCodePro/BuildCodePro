"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { TicketPriorityBadge } from "@/components/ui/ticket-priority-badge";
import { TicketStatusBadge } from "@/components/ui/ticket-status-badge";
import {
  useAddSupportTicketCommentMutation,
  useSupportTicketQuery,
} from "@/services/supportService";
import { TableEmptyState } from "../ui/emptyState";
import { MessageCircle } from "lucide-react";

interface TicketDetailDialogProps {
  ticketId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TicketDetailDialog({
  ticketId,
  open,
  onOpenChange,
}: TicketDetailDialogProps) {
  const [commentBody, setCommentBody] = useState("");

  const { data: ticket, isLoading, isError } = useSupportTicketQuery(ticketId);
  const addCommentMutation = useAddSupportTicketCommentMutation();

  const handleAddComment = async () => {
    if (!ticketId || !commentBody.trim()) return;

    await addCommentMutation.mutateAsync({
      ticketId,
      payload: { body: commentBody.trim() },
    });
    setCommentBody("");
  };

  const handleClose = () => {
    setCommentBody("");
    onOpenChange(false);
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={ticket ? ticket.ticket_reference : "Ticket Details"}
      description={ticket ? ticket.subject : undefined}
      hideFooter
    >
      {isLoading ? (
        <p className="py-8 text-center font-body text-sm text-stat-label">
          Loading ticket...
        </p>
      ) : isError || !ticket ? (
        <p className="py-8 text-center font-body text-sm text-destructive">
          Failed to load ticket details.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <TicketStatusBadge status={ticket.status} />
            <TicketPriorityBadge priority={ticket.priority} />
          </div>

          <div className="rounded-[12px] bg-slate-50 p-4">
            <p className="font-body text-sm text-foreground">
              {ticket.description}
            </p>
            <p className="mt-2 font-body text-xs text-stat-label">
              Submitted {formatDateTime(ticket.created_at)}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">
              Comments ({ticket.comments.length})
            </h4>
            {ticket.comments.length === 0 ? (
              <p className="font-body text-sm text-stat-label">
                <TableEmptyState title="No comments yet." icon={<MessageCircle className="w-8 h-8" />} />
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-[10px] border border-border px-3 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {comment.author.name}
                      </span>
                      <span className="font-body text-xs text-stat-label">
                        {formatDateTime(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 font-body text-sm text-stat-label">
                      {comment.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <Textarea
              placeholder="Add a comment..."
              rows={3}
              value={commentBody}
              onChange={(event) => setCommentBody(event.target.value)}
            />
            {addCommentMutation.isError ? (
              <p className="font-body text-xs text-destructive">
                Failed to add comment. Please try again.
              </p>
            ) : null}
            <Button
              type="button"
              size="sm"
              className="h-10"
              disabled={!commentBody.trim() || addCommentMutation.isPending}
              onClick={handleAddComment}
            >
              {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
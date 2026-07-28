"use client";

import { useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationsReadMutation,
  useNotificationsQuery,
} from "@/services/useNotificationService";
import { useNotificationsSocket } from "@/hooks/use-notification";
import { TableEmptyState } from "../ui/emptyState";

const PAGE_SIZE = 10;

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const [page, setPage] = useState(1);

  const { unreadCount: socketUnreadCount, markRead: socketMarkRead, markAllRead: socketMarkAllRead } =
    useNotificationsSocket();

  const { data, isLoading, isFetching } = useNotificationsQuery({
    page,
    page_size: PAGE_SIZE,
  });

  const markReadMutation = useMarkNotificationsReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const notifications = data?.items ?? [];
  const total = data?.total ?? 0;
  const unreadCount = socketUnreadCount || data?.unread_count || 0;
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 1;

  const handleMarkRead = (notificationId: string) => {
    const sentViaSocket = socketMarkRead([notificationId]);
    if (!sentViaSocket) {
      markReadMutation.mutate({ notification_ids: [notificationId] });
    }
  };

  const handleMarkAllRead = () => {
    const sentViaSocket = socketMarkAllRead();
    if (!sentViaSocket) {
      markAllReadMutation.mutate();
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Notifications
          </h1>
          <p className="mt-1 font-body text-sm text-stat-label">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "You're all caught up"}
          </p>
        </div>

        {unreadCount > 0 ? (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-10 gap-2 px-4 disabled:opacity-60",
            )}
          >
            <CheckCheck className="size-4" aria-hidden="true" />
            Mark all as read
          </button>
        ) : null}
      </div>

      <div className="rounded-[16px] border border-border bg-white p-5 sm:p-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-16 animate-pulse rounded-[12px] bg-slate-100"
              />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <p className="py-10 text-center font-body text-sm text-stat-label">
            <TableEmptyState title="No notifications yet." icon={<Bell className="w-8 h-8" />} />
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() =>
                    !notification.is_read && handleMarkRead(notification.id)
                  }
                  className={cn(
                    "flex w-full items-start gap-3 px-2 py-4 text-left transition-colors hover:bg-slate-50",
                    !notification.is_read && "bg-primary/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-1.5 size-2 shrink-0 rounded-full",
                      notification.is_read ? "bg-transparent" : "bg-red-500",
                    )}
                  />
                  <span className="flex-1 space-y-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-body text-sm font-semibold text-foreground">
                        {notification.title}
                      </span>
                      <span className="shrink-0 font-body text-xs text-stat-label">
                        {formatDateTime(notification.created_at)}
                      </span>
                    </span>
                    {notification.body ? (
                      <span className="block font-body text-sm text-stat-label">
                        {notification.body}
                      </span>
                    ) : null}
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 font-body text-[11px] font-medium uppercase text-stat-label">
                      {notification.type.replace(/_/g, " ")}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {total > 0 ? (
        <div className="flex items-center justify-between text-sm text-stat-label">
          <span>
            Page {page} of {totalPages} &middot; {total} notification
            {total === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            {isFetching ? (
              <Loader2 className="size-4 animate-spin text-stat-label" />
            ) : null}
            <button
              type="button"
              className="rounded-[8px] border border-border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded-[8px] border border-border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
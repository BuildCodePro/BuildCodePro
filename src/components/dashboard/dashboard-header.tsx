"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Settings } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/auth-store";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationsReadMutation,
  useNotificationsQuery,
} from "@/services/useNotificationService";
import { useNotificationsSocket } from "@/hooks/use-notification";

import { LogoutModal } from "@/components/auth/logout-model";

interface DashboardHeaderProps {
  title: string;
  userName?: string;
  userRole?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
  className?: string;
}

const DROPDOWN_PAGE_SIZE = 5;

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function DashboardHeader({
  title,
  userName,
  userRole,
  onMenuClick,
  onLogout,
  className,
}: DashboardHeaderProps) {
  const router = useRouter();
  const { role: authRole, user: authUser } = useAuthStore();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const resolvedUserName = userName ?? authUser?.name ?? "John Doe";
  const resolvedUserRole = userRole ?? authRole ?? "estimator";
  const avatarUrl = authUser?.avatar_url;

  const ROLE_ROUTE_MAP: Record<string, string> = {
    company_owner: "company",
  };
  const settingsRole = ROLE_ROUTE_MAP[resolvedUserRole] ?? resolvedUserRole;
  const settingsHref = `/${settingsRole}/settings`;

  // --- Live socket connection (unread count + real-time push) ---
  const {
    unreadCount: socketUnreadCount,
    markRead: socketMarkRead,
    markAllRead: socketMarkAllRead,
  } = useNotificationsSocket();

  // --- REST data for the dropdown list (top 5) ---
  const { data, isLoading } = useNotificationsQuery({
    page: 1,
    page_size: DROPDOWN_PAGE_SIZE,
  });

  const markReadMutation = useMarkNotificationsReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();

  const notifications = data?.items ?? [];
  // Prefer live socket unread count; fall back to REST response.
  const unreadCount = socketUnreadCount || data?.unread_count || 0;

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      const sentViaSocket = socketMarkRead([notificationId]);
      if (!sentViaSocket) {
        markReadMutation.mutate({ notification_ids: [notificationId] });
      }
    }
  };

  const handleMarkAllRead = () => {
    const sentViaSocket = socketMarkAllRead();
    if (!sentViaSocket) {
      markAllReadMutation.mutate();
    }
  };

  const handleViewAll = () => {
    setIsNotificationsOpen(false);
    router.push("/notifications");
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsProfileOpen(false);
    onLogout?.();
    localStorage.removeItem("build-auth");
    window.location.reload();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-[72px] shrink-0 items-center gap-4 border-b border-border bg-white px-4 sm:gap-6 sm:px-6",
        className,
      )}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-border text-foreground lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </button>

      <h1 className="text-page-title shrink-0 text-foreground">{title}</h1>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationsOpen((prev) => !prev);
              setIsProfileOpen(false);
            }}
            className="relative inline-flex size-10 items-center justify-center rounded-[20px] border border-border p-2.5 text-foreground transition-colors hover:bg-slate-50"
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell className="size-5" />
            {unreadCount > 0 ? (
              <span className="absolute right-1.5 top-1.5 inline-flex size-2 rounded-full bg-red-500" />
            ) : null}
          </button>

          {isNotificationsOpen ? (
            <div
              className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-[14px] border border-border bg-white shadow-lg"
              role="menu"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="font-body text-sm font-semibold text-foreground">
                  Notifications
                </span>
                {unreadCount > 0 ? (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="font-body text-xs text-primary hover:underline"
                  >
                    Mark all as read
                  </button>
                ) : null}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-14 animate-pulse rounded-md bg-slate-100"
                      />
                    ))}
                  </div>
                ) : notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center font-body text-sm text-stat-label">
                    No notifications yet
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() =>
                        handleNotificationClick(
                          notification.id,
                          notification.is_read,
                        )
                      }
                      className="flex w-full items-start gap-2 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50"
                      role="menuitem"
                    >
                      <span
                        className={cn(
                          "mt-1.5 size-2 shrink-0 rounded-full",
                          notification.is_read
                            ? "bg-transparent"
                            : "bg-red-500",
                        )}
                      />
                      <span className="flex-1 space-y-0.5">
                        <span className="block font-body text-sm font-medium text-foreground">
                          {notification.title}
                        </span>
                        {notification.body ? (
                          <span className="block line-clamp-2 font-body text-xs text-stat-label">
                            {notification.body}
                          </span>
                        ) : null}
                        <span className="block font-body text-xs text-slate-400">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>


            </div>
          ) : null}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 rounded-[10px] px-1 py-1 transition-colors hover:bg-slate-50"
            aria-label="User menu"
            aria-expanded={isProfileOpen}
          >
            <Avatar name={resolvedUserName} src={avatarUrl} />
            <span className="hidden font-body text-sm font-medium text-foreground sm:inline">
              {resolvedUserName}
            </span>
            <ChevronDown
              className={cn(
                "hidden size-4 text-slate-400 transition-transform sm:inline",
                isProfileOpen && "rotate-180",
              )}
            />
          </button>

          {isProfileOpen ? (
            <div
              className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-[14px] border border-border bg-white py-1.5 shadow-lg"
              role="menu"
            >
              <div className="border-b border-border px-4 py-3">
                <p className="font-body text-sm font-medium text-foreground">
                  {resolvedUserName}
                </p>
                <p className="font-body text-xs capitalize text-stat-label">
                  {resolvedUserRole}
                </p>
              </div>

              <Link
                href={settingsHref}
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 font-body text-sm text-foreground transition-colors hover:bg-slate-50"
                role="menuitem"
              >
                <Settings className="size-4 text-slate-400" />
                Profile Settings
              </Link>

              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-body text-sm text-red-600 transition-colors hover:bg-red-50"
                role="menuitem"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
}
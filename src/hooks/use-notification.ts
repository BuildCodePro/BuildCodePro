"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/store/auth-store";

export interface WsNotificationData {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string;
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, unknown>;
}

type WsIncomingEvent =
  | { event: "connected"; unread_count: number }
  | { event: "notification"; data: WsNotificationData; unread_count: number }
  | {
    event: "read";
    notification_ids: string[];
    unread_count: number;
    read_at: string;
  }
  | { event: "pong" };

function getWebSocketUrl(token: string): string {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "https://buildcapi.tekxai.com/api/v1";
  const wsBase = apiUrl.replace(/^http/, "ws");
  return `${wsBase}/notifications/ws?token=${token}`;
}

const RECONNECT_DELAY_MS = 3000;
const PING_INTERVAL_MS = 30000;

export function useNotificationsSocket() {
  const { token } = useAuthStore() as { token?: string };
  const queryClient = useQueryClient();

  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotification, setLastNotification] =
    useState<WsNotificationData | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const invalidateNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  useEffect(() => {
    if (!token) return;

    let isUnmounted = false;

    const connect = () => {
      const ws = new WebSocket(getWebSocketUrl(token));
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);

        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ action: "ping" }));
          }
        }, PING_INTERVAL_MS);
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as WsIncomingEvent;

          if (payload.event === "connected") {
            setUnreadCount(payload.unread_count);
          } else if (payload.event === "notification") {
            setUnreadCount(payload.unread_count);
            setLastNotification(payload.data);
            invalidateNotifications();
          } else if (payload.event === "read") {
            setUnreadCount(payload.unread_count);
            invalidateNotifications();
          }
        } catch (error) {
          console.error("Failed to parse WS message", error);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

        if (!isUnmounted) {
          reconnectTimerRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [token, invalidateNotifications]);

  const markRead = useCallback((notificationIds: string[]) => {
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({ action: "mark_read", notification_ids: notificationIds }),
      );
      return true;
    }
    return false;
  }, []);

  const markAllRead = useCallback(() => {
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ action: "mark_all_read" }));
      return true;
    }
    return false;
  }, []);

  return {
    isConnected,
    unreadCount,
    lastNotification,
    markRead,
    markAllRead,
  };
}
"use client";

import { useEffect } from "react";

export const SUBSCRIPTION_UPDATED_EVENT = "buildpro:subscription-updated";
const CONFIRMATION_FALLBACK_MS = 20000;

interface SubscriptionSnapshot {
  subscription_status?: string | null;
  plan_code?: string | null;
}

function isActiveSubscription(snapshot?: SubscriptionSnapshot | null): boolean {
  return snapshot?.subscription_status === "active" || snapshot?.subscription_status === "trialing";
}

export function useSubscriptionConfirmation(
  sessionId: string | null,
  refetchSubscription: () => Promise<{ data?: SubscriptionSnapshot | null }>,
  onConfirmed: (planCode?: string | null) => void,
  onMissingSession: () => void,
) {
  useEffect(() => {
    if (!sessionId) {
      onMissingSession();
      return;
    }
    let isSettled = false;
    const settle = (planCode?: string | null) => {
      if (isSettled) return;
      isSettled = true;
      onConfirmed(planCode);
    };
    const confirmFromServer = async () => {
      const result = await refetchSubscription();
      if (isActiveSubscription(result.data)) settle(result.data?.plan_code);
    };
    const handleLiveUpdate = (event: Event) => {
      const detail = (event as CustomEvent<SubscriptionSnapshot>).detail;
      if (isActiveSubscription(detail)) {
        void refetchSubscription().then(() => settle(detail.plan_code));
      }
    };
    window.addEventListener(SUBSCRIPTION_UPDATED_EVENT, handleLiveUpdate);
    void confirmFromServer();
    const fallbackTimer = window.setTimeout(() => void refetchSubscription().then((result) => settle(result.data?.plan_code)), CONFIRMATION_FALLBACK_MS);
    return () => {
      isSettled = true;
      window.removeEventListener(SUBSCRIPTION_UPDATED_EVENT, handleLiveUpdate);
      window.clearTimeout(fallbackTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);
}

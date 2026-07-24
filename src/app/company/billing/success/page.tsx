"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useSubscriptionQuery } from "@/services/billingService";
import { cn } from "@/lib/utils/cn";

export default function BillingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying",
  );

  const {
    data: subscription,
    refetch,
    isFetching,
  } = useSubscriptionQuery();

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // Stripe webhook usually updates the subscription slightly after
    // checkout completes, so we poll a couple of times to give it a
    // moment to land before showing the final state.
    let attempts = 0;
    const maxAttempts = 5;

    const poll = async () => {
      attempts += 1;
      const result = await refetch();

      const isActive =
        result.data?.subscription_status === "active" ||
        result.data?.subscription_status === "trialing";

      if (isActive) {
        setStatus("success");
        return;
      }

      if (attempts < maxAttempts) {
        setTimeout(poll, 1500);
      } else {
        // Even if we can't confirm yet, checkout itself succeeded
        // (Stripe only redirects here on success), so don't scare the user.
        setStatus("success");
      }
    };

    poll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4">
      <div className="w-full  rounded-[16px] border border-border bg-white p-8 text-center ">
        {status === "verifying" ? (
          <>
            <Loader2 className="mx-auto size-12 animate-spin text-primary" />
            <h1 className="mt-4 font-heading text-xl font-bold text-foreground">
              Confirming your payment...
            </h1>
            <p className="mt-2 font-body text-sm text-stat-label">
              This will only take a moment. Please don&apos;t close this
              page.
            </p>
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="mx-auto size-12 text-success" />
            <h1 className="mt-4 font-heading text-xl font-bold text-foreground">
              Payment successful!
            </h1>
            <p className="mt-2 font-body text-sm text-stat-label">
              {subscription
                ? `You're now on the ${subscription.plan_name} plan.`
                : "Your subscription has been updated."}
            </p>

            {sessionId ? (
              <p className="mt-3 truncate font-body text-xs text-stat-label">
                Session: {sessionId}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.push("/company/billing")}
                className={cn(
                  buttonVariants({ variant: "primary" }),
                  "h-11 w-full sm:w-auto",
                )}
              >
                Go to Billing
              </button>
              <button
                type="button"
                onClick={() => router.push("/company/dashboard")}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 w-full sm:w-auto",
                )}
              >
                Go to Dashboard
              </button>
            </div>
          </>
        ) : (
          <>
            <XCircle className="mx-auto size-12 text-destructive" />
            <h1 className="mt-4 font-heading text-xl font-bold text-foreground">
              Something went wrong
            </h1>
            <p className="mt-2 font-body text-sm text-stat-label">
              We couldn&apos;t confirm your checkout session. If you were
              charged, your subscription should update shortly &mdash;
              otherwise please try again.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.push("/billing")}
                className={cn(
                  buttonVariants({ variant: "primary" }),
                  "h-11 w-full sm:w-auto",
                )}
              >
                Back to Billing
              </button>
            </div>
          </>
        )}

        {isFetching && status !== "verifying" ? (
          <p className="mt-3 font-body text-xs text-stat-label">
            Refreshing subscription details...
          </p>
        ) : null}
      </div>
    </div>
  );
}
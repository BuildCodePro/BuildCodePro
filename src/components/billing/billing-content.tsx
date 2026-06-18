"use client";

import {
  CURRENT_BILLING_USAGE,
  PAYMENT_METHOD,
} from "@/lib/constants/billing";

import { AvailablePlans } from "./available-plans";
import { InvoiceHistory } from "./invoice-history";
import { PaymentMethodCard } from "./payment-method-card";
import { PlanUsageBanner } from "./plan-usage-banner";

export function BillingContent() {
  return (
    <div className="flex w-full flex-col gap-6">
      <PlanUsageBanner usage={CURRENT_BILLING_USAGE} />
      <PaymentMethodCard paymentMethod={PAYMENT_METHOD} />
      <AvailablePlans />
      <InvoiceHistory />
    </div>
  );
}

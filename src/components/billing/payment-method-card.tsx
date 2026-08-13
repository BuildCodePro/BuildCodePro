import { CreditCard } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { usePortalMutation } from "@/services/billingService";
import type { PaymentMethod } from "@/lib/constants/billing";

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  className?: string;
}

export function PaymentMethodCard({
  paymentMethod,
  className,
}: PaymentMethodCardProps) {
  const portalMutation = usePortalMutation();

  const handleUpdate = () => {
    portalMutation.mutate(undefined, {
      onSuccess: (data: any) => {
        window.location.href = data.portal_url;
      },
    });
  };

  return (
    <Card
      className={cn(
        "flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-border bg-surface text-stat-label">
          <CreditCard className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-body text-sm font-semibold text-foreground">
            {paymentMethod.brand} ending in {paymentMethod.last4}
          </p>
          <p className="font-body text-sm text-stat-label">
            Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
          </p>
        </div>
      </div>

      <Button
        variant="primary"
        type="button"
        size={"sm"}
        onClick={handleUpdate}
        disabled={portalMutation.isPending}
        className="w-full sm:w-auto cursor-pointer"
      >
        {portalMutation.isPending ? "Opening..." : "Update Card"}
      </Button>
    </Card>
  );
}
"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type AlertBannerVariant = "info" | "success" | "warning" | "danger";

interface AlertBannerProps {
  variant?: AlertBannerVariant;
  title: string;
  description?: string;
  className?: string;
  /** Show a close (X) button that dismisses the banner. */
  dismissible?: boolean;
  /** Called when the user dismisses the banner. */
  onDismiss?: () => void;
  /** Optional action rendered on the right side (e.g. a retry button/link). */
  action?: React.ReactNode;
  /** Optional status badge rendered in the top-right corner (e.g. "Live", "Beta", "New"). */
  badge?: string;
  time?: string;
}

const VARIANT_CONFIG: Record<
  AlertBannerVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    container: string;
    iconWrap: string;
    iconColor: string;
    title: string;
    description: string;
    closeButton: string;
    badge: string;
    time: string;
  }
> = {
  info: {
    icon: Info,
    container: "border-blue-200 bg-blue-50",
    iconWrap: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "text-blue-900",
    description: "text-blue-700",
    closeButton: "text-blue-500 hover:bg-blue-100 hover:text-blue-700",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    time: "bg-blue-100 text-blue-700 border-blue-200",
  },
  success: {
    icon: CheckCircle2,
    container: "border-green-200 bg-green-50",
    iconWrap: "bg-green-100",
    iconColor: "text-green-600",
    title: "text-green-900",
    description: "text-green-700",
    closeButton: "text-green-500 hover:bg-green-100 hover:text-green-700",
    badge: "bg-green-100 text-green-700 border-green-200",
    time: "bg-blue-100 text-blue-700 border-blue-200",

  },
  warning: {
    icon: AlertTriangle,
    container: "border-amber-200 bg-amber-50",
    iconWrap: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "text-amber-900",
    description: "text-amber-700",
    closeButton: "text-amber-500 hover:bg-amber-100 hover:text-amber-700",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    time: "bg-blue-100 text-blue-700 border-blue-200",

  },
  danger: {
    icon: XCircle,
    container: "border-red-200 bg-red-50",
    iconWrap: "bg-red-100",
    iconColor: "text-red-600",
    title: "text-red-900",
    description: "text-red-700",
    closeButton: "text-red-500 hover:bg-red-100 hover:text-red-700",
    badge: "bg-red-100 text-red-700 border-red-200",
    time: "bg-blue-100 text-blue-700 border-blue-200",

  },
};

export function AlertBanner({
  variant = "info",
  title,
  time,
  description,
  className,
  dismissible = false,
  onDismiss,
  action,
  badge,
}: AlertBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role={variant === "danger" || variant === "warning" ? "alert" : "status"}
      className={cn(
        "relative flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 shadow-sm",
        "animate-in fade-in slide-in-from-top-1 duration-200",
        config.container,
        className,
      )}
    >
      {badge ? (
        <span
          className={cn(
            "absolute  right-4 inline-flex items-center rounded-full border px-2.5 py-0.5 font-body text-[11px] font-semibold shadow-sm",
            config.badge,
          )}
        >
          {badge}
        </span>
      ) : null}
      {time ? (
        <span
          className={cn(
            "absolute  right-[130px] inline-flex items-center rounded-full border px-2.5 py-0.5 font-body text-[11px] font-semibold shadow-sm",
            config.time,
          )}
        >
          {time}
        </span>
      ) : null}

      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          config.iconWrap,
        )}
      >
        <Icon className={cn("size-4.5", config.iconColor)} aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className={cn("font-body text-sm font-semibold leading-tight", config.title)}>
          {title}
        </p>
        {description ? (
          <p className={cn("mt-1 font-body text-sm leading-snug", config.description)}>
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0 pt-0.5">{action}</div> : null}

      {dismissible ? (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md transition-colors",
            config.closeButton,
          )}
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
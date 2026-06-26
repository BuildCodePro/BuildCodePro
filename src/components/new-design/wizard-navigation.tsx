import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface WizardBackButtonProps {
  onClick?: () => void;
  className?: string;
}

export function WizardBackButton({ onClick, className }: WizardBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 font-body text-sm font-medium text-stat-label transition-colors hover:text-foreground",
        className,
      )}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Back
    </button>
  );
}

interface WizardSectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function WizardSectionHeader({
  title,
  description,
  className,
}: WizardSectionHeaderProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <h2 className="font-body text-xl font-bold text-foreground">{title}</h2>
      {description ? (
        <p className="font-body text-sm text-stat-label">{description}</p>
      ) : null}
    </div>
  );
}

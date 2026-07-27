import { ArrowRight } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface WizardFooterProps {
  onSaveDraft?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  isContinueDisabled?: boolean;
  isSavingDraft?: boolean;
  className?: string;
}

export function WizardFooter({
  onSaveDraft,
  onContinue,
  continueLabel = "Continue",
  isContinueDisabled = false,
  isSavingDraft = false,
  className,
}: WizardFooterProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        className="h-11 max-w-none px-6"
        disabled={isSavingDraft}
        onClick={(event) => {
          // Guard against any accidental form submission / bubbling that
          // could trigger step navigation elsewhere in the tree.
          event.preventDefault();
          event.stopPropagation();
          onSaveDraft?.();
        }}
      >
        {isSavingDraft ? "Saving..." : "Save Draft"}
      </Button>
      <button
        type="button"
        disabled={isContinueDisabled}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onContinue?.();
        }}
        className={cn(
          buttonVariants({ variant: "primary" }),
          "h-11 max-w-none gap-2 px-6",
        )}
      >
        {continueLabel}
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
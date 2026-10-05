import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { DesignStep, DesignWizardStep } from "@/types/new-design";

interface DesignStepperProps {
  steps: DesignStep[];
  currentStep: DesignWizardStep;
  className?: string;
}

export function DesignStepper({
  steps,
  currentStep,
  className,
}: DesignStepperProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Design wizard progress" className={cn("w-full", className)}>
      <ol className="flex w-full items-center gap-2">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete = index < currentIndex;
          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full font-body text-sm font-semibold",
                    isActive || isComplete
                      ? "bg-primary text-white"
                      : "bg-slate-200 text-slate-500",
                  )}
                >
                  {isComplete ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    step.number
                  )}
                </span>
                <p
                  className={cn(
                    "truncate font-body text-sm",
                    isActive
                      ? "font-semibold text-primary"
                      : isComplete
                        ? "font-medium text-foreground"
                        : "text-stat-label",
                  )}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <span
                  className={cn(
                    "hidden h-px min-w-4 flex-1 sm:block",
                    index < currentIndex ? "bg-primary" : "bg-slate-200",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

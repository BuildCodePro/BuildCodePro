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
      <ol className="flex w-full gap-3">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete = index < currentIndex;

          return (
            <li
              key={step.id}
              className={cn(
                "flex h-[41px] min-w-0 flex-1 items-center rounded-[10px] border px-[14px] transition-colors",
                isActive
                  ? "border-primary/30 bg-primary/5"
                  : isComplete
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-border bg-white",
              )}
            >
              <p
                className={cn(
                  "truncate font-body text-sm leading-none whitespace-nowrap",
                  isActive
                    ? "font-semibold text-primary"
                    : isComplete
                      ? "font-medium text-success"
                      : "text-stat-label",
                )}
              >
                <span>{step.number}:</span>{" "}
                <span>{step.label}</span>
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

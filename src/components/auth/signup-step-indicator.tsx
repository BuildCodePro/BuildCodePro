import { cn } from "@/lib/utils/cn";

interface SignupStepIndicatorProps {
  currentStep: 1 | 2;
  className?: string;
}

const STEPS = [
  { number: 1, label: "Company Account" },
  { number: 2, label: "Invite Team" },
] as const;

export function SignupStepIndicator({
  currentStep,
  className,
}: SignupStepIndicatorProps) {
  return (
    <div className={cn("mb-8 w-full", className)}>
      <div className="flex items-center justify-center gap-3">
        {STEPS.map((step, index) => {
          const isActive = step.number === currentStep;
          const isComplete = step.number < currentStep;

          return (
            <div key={step.number} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full font-body text-sm font-semibold",
                    isActive || isComplete
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-stat-label",
                  )}
                >
                  {step.number}
                </span>
                <span
                  className={cn(
                    "hidden font-body text-xs sm:block",
                    isActive ? "font-medium text-foreground" : "text-stat-label",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 ? (
                <div
                  className={cn(
                    "mb-5 h-px w-12 sm:w-16",
                    isComplete ? "bg-primary" : "bg-border",
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center font-body text-xs text-stat-label">
        Step {currentStep} of 2
      </p>
    </div>
  );
}

import { Button, Card, CardContent } from "../ui";
import type { ApiErrorPayload } from "./wizard-helpers";

interface QuotaLimitFallbackProps {
  quotaError: ApiErrorPayload;
  onBackToProjects: () => void;
  onUpgrade: () => void;
}

export function QuotaLimitFallback({ quotaError, onBackToProjects, onUpgrade }: QuotaLimitFallbackProps) {
    return (
      <div className="flex w-full flex-col gap-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="size-6 text-red-600"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h3 className="font-body text-base font-semibold text-foreground">
                Monthly design limit reached
              </h3>
              <p className="mx-auto max-w-md font-body text-sm text-stat-label">
                {quotaError.message ??
                  "You've reached your monthly design limit."}
              </p>
              {quotaError.used != null && quotaError.limit != null ? (
                <p className="font-body text-xs text-stat-label">
                  {quotaError.used} of {quotaError.limit} designs used this
                  month
                </p>
              ) : null}
            </div>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-11 max-w-none px-6"
                onClick={onBackToProjects}
              >
                Back to Projects
              </Button>
              <Button
                type="button"
                className="h-11 max-w-none px-6"
                onClick={onUpgrade}
              >
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}

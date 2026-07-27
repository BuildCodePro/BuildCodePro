import { Lock } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface UpgradeAccountFallbackProps {
    featureName: string;
    className?: string;
}

export function UpgradeAccountFallback({
    featureName,
    className,
}: UpgradeAccountFallbackProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-border bg-surface px-6 py-16 text-center",
                className,
            )}
        >
            <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Lock className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
                <p className="font-heading text-base font-semibold text-foreground">
                    {featureName} isn&apos;t included in your plan
                </p>
                <p className="font-body text-sm text-stat-label">
                    Upgrade your account to unlock this feature.
                </p>
            </div>
            <Link
                href="/company/billing"
                className={cn(buttonVariants({ variant: "primary" }), "h-10 px-5 max-w-[300px]")}
            >
                Upgrade Your Account
            </Link>
        </div>
    );
}
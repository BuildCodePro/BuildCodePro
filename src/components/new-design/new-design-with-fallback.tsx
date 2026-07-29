"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Lock, Sparkles } from "lucide-react";

import { DesignWizard } from "@/components/new-design";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/auth-store";

function NoPlanFallback() {
    return (
        <div className="flex min-h-[60vh]  w-full flex-col items-center justify-center gap-4 rounded-[16px] border border-dashed border-border bg-gray-200 px-6 py-16 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Lock className="size-7" aria-hidden="true" />
            </span>

            <div className="space-y-1.5">
                <h2 className="font-heading text-xl font-semibold text-foreground">
                    You don't have an active plan
                </h2>
                <p className="mx-auto max-w-md font-body text-sm text-stat-label">
                    Subscribe to a plan to start creating fire alarm designs, generate
                    AI recommendations, and export reports.
                </p>
            </div>

            <Link
                href="/company/billing"
                className={cn(
                    buttonVariants({ variant: "primary" }),
                    "mt-2 h-11 gap-2 px-6 max-w-[250px]",
                )}
            >
                <Sparkles className="size-4" aria-hidden="true" />
                Upgrade Plan
            </Link>
        </div>
    );
}

export function NewDesignPageClient() {
    const { user } = useAuthStore();

    const hasActivePlan = Boolean(user?.plan);

    if (!hasActivePlan) {
        return <NoPlanFallback />;
    }

    return (
        <Suspense fallback={<TableSkeleton rows={10} columns={2} />}>
            <DesignWizard />
        </Suspense>
    );
}
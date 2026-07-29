import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils/cn";

interface TableEmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    className?: string;
}

export function TableEmptyState({
    title,
    description,
    icon,
    className,
}: TableEmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col w-full items-center justify-center rounded-xl border border-dashed border-border bg-gray-200 px-6 py-12 text-center",
                className
            )}
        >
            <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                {icon ?? <Inbox className="h-8 w-8" />}
            </div>

            <h3 className="text-lg font-semibold text-foreground">
                {title}
            </h3>

            {description && (
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}
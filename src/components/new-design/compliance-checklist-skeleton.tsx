import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function ComplianceChecklistSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i} className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Card>
            <CardContent className="divide-y divide-border px-6 py-0">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      ))}
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { DesignWizard } from "@/components/new-design";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export const metadata: Metadata = {
  title: "New Design",
  description: "Create a new fire alarm design and estimation",
};

export default function NewDesignPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={10} columns={2} />}>
      <DesignWizard />
    </Suspense>
  );
}

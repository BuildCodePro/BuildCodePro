"use client";

import { useMemo, useState } from "react";
import { Download, Projector, Upload } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import {
  BOM_CATEGORIES,
  getBomCategoryLabel,
  type BomCategoryId,
} from "@/lib/constants/bom";
import { cn } from "@/lib/utils/cn";
import { useBomQuery } from "@/services/bomService";
import type { BomLineItem } from "@/types/bom";

import { BomLineItemsTable } from "./bom-line-items-table";
import { TableSkeleton } from "../ui/table-skeleton";
import { TableEmptyState } from "../ui/emptyState";

interface BomMaterialTakeoffPanelProps {
  projectId?: string;
  onExportCsv?: () => void;
  onIncludeInPdf?: () => void;
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function BomMaterialTakeoffPanel({
  projectId,
  onExportCsv,
  onIncludeInPdf,
}: BomMaterialTakeoffPanelProps) {
  const [activeCategory, setActiveCategory] =
    useState<BomCategoryId>("all");



  const { data: bom, isLoading, isError, error } = useBomQuery(projectId);




  const allLines: BomLineItem[] = bom?.lines ?? [];
  const currency = bom?.currency ?? "USD";

  const categoryItems = useMemo(() => {
    if (activeCategory === "all") return allLines;
    return allLines.filter((line) => line.category === activeCategory);
  }, [allLines, activeCategory]);

  const categoryLabel = getBomCategoryLabel(activeCategory);

  // Stats for the currently selected category/tab
  const categoryItemCount = categoryItems.length;
  const categoryDeviceCount = categoryItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const categoryCost = categoryItems.reduce(
    (sum, item) => sum + item.line_total,
    0,
  );

  // Overall project stats (independent of the active tab), driven by the
  // API's own total_cost so it always matches the backend's number.
  const totalItemCount = allLines.length;
  const totalDeviceCount = allLines.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalCost = bom?.total_cost ?? categoryCost;

  if (!projectId) {
    return (
      <div className="flex items-center justify-center rounded-[14px] border border-border bg-white py-16">
        <p className="font-body text-sm text-stat-label">
          <TableEmptyState title="No project selected." icon={<Projector className="w-8 h-8" />} />
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <TableSkeleton columns={4} rows={6} />
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-[14px] border border-border bg-white py-16">
        <p className="font-body text-sm font-medium text-red-600">
          Bill of materials not found.
        </p>
        <p className="font-body text-xs text-stat-label">
          {error instanceof Error ? error.message : "Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">

          <p className="font-body text-lg font-medium">
            Project total: {totalItemCount.toLocaleString("en-US")} items
          </p>
        </div>

        {/* <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant="outline"
            className="h-11 max-w-none gap-2 px-5"
            onClick={onExportCsv}
          >
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </Button>
          <button
            type="button"
            onClick={onIncludeInPdf}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "h-11 max-w-none gap-2 px-5",
            )}
          >
            <Upload className="size-4" aria-hidden="true" />
            Include in PDF
          </button>
        </div> */}
      </div>

      <UnderlineTabs
        tabs={BOM_CATEGORIES.map((category) => ({
          id: category.id,
          label: category.label,
        }))}
        activeTab={activeCategory}
        onTabChange={setActiveCategory}
        aria-label="BOM categories"
      />

      <TabPanel
        id={`tabpanel-bom-${activeCategory}`}
        labelledBy={`tab-${activeCategory}`}
      >
        <BomLineItemsTable items={categoryItems} currency={currency} />
      </TabPanel>
    </div>
  );
}
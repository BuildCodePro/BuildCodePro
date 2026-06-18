"use client";

import { useMemo, useState } from "react";
import { Download, Upload } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import {
  BOM_CATEGORIES,
  BOM_TOTAL_ITEMS,
  getBomCategoryLabel,
  getBomItemsByCategory,
} from "@/lib/constants/bom";
import { cn } from "@/lib/utils/cn";
import type { BomCategoryId } from "@/types/new-design";

import { BomLineItemsTable } from "./bom-line-items-table";

interface BomMaterialTakeoffPanelProps {
  totalItems?: number;
  onExportCsv?: () => void;
  onIncludeInPdf?: () => void;
}

export function BomMaterialTakeoffPanel({
  totalItems = BOM_TOTAL_ITEMS,
  onExportCsv,
  onIncludeInPdf,
}: BomMaterialTakeoffPanelProps) {
  const [activeCategory, setActiveCategory] =
    useState<BomCategoryId>("devices");

  const categoryItems = useMemo(
    () => getBomItemsByCategory(activeCategory),
    [activeCategory],
  );

  const categoryLabel = getBomCategoryLabel(activeCategory);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-body text-sm text-stat-label">
          {totalItems.toLocaleString("en-US")} items • {categoryLabel} category
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
        </div>
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
        <BomLineItemsTable items={categoryItems} />
      </TabPanel>
    </div>
  );
}

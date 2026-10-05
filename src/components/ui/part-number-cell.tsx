"use client";

import { ExternalLink } from "lucide-react";

import { GENERIC_ITEM_LABEL, isGenericBomItem } from "@/lib/constants/bom";
import { cn } from "@/lib/utils/cn";
import type { BomLineItem, PartResolutionStatus } from "@/types/bom";

const RESOLUTION_LABELS: Record<PartResolutionStatus, string> = {
  spec: "Per spec",
  past_bom: "Approved before",
  catalog: "From catalog",
  web: "Web sourced",
  unresolved: "Not resolved",
};

const RESOLUTION_STYLES: Record<PartResolutionStatus, string> = {
  spec: "bg-success/10 text-success",
  past_bom: "bg-success/10 text-success",
  catalog: "bg-primary/10 text-primary",
  web: "bg-amber-500/10 text-amber-600",
  unresolved: "bg-slate-200 text-slate-600",
};

interface PartNumberCellProps {
  lineItem: BomLineItem;
}

export function PartNumberCell({ lineItem }: PartNumberCellProps) {
  const citationUrl = lineItem.datasheet_url ?? lineItem.listing_url;
  const status = lineItem.resolution_status;

  if (!lineItem.part_number) {
    const isGenericItem = isGenericBomItem(lineItem);
    return (
      <div className="flex flex-col gap-1" data-testid="bom-part-cell" data-resolution={status}>
        <span className="text-stat-label" data-testid="bom-part-number">
          {isGenericItem ? "No part number" : "Not resolved"}
        </span>
        <span
          className={cn(
            "w-fit rounded-full px-2 py-0.5 text-[11px] font-medium",
            RESOLUTION_STYLES.unresolved,
          )}
          data-testid="bom-resolution-badge"
        >
          {isGenericItem ? GENERIC_ITEM_LABEL : RESOLUTION_LABELS.unresolved}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1" data-testid="bom-part-cell" data-resolution={status}>
      <span className="font-mono text-xs font-semibold text-foreground" data-testid="bom-part-number">
        {lineItem.part_number}
      </span>
      {lineItem.manufacturer ? (
        <span className="text-[11px] text-stat-label" data-testid="bom-manufacturer">
          {lineItem.manufacturer}
        </span>
      ) : null}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "w-fit rounded-full px-2 py-0.5 text-[11px] font-medium",
            RESOLUTION_STYLES[status] ?? RESOLUTION_STYLES.unresolved,
          )}
          data-testid="bom-resolution-badge"
        >
          {RESOLUTION_LABELS[status] ?? RESOLUTION_LABELS.unresolved}
        </span>
        {citationUrl ? (
          <a
            href={citationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
            data-testid="bom-citation-link"
          >
            Datasheet
            <ExternalLink className="size-3" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

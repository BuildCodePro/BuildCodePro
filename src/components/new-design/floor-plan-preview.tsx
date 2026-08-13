"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { Drawing } from "@/services/analysisService";
import { FloorPlanViewer } from "./floor-plan-viewer";
import { FileText, Image as ImageIcon } from "lucide-react";

interface FloorPlanPreviewProps {
  className?: string;
  design_image?: string;
  drawings?: Drawing[];
}

export function FloorPlanPreview({ className, design_image, drawings }: FloorPlanPreviewProps) {
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(
    drawings?.[0]?.id ?? null
  );

  const activeDrawing = drawings?.find((d) => d.id === selectedDrawingId) ?? drawings?.[0];
  const activeImageUrl = activeDrawing?.file_url ?? design_image ?? "";

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold text-accent-cyan">
            Floor Plan Preview
          </h3>
          <p className="mt-1 font-body text-xs text-stat-label">
            Drawing visualization — zoom in to inspect rooms, dimensions, and layout details
          </p>
        </div>

        {drawings && drawings.length > 1 ? (
          <div className="flex flex-wrap gap-1.5">
            {drawings.map((doc) => {
              const isSelected = (selectedDrawingId || drawings[0].id) === doc.id;
              const isPdf = doc.content_type?.includes("pdf") || doc.file_name?.endsWith(".pdf");

              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setSelectedDrawingId(doc.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors border",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-stat-label hover:text-foreground"
                  )}
                  title={doc.file_name}
                >
                  {isPdf ? (
                    <FileText className="size-3.5" />
                  ) : (
                    <ImageIcon className="size-3.5" />
                  )}
                  <span className="max-w-[120px] truncate">{doc.file_name}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <FloorPlanViewer design_image={activeImageUrl} />
    </div>
  );
}

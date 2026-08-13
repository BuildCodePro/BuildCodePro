"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { Drawing } from "@/services/analysisService";
import { FloorPlanViewer } from "./floor-plan-viewer";
import { FileText, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="flex flex-col gap-2">
        <div>
          <h3 className="font-heading text-base font-semibold text-accent-cyan">
            Floor Plan Preview
          </h3>
          <p className="mt-1 font-body text-xs text-stat-label">
            Drawing visualization — zoom in to inspect rooms, dimensions, and layout details
          </p>
        </div>

        {drawings && drawings.length > 1 ? (
          <div className="flex items-center justify-center gap-3 rounded-full border border-border bg-background px-3 py-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => {
                const currentIndex = drawings.findIndex((d) => (selectedDrawingId || drawings[0].id) === d.id);
                if (currentIndex > 0) setSelectedDrawingId(drawings[currentIndex - 1].id);
              }}
              disabled={drawings.findIndex((d) => (selectedDrawingId || drawings[0].id) === d.id) === 0}
              className="p-0.5 text-stat-label transition-colors hover:text-primary disabled:opacity-30"
              aria-label="Previous drawing"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              {(() => {
                const isPdf = activeDrawing?.content_type?.includes("pdf") || activeDrawing?.file_name?.endsWith(".pdf");
                return (
                  <>
                    {isPdf ? (
                      <FileText className="size-3.5 text-primary" />
                    ) : (
                      <ImageIcon className="size-3.5 text-primary" />
                    )}
                    <span className="max-w-[150px] truncate" title={activeDrawing?.file_name}>
                      {activeDrawing?.file_name}
                    </span>
                    <span className="text-xs font-normal text-stat-label">
                      ({drawings.findIndex((d) => (selectedDrawingId || drawings[0].id) === d.id) + 1}/{drawings.length})
                    </span>
                  </>
                );
              })()}
            </div>

            <button
              type="button"
              onClick={() => {
                const currentIndex = drawings.findIndex((d) => (selectedDrawingId || drawings[0].id) === d.id);
                if (currentIndex < drawings.length - 1) setSelectedDrawingId(drawings[currentIndex + 1].id);
              }}
              disabled={drawings.findIndex((d) => (selectedDrawingId || drawings[0].id) === d.id) === drawings.length - 1}
              className="p-0.5 text-stat-label transition-colors hover:text-primary disabled:opacity-30"
              aria-label="Next drawing"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        ) : null}
      </div>

      <FloorPlanViewer design_image={activeImageUrl} />
    </div>
  );
}

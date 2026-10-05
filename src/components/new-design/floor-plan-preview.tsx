"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Maximize2, Minimize2 } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { Drawing } from "@/services/analysisService";
import { UploadedDocumentViewer } from "./uploaded-document-viewer";

interface FloorPlanPreviewProps {
  className?: string;
  design_image?: string;
  drawings?: Drawing[];
}

function isPdfDrawing(drawing?: Drawing) {
  return Boolean(
    drawing?.content_type?.toLowerCase().includes("pdf") ||
      drawing?.file_name?.toLowerCase().endsWith(".pdf"),
  );
}

export function FloorPlanPreview({
  className,
  design_image,
  drawings,
}: FloorPlanPreviewProps) {
  const [selectedDrawingId, setSelectedDrawingId] = useState<string | null>(
    drawings?.[0]?.id ?? null,
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const activeDrawing =
    drawings?.find((drawing) => drawing.id === selectedDrawingId) ?? drawings?.[0];
  const activeDrawingIndex = drawings
    ? drawings.findIndex((drawing) => drawing.id === (activeDrawing?.id ?? ""))
    : -1;
  const documentUrl = activeDrawing?.file_url || design_image || "";
  const wrapperClass = isFullscreen
    ? "fixed inset-0 z-50 flex flex-col bg-slate-950"
    : cn("flex flex-col", className);

  return (
    <div className={wrapperClass}>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-3">
          <h3 className="font-heading text-sm font-semibold text-accent-cyan">Floor Plan</h3>
          {drawings && drawings.length > 1 ? (
            <div className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5">
              <button
                type="button"
                onClick={() => {
                  if (activeDrawingIndex > 0) {
                    setSelectedDrawingId(drawings[activeDrawingIndex - 1].id);
                  }
                }}
                disabled={activeDrawingIndex <= 0}
                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30"
                aria-label="Previous drawing"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="flex items-center gap-1 text-xs text-slate-300">
                {isPdfDrawing(activeDrawing) ? (
                  <FileText className="size-3 text-primary" />
                ) : (
                  <ImageIcon className="size-3 text-primary" />
                )}
                <span className="max-w-[120px] truncate">{activeDrawing?.file_name}</span>
                <span className="text-slate-500">
                  ({activeDrawingIndex + 1}/{drawings.length})
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  if (activeDrawingIndex < drawings.length - 1) {
                    setSelectedDrawingId(drawings[activeDrawingIndex + 1].id);
                  }
                }}
                disabled={activeDrawingIndex >= drawings.length - 1}
                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30"
                aria-label="Next drawing"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
      </div>
      <div className="min-h-0 flex-1">
        <UploadedDocumentViewer
          fileUrl={documentUrl}
          fileName={activeDrawing?.file_name}
          contentType={activeDrawing?.content_type}
          className="h-full"
        />
      </div>
    </div>
  );
}

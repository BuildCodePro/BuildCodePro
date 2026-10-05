"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { ZoomControls } from "./floor-plan-zoom-controls";
import { PlanViewport } from "./floor-plan-viewport";
import {
  FALLBACK_NATURAL_SIZE,
  usePlanTransform,
  useViewportSize,
  type ViewportSize,
} from "./floor-plan-viewer-transform";

interface FloorPlanViewerProps {
  className?: string;
  showExpand?: boolean;
  design_image?: string;
}

function FloorPlanFullscreen({
  onClose,
  design_image,
}: {
  onClose: () => void;
  design_image?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const { ref: viewportRef, size: viewportSize } = useViewportSize(mounted);
  const [naturalSize, setNaturalSize] = useState<ViewportSize | undefined>(undefined);
  const {
    zoom,
    pan,
    isDragging,
    setIsDragging,
    applyPan,
    resetView,
    handleZoomIn,
    handleZoomOut,
    handleWheelZoom,
    handleDoubleClickZoom,
  } = usePlanTransform(viewportSize, naturalSize);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const scrollY = window.scrollY;
    const { style } = document.body;

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.overflow = "hidden";
    style.width = "100%";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        handleZoomIn();
      }
      if (event.key === "-") {
        event.preventDefault();
        handleZoomOut();
      }
      if (event.key === "0") {
        event.preventDefault();
        resetView();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.overflow = "";
      style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [handleZoomIn, handleZoomOut, onClose, resetView]);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-sidebar"
      role="dialog"
      aria-modal="true"
      aria-label="Floor plan full screen preview"
    >
      <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <h3 className="font-heading text-lg font-semibold text-white sm:text-xl">
            Floor Plan Preview
          </h3>
          <p className="mt-1 font-body text-xs text-slate-400 sm:text-sm">
            Full screen · Scroll or +/- to zoom · Drag to pan · Double-click to
            toggle zoom · Esc to close
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 max-w-none shrink-0 rounded-[8px] border-white/20 bg-transparent px-3 text-white hover:bg-white/10",
          )}
          aria-label="Close full screen preview"
        >
          <X className="size-4" />
        </button>
      </header>

      <div className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-6">
        <ZoomControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={resetView}
          dark
        />
      </div>

      <div ref={viewportRef} className="relative min-h-0 flex-1">
        <PlanViewport
          design_image={design_image}
          zoom={zoom}
          pan={pan}
          viewportSize={
            viewportSize.width > 0 ? viewportSize : FALLBACK_NATURAL_SIZE
          }
          naturalSize={naturalSize}
          isDragging={isDragging}
          fullscreen
          onPanChange={applyPan}
          onNaturalSize={setNaturalSize}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onWheelZoom={handleWheelZoom}
          onDoubleClickZoom={handleDoubleClickZoom}
        />
      </div>
    </div>,
    document.body,
  );
}

export function FloorPlanViewer({
  design_image,
  className,
  showExpand = true,
}: FloorPlanViewerProps) {
  const resolvedImage = design_image?.trim() ? design_image : undefined;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [naturalSize, setNaturalSize] = useState<ViewportSize | undefined>(undefined);
  const { ref: viewportRef, size: viewportSize } = useViewportSize(true);
  const {
    zoom,
    pan,
    isDragging,
    setIsDragging,
    applyPan,
    resetView,
    handleZoomIn,
    handleZoomOut,
    handleWheelZoom,
    handleDoubleClickZoom,
  } = usePlanTransform(viewportSize, naturalSize);

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <ZoomControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={resetView}
          onExpand={() => setIsFullscreen(true)}
          showExpand={showExpand}
        />

        <div ref={viewportRef}>
          {viewportSize.width > 0 ? (
            <PlanViewport
              design_image={resolvedImage}
              zoom={zoom}
              pan={pan}
              viewportSize={viewportSize}
              naturalSize={naturalSize}
              isDragging={isDragging}
              onPanChange={applyPan}
              onNaturalSize={setNaturalSize}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              onWheelZoom={handleWheelZoom}
              onDoubleClickZoom={handleDoubleClickZoom}
            />
          ) : (
            <div className="min-h-[280px] rounded-[12px] border border-border bg-[#0a2463] sm:min-h-[360px]" />
          )}
        </div>
      </div>

      {isFullscreen ? (
        <FloorPlanFullscreen design_image={resolvedImage} onClose={() => setIsFullscreen(false)} />
      ) : null}
    </>
  );
}

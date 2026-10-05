"use client";

import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { MAX_ZOOM, MIN_ZOOM } from "./floor-plan-viewer-transform";

export function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  onExpand,
  showExpand,
  dark = false,
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onExpand?: () => void;
  showExpand?: boolean;
  dark?: boolean;
}) {
  const shellClass = dark
    ? "border-white/15 bg-white/10"
    : "border-border bg-white";
  const buttonClass = dark
    ? "text-white hover:bg-white/10"
    : undefined;
  const labelClass = dark ? "text-white" : "text-foreground";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className={cn(
          "inline-flex items-center rounded-[10px] border p-1 shadow-sm",
          shellClass,
        )}
      >
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= MIN_ZOOM}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "size-8 max-w-none rounded-[8px] p-0 disabled:opacity-40",
            buttonClass,
          )}
          aria-label="Zoom out"
        >
          <Minus className="size-4" />
        </button>
        <span
          className={cn(
            "min-w-13 px-2 text-center font-body text-xs font-medium",
            labelClass,
          )}
        >
          {Math.round(zoom * 100)}%
        </span>
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= MAX_ZOOM}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "size-8 max-w-none rounded-[8px] p-0 disabled:opacity-40",
            buttonClass,
          )}
          aria-label="Zoom in"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={onReset}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-8 max-w-none gap-1.5 rounded-[8px] px-3 text-xs",
          dark && "border-white/20 bg-transparent text-white hover:bg-white/10",
        )}
      >
        <RotateCcw className="size-3.5" />
        Reset
      </button>

      {showExpand && onExpand ? (
        <button
          type="button"
          onClick={onExpand}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-8 max-w-none gap-1.5 rounded-[8px] px-3 text-xs",
          )}
        >
          <Maximize2 className="size-3.5" />
          Full Screen
        </button>
      ) : null}
    </div>
  );
}

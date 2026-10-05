"use client";

import { ZoomIn } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { cn } from "@/lib/utils/cn";
import {
  clampPan,
  getFittedImageSize,
  MIN_ZOOM,
  WHEEL_ZOOM_STEP,
  type DragState,
  type PanOffset,
  type ViewportSize,
} from "./floor-plan-viewer-transform";

export function PlanViewport({
  zoom,
  design_image,
  pan,
  viewportSize,
  naturalSize,
  isDragging,
  fullscreen = false,
  onPanChange,
  onNaturalSize,
  onDragStart,
  onDragEnd,
  onWheelZoom,
  onDoubleClickZoom,
}: {
  zoom: number;
  pan: PanOffset;
  design_image?: string;
  viewportSize: ViewportSize;
  naturalSize?: ViewportSize;
  isDragging: boolean;
  fullscreen?: boolean;
  onPanChange: (offset: PanOffset) => void;
  onNaturalSize: (size: ViewportSize) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onWheelZoom: (delta: number, localX: number, localY: number) => void;
  onDoubleClickZoom: (localX: number, localY: number) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

  const [imageFailedToLoad, setImageFailedToLoad] = useState(false);
  useEffect(() => {
    setImageFailedToLoad(false);
  }, [design_image]);

  const getLocalPoint = (clientX: number, clientY: number) => {
    const bounds = viewportRef.current?.getBoundingClientRect();
    if (!bounds) {
      return {
        x: viewportSize.width / 2,
        y: viewportSize.height / 2,
      };
    }

    return {
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    };
  };

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? -WHEEL_ZOOM_STEP : WHEEL_ZOOM_STEP;
      const point = getLocalPoint(event.clientX, event.clientY);
      onWheelZoom(delta, point.x, point.y);
    };

    const preventDrag = (event: DragEvent) => {
      event.preventDefault();
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    node.addEventListener("dragstart", preventDrag);

    return () => {
      node.removeEventListener("wheel", onWheel);
      node.removeEventListener("dragstart", preventDrag);
    };
  }, [onWheelZoom, viewportSize.height, viewportSize.width]);

  const updatePanFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const drag = dragRef.current;
      if (!drag) {
        return;
      }

      const nextPan = clampPan(
        {
          x: drag.panX + (clientX - drag.startX),
          y: drag.panY + (clientY - drag.startY),
        },
        zoom,
        viewportSize,
      );
      onPanChange(nextPan);
    },
    [onPanChange, viewportSize, zoom],
  );

  const finishDrag = useCallback(
    (pointerId: number) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== pointerId) {
        return;
      }

      dragRef.current = null;
      onDragEnd();
    },
    [onDragEnd],
  );

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const onDocumentPointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      event.preventDefault();
      updatePanFromPointer(event.clientX, event.clientY);
    };

    const onDocumentPointerEnd = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || event.pointerId !== drag.pointerId) {
        return;
      }

      event.preventDefault();
      finishDrag(event.pointerId);
    };

    document.addEventListener("pointermove", onDocumentPointerMove);
    document.addEventListener("pointerup", onDocumentPointerEnd);
    document.addEventListener("pointercancel", onDocumentPointerEnd);

    return () => {
      document.removeEventListener("pointermove", onDocumentPointerMove);
      document.removeEventListener("pointerup", onDocumentPointerEnd);
      document.removeEventListener("pointercancel", onDocumentPointerEnd);
    };
  }, [finishDrag, isDragging, updatePanFromPointer]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || zoom <= MIN_ZOOM) {
      return;
    }

    event.preventDefault();

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    onDragStart();
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    event.preventDefault();
    updatePanFromPointer(event.clientX, event.clientY);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    finishDrag(event.pointerId);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleDoubleClick = (event: ReactPointerEvent<HTMLDivElement>) => {
    const point = getLocalPoint(event.clientX, event.clientY);
    onDoubleClickZoom(point.x, point.y);
  };

  const fitted = getFittedImageSize(viewportSize, naturalSize);

  return (
    <div
      ref={viewportRef}
      className={cn(
        "relative overflow-hidden bg-[#0a2463] select-none",
        fullscreen ? "absolute inset-0" : "min-h-[280px] rounded-[12px] border border-border sm:min-h-[360px]",
        zoom > MIN_ZOOM
          ? isDragging
            ? "cursor-grabbing"
            : "cursor-grab"
          : "cursor-zoom-in",
      )}
      style={{ touchAction: "none", WebkitUserSelect: "none" }}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={handleDoubleClick}
      role="img"
      aria-label={`Floor plan preview at ${Math.round(zoom * 100)} percent zoom`}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="pointer-events-none will-change-transform motion-reduce:transition-none"
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {design_image && !imageFailedToLoad ? (
            <img
              src={design_image}
              alt="Uploaded drawing"
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              onLoad={(event) => {
                onNaturalSize({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                });
              }}
              onError={() => setImageFailedToLoad(true)}
              className="pointer-events-none block max-w-none select-none [webkit-user-drag:none]"
              style={{
                width: fitted.width,
                height: fitted.height,
              }}
            />
          ) : (
            <div
              className="flex items-center justify-center rounded-md border border-white/20 bg-white/5 font-body text-xs text-white/70"
              style={{ width: fitted.width, height: fitted.height }}
            >
              {design_image ? "This drawing could not be loaded" : "No drawing uploaded"}
            </div>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
        <div className="rounded-full bg-black/45 px-2.5 py-1 font-body text-[11px] text-white backdrop-blur-sm">
          {fullscreen ? "Full screen" : "Preview"} · Double-click to zoom
        </div>
        {zoom <= MIN_ZOOM ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 font-body text-[11px] text-white backdrop-blur-sm">
            <ZoomIn className="size-3" aria-hidden="true" />
            Scroll or use + / −
          </div>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import {
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  X,
  ZoomIn,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const FLOOR_PLAN_SRC = "/images/floor-plan-preview.png";
const IMAGE_WIDTH = 540;
const IMAGE_HEIGHT = 480;
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.25;
const WHEEL_ZOOM_STEP = 0.12;

interface FloorPlanViewerProps {
  className?: string;
  showExpand?: boolean;
}

interface PanOffset {
  x: number;
  y: number;
}

interface ViewportSize {
  width: number;
  height: number;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  panX: number;
  panY: number;
}

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function getFittedImageSize(viewport: ViewportSize) {
  if (viewport.width === 0 || viewport.height === 0) {
    return { width: IMAGE_WIDTH, height: IMAGE_HEIGHT };
  }

  const scale = Math.min(
    viewport.width / IMAGE_WIDTH,
    viewport.height / IMAGE_HEIGHT,
  );

  return {
    width: IMAGE_WIDTH * scale,
    height: IMAGE_HEIGHT * scale,
  };
}

function clampPan(
  pan: PanOffset,
  zoom: number,
  viewport: ViewportSize,
): PanOffset {
  const fitted = getFittedImageSize(viewport);
  const scaledWidth = fitted.width * zoom;
  const scaledHeight = fitted.height * zoom;

  const maxX = Math.max(0, (scaledWidth - viewport.width) / 2);
  const maxY = Math.max(0, (scaledHeight - viewport.height) / 2);

  return {
    x: Math.min(maxX, Math.max(-maxX, pan.x)),
    y: Math.min(maxY, Math.max(-maxY, pan.y)),
  };
}

function ZoomControls({
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

function PlanViewport({
  zoom,
  pan,
  viewportSize,
  isDragging,
  fullscreen = false,
  onPanChange,
  onDragStart,
  onDragEnd,
  onWheelZoom,
  onDoubleClickZoom,
}: {
  zoom: number;
  pan: PanOffset;
  viewportSize: ViewportSize;
  isDragging: boolean;
  fullscreen?: boolean;
  onPanChange: (offset: PanOffset) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onWheelZoom: (delta: number, localX: number, localY: number) => void;
  onDoubleClickZoom: (localX: number, localY: number) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);

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

  const fitted = getFittedImageSize(viewportSize);

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FLOOR_PLAN_SRC}
            alt="Floor plan blueprint preview"
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
            className="pointer-events-none block max-w-none select-none [webkit-user-drag:none]"
            style={{
              width: fitted.width,
              height: fitted.height,
            }}
          />
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

function usePlanTransform(viewportSize: ViewportSize) {
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState<PanOffset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const applyPan = useCallback(
    (nextPan: PanOffset, nextZoom = zoom) => {
      setPan(clampPan(nextPan, nextZoom, viewportSize));
    },
    [viewportSize, zoom],
  );

  const resetView = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  }, []);

  const zoomAtPoint = useCallback(
    (nextZoom: number, localX: number, localY: number) => {
      const clamped = clampZoom(nextZoom);
      if (clamped === zoom) {
        return;
      }

      if (clamped === MIN_ZOOM) {
        setZoom(MIN_ZOOM);
        setPan({ x: 0, y: 0 });
        return;
      }

      if (viewportSize.width === 0 || viewportSize.height === 0) {
        setZoom(clamped);
        return;
      }

      const centerX = viewportSize.width / 2;
      const centerY = viewportSize.height / 2;
      const ratio = clamped / zoom;

      const nextPan = {
        x: (pan.x - (localX - centerX)) * ratio + (localX - centerX),
        y: (pan.y - (localY - centerY)) * ratio + (localY - centerY),
      };

      setZoom(clamped);
      setPan(clampPan(nextPan, clamped, viewportSize));
    },
    [pan, viewportSize, zoom],
  );

  const handleZoomIn = useCallback(() => {
    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;
    zoomAtPoint(zoom + ZOOM_STEP, centerX, centerY);
  }, [viewportSize.height, viewportSize.width, zoom, zoomAtPoint]);

  const handleZoomOut = useCallback(() => {
    const centerX = viewportSize.width / 2;
    const centerY = viewportSize.height / 2;
    zoomAtPoint(zoom - ZOOM_STEP, centerX, centerY);
  }, [viewportSize.height, viewportSize.width, zoom, zoomAtPoint]);

  const handleWheelZoom = useCallback(
    (delta: number, localX: number, localY: number) => {
      zoomAtPoint(zoom + delta, localX, localY);
    },
    [zoom, zoomAtPoint],
  );

  const handleDoubleClickZoom = useCallback(
    (clientX: number, clientY: number) => {
      if (zoom > MIN_ZOOM) {
        resetView();
        return;
      }
      zoomAtPoint(2, clientX, clientY);
    },
    [resetView, zoom, zoomAtPoint],
  );

  useEffect(() => {
    setPan((current) => clampPan(current, zoom, viewportSize));
  }, [viewportSize, zoom]);

  return {
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
  };
}

function useViewportSize(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<ViewportSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!enabled) {
      setSize({ width: 0, height: 0 });
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const update = () => {
      const rect = node.getBoundingClientRect();
      setSize({
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  return { ref, size };
}

function FloorPlanFullscreen({
  onClose,
}: {
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const { ref: viewportRef, size: viewportSize } = useViewportSize(mounted);
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
  } = usePlanTransform(viewportSize);

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
          zoom={zoom}
          pan={pan}
          viewportSize={
            viewportSize.width > 0
              ? viewportSize
              : { width: IMAGE_WIDTH, height: IMAGE_HEIGHT }
          }
          isDragging={isDragging}
          fullscreen
          onPanChange={applyPan}
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
  className,
  showExpand = true,
}: FloorPlanViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
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
  } = usePlanTransform(viewportSize);

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
              zoom={zoom}
              pan={pan}
              viewportSize={viewportSize}
              isDragging={isDragging}
              onPanChange={applyPan}
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
        <FloorPlanFullscreen onClose={() => setIsFullscreen(false)} />
      ) : null}
    </>
  );
}

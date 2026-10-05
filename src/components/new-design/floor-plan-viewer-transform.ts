"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export const FALLBACK_IMAGE_WIDTH = 540;
export const FALLBACK_IMAGE_HEIGHT = 480;
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 5;
export const ZOOM_STEP = 0.25;
export const WHEEL_ZOOM_STEP = 0.12;

export interface PanOffset {
  x: number;
  y: number;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  panX: number;
  panY: number;
}

export const FALLBACK_NATURAL_SIZE: ViewportSize = {
  width: FALLBACK_IMAGE_WIDTH,
  height: FALLBACK_IMAGE_HEIGHT,
};

export function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

export function getFittedImageSize(
  viewport: ViewportSize,
  naturalSize: ViewportSize = FALLBACK_NATURAL_SIZE,
) {
  const source = naturalSize.width > 0 && naturalSize.height > 0
    ? naturalSize
    : FALLBACK_NATURAL_SIZE;

  if (viewport.width === 0 || viewport.height === 0) {
    return { width: source.width, height: source.height };
  }

  const scale = Math.min(
    viewport.width / source.width,
    viewport.height / source.height,
  );

  return {
    width: source.width * scale,
    height: source.height * scale,
  };
}

export function clampPan(
  pan: PanOffset,
  zoom: number,
  viewport: ViewportSize,
  naturalSize?: ViewportSize,
): PanOffset {
  const fitted = getFittedImageSize(viewport, naturalSize);
  const scaledWidth = fitted.width * zoom;
  const scaledHeight = fitted.height * zoom;

  const maxX = Math.max(0, (scaledWidth - viewport.width) / 2);
  const maxY = Math.max(0, (scaledHeight - viewport.height) / 2);

  return {
    x: Math.min(maxX, Math.max(-maxX, pan.x)),
    y: Math.min(maxY, Math.max(-maxY, pan.y)),
  };
}

export function usePlanTransform(viewportSize: ViewportSize, naturalSize?: ViewportSize) {
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState<PanOffset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const applyPan = useCallback(
    (nextPan: PanOffset, nextZoom = zoom) => {
      setPan(clampPan(nextPan, nextZoom, viewportSize, naturalSize));
    },
    [naturalSize, viewportSize, zoom],
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
      setPan(clampPan(nextPan, clamped, viewportSize, naturalSize));
    },
    [naturalSize, pan, viewportSize, zoom],
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
    setPan((current) => clampPan(current, zoom, viewportSize, naturalSize));
  }, [naturalSize, viewportSize, zoom]);

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

export function useViewportSize(enabled: boolean) {
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

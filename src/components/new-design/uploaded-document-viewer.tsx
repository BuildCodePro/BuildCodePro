"use client";

import { Download, ExternalLink, FileText } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { FloorPlanViewer } from "./floor-plan-viewer";

type DocumentKind = "pdf" | "image" | "unsupported";

interface UploadedDocumentViewerProps {
  fileUrl?: string;
  fileName?: string;
  contentType?: string;
  className?: string;
}

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".svg"];

function resolveDocumentKind(contentType?: string, fileName?: string): DocumentKind {
  const normalizedContentType = contentType?.toLowerCase() ?? "";
  if (normalizedContentType.includes("pdf")) {
    return "pdf";
  }
  if (normalizedContentType.startsWith("image/")) {
    return "image";
  }
  const normalizedFileName = fileName?.toLowerCase() ?? "";
  if (normalizedFileName.endsWith(".pdf")) {
    return "pdf";
  }
  if (IMAGE_EXTENSIONS.some((extension) => normalizedFileName.endsWith(extension))) {
    return "image";
  }
  return "unsupported";
}

export function UploadedDocumentViewer({
  fileUrl,
  fileName,
  contentType,
  className,
}: UploadedDocumentViewerProps) {
  if (!fileUrl) {
    return (
      <div
        className={cn(
          "flex min-h-[360px] items-center justify-center rounded-[12px] border border-border bg-slate-900",
          className,
        )}
      >
        <p className="font-body text-sm text-white/70">No drawing uploaded yet</p>
      </div>
    );
  }

  const documentKind = resolveDocumentKind(contentType, fileName);

  if (documentKind === "image") {
    return <FloorPlanViewer design_image={fileUrl} className={className} />;
  }

  if (documentKind === "pdf") {
    return (
      <div
        className={cn(
          "flex min-h-[360px] flex-col overflow-hidden rounded-[12px] border border-border bg-slate-900",
          className,
        )}
      >
        <iframe
          src={fileUrl}
          title={fileName ? `${fileName} preview` : "Uploaded drawing preview"}
          className="w-full flex-1 border-0 bg-white"
        />
        <div className="flex shrink-0 items-center justify-between gap-3 bg-slate-950 px-4 py-2 text-xs text-white">
          <span className="truncate font-body">{fileName ?? "Uploaded drawing"}</span>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-primary hover:underline"
          >
            Open in new tab
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[360px] flex-col items-center justify-center gap-4 rounded-[12px] border border-border bg-slate-900 px-6 text-center",
        className,
      )}
    >
      <FileText className="size-10 text-primary" aria-hidden="true" />
      <div className="space-y-1">
        <p className="font-body text-sm font-medium text-white">
          {fileName ?? "Uploaded document"}
        </p>
        <p className="font-body text-xs text-white/60">
          This file type cannot be previewed in the browser. Open or download it to
          view the document.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 max-w-none rounded-[8px] border-white/20 bg-transparent px-3 text-white hover:bg-white/10",
          )}
        >
          <ExternalLink className="size-4" />
          Open
        </a>
        <a
          href={fileUrl}
          download={fileName}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-9 max-w-none rounded-[8px] border-white/20 bg-transparent px-3 text-white hover:bg-white/10",
          )}
        >
          <Download className="size-4" />
          Download
        </a>
      </div>
    </div>
  );
}

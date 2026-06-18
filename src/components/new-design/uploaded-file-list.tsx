import { Check, FileText } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { formatFileSize } from "@/lib/utils/file";
import type { UploadedFile } from "@/types/new-design";

interface UploadedFileItemProps {
  file: UploadedFile;
  onRemove?: (id: string) => void;
}

export function UploadedFileItem({ file, onRemove }: UploadedFileItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] border border-border bg-slate-50 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white border border-border">
          <FileText className="size-4 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-body text-sm font-medium text-foreground">
            {file.name}
          </p>
          <p className="font-body text-xs text-stat-label">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {file.status === "ready" ? (
          <span className="inline-flex items-center gap-1 font-body text-xs font-medium text-success">
            <Check className="size-3.5" aria-hidden="true" />
            Ready
          </span>
        ) : null}

        {onRemove ? (
          <button
            type="button"
            onClick={() => onRemove(file.id)}
            className="font-body text-xs text-stat-label hover:text-foreground"
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}

interface UploadedFileListProps {
  files: UploadedFile[];
  onRemove?: (id: string) => void;
  className?: string;
}

export function UploadedFileList({
  files,
  onRemove,
  className,
}: UploadedFileListProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {files.map((file) => (
        <UploadedFileItem key={file.id} file={file} onRemove={onRemove} />
      ))}
    </div>
  );
}

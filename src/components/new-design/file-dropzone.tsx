"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ACCEPTED_DRAWING_EXTENSIONS,
  ACCEPTED_DRAWING_TYPES,
  MAX_DRAWING_FILE_SIZE_BYTES,
} from "@/lib/constants/new-design";
import { cn } from "@/lib/utils/cn";
import { generateFileId } from "@/lib/utils/file";
import type { UploadedFile } from "@/types/new-design";

import { UploadedFileList } from "./uploaded-file-list";

interface FileDropzoneProps {
  files: UploadedFile[];
  onFilesAdded: (files: UploadedFile[]) => void;
  onFileRemove: (id: string) => void;
  className?: string;
}

function isAcceptedFile(file: File): boolean {
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  return (
    ACCEPTED_DRAWING_TYPES.includes(
      file.type as (typeof ACCEPTED_DRAWING_TYPES)[number],
    ) || ACCEPTED_DRAWING_EXTENSIONS.includes(
      extension as (typeof ACCEPTED_DRAWING_EXTENSIONS)[number],
    )
  );
}

function mapFileToUploaded(file: File): UploadedFile | null {
  if (!isAcceptedFile(file)) {
    return null;
  }

  if (file.size > MAX_DRAWING_FILE_SIZE_BYTES) {
    return null;
  }

  return {
    id: generateFileId(),
    name: file.name,
    size: file.size,
    type: file.type,
    status: "ready",
  };
}

export function FileDropzone({
  files,
  onFilesAdded,
  onFileRemove,
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) {
      return;
    }

    const uploaded = Array.from(fileList)
      .map(mapFileToUploaded)
      .filter((file): file is UploadedFile => file !== null);

    if (uploaded.length > 0) {
      onFilesAdded(uploaded);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="space-y-5">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFiles(event.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center rounded-[16px] border-2 border-dashed px-6 py-10 text-center transition-colors",
            isDragging
              ? "border-sky-400 bg-sky-50"
              : "border-sky-200 bg-sky-50/40",
          )}
        >
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-sky-100">
            <Upload className="size-6 text-sky-600" aria-hidden="true" />
          </div>

          <h3 className="font-body text-base font-semibold text-foreground">
            Upload construction drawings
          </h3>
          <p className="mt-2 max-w-md font-body text-sm text-stat-label">
            Drag and drop PDF, PNG, JPG, JPEG or WEBP files here.
          </p>
          <p className="mt-1 font-body text-xs text-stat-label">
            Max file size: 50 MB per file • Multiple files supported
          </p>

          <Button
            type="button"
            className="mt-6 h-10 max-w-none px-6"
            onClick={() => inputRef.current?.click()}
          >
            Browse Files
          </Button>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_DRAWING_EXTENSIONS.join(",")}
            className="hidden"
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = "";
            }}
          />
        </div>

        <UploadedFileList files={files} onRemove={onFileRemove} />
      </CardContent>
    </Card>
  );
}

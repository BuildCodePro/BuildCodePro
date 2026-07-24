



"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";

import { Label } from "@/components/ui/label";
import {
  ACCEPTED_LOGO_EXTENSIONS,
  ACCEPTED_LOGO_TYPES,
} from "@/lib/constants/settings";
import { cn } from "@/lib/utils/cn";
import { useUploadAvatarMutation } from "@/services/useProfileService";

interface LogoUploadFieldProps {
  label?: string;
  hint?: string;
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function LogoUploadField({
  label = "Company Logo",
  hint = "Upload company logo (PNG, SVG)",
  onFileSelect,
  className,
}: LogoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAvatarMutation = useUploadAvatarMutation();

  const handleFile = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    const isAccepted =
      ACCEPTED_LOGO_TYPES.includes(
        file.type as (typeof ACCEPTED_LOGO_TYPES)[number],
      ) ||
      ACCEPTED_LOGO_EXTENSIONS.includes(
        extension as (typeof ACCEPTED_LOGO_EXTENSIONS)[number],
      );

    if (!isAccepted) return;

    onFileSelect?.(file);
    uploadAvatarMutation.mutate(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploadAvatarMutation.isPending}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-sky-200 bg-sky-50/40 px-6 py-8 transition-colors hover:border-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Upload className="size-5 text-sky-500" aria-hidden="true" />
        <span className="font-body text-sm text-stat-label">
          {uploadAvatarMutation.isPending ? "Uploading..." : hint}
        </span>
      </button>

      {uploadAvatarMutation.isError && (
        <p className="text-sm text-red-500">
          Couldn&apos;t upload logo. Please try again.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_LOGO_EXTENSIONS.join(",")}
        className="hidden"
        onChange={(event) => {
          handleFile(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
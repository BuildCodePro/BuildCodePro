import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

import { getDynamicErrorMessage } from "@/lib/utils/error-handler";
import type { UploadedFile } from "@/types/new-design";

type PresignItem = { drawing_id: string; upload_url: string };
type CompleteResult = {
  items: { drawing_id: string; success: boolean; error_message?: string | null }[];
  completed_count: number;
  failed_count: number;
};

interface UploadWizardDrawingsOptions {
  uploadProjectId: string;
  filesToUpload: UploadedFile[];
  presign: (variables: {
    projectId: string;
    payload: { files: { file_name: string; content_type: string; file_size: number }[] };
  }) => Promise<PresignItem[]>;
  complete: (variables: { projectId: string; payload: { drawing_ids: string[] } }) => Promise<CompleteResult>;
  setFiles: Dispatch<SetStateAction<UploadedFile[]>>;
}

export async function uploadWizardDrawings({
  uploadProjectId,
  filesToUpload,
  presign,
  complete,
  setFiles,
}: UploadWizardDrawingsOptions): Promise<boolean> {
  try {
    // ── Phase 1: get presigned URLs ──────────────────────────────────
    console.log(
      "[Design Wizard] Requesting presigned URLs for",
      filesToUpload.length,
      "drawing(s), project:",
      uploadProjectId
    );
    const presignItems = await presign({
      projectId: uploadProjectId,
      payload: {
        files: filesToUpload.map((f) => ({
          file_name: f.file!.name,
          content_type: f.file!.type || "application/octet-stream",
          file_size: f.file!.size,
        })),
      },
    });

    // ── Phase 2: PUT each file directly to S3 ───────────────────────
    // Match by INDEX — presignItems[i] always corresponds to filesToUpload[i]
    // (the backend may normalise file_name, so string matching is unreliable)
    const putResults = await Promise.allSettled(
      presignItems.map(async (item, idx) => {
        const localFile = filesToUpload[idx]?.file;
        if (!localFile) {
          throw new Error(`No local file at index ${idx} for drawing ${item.drawing_id}`);
        }
        const res = await fetch(item.upload_url, {
          method: "PUT",
          body: localFile,
          headers: {
            "Content-Type": localFile.type || "application/octet-stream",
          },
        });
        if (!res.ok) {
          throw new Error(`S3 upload failed for drawing ${item.drawing_id}: HTTP ${res.status}`);
        }
        return item.drawing_id;
      })
    );

    const successfulDrawingIds: string[] = [];
    putResults.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        successfulDrawingIds.push(result.value);
      } else {
        console.error(
          `[Design Wizard] S3 PUT failed for drawing ${presignItems[idx]?.drawing_id}:`,
          result.reason
        );
      }
    });

    if (successfulDrawingIds.length === 0) {
      throw new Error("All S3 uploads failed. Please try again.");
    }

    // ── Phase 3: confirm uploads via complete-batch ──────────────────
    console.log(
      "[Design Wizard] Confirming",
      successfulDrawingIds.length,
      "upload(s) via complete-batch, drawing_ids:",
      successfulDrawingIds
    );
    const completeResult = await complete({
      projectId: uploadProjectId,
      payload: { drawing_ids: successfulDrawingIds },
    });

    // Reflect per-file results back on the UI (index-based)
    setFiles((prev) =>
      prev.map((f) => {
        const uploadIdx = filesToUpload.findIndex((fu) => fu.id === f.id);
        if (uploadIdx === -1) return f; // file not in this batch

        const presignItem = presignItems[uploadIdx];

        // S3 PUT failure for this index
        if (!successfulDrawingIds.includes(presignItem.drawing_id)) {
          return { ...f, status: "error", errorMessage: "S3 upload failed" };
        }

        // complete-batch per-item result (matched by drawing_id)
        const batchItem = completeResult.items.find(
          (r) => r.drawing_id === presignItem.drawing_id
        );
        if (batchItem?.success) {
          return { ...f, status: "uploaded" };
        }
        return {
          ...f,
          status: "error",
          errorMessage: batchItem?.error_message ?? "Confirmation failed",
        };
      })
    );


    const { completed_count, failed_count } = completeResult;
    if (failed_count > 0) {
      toast.warning(
        `${completed_count} file(s) uploaded. ${failed_count} file(s) could not be confirmed — check the list for details.`
      );
    } else {
      toast.success(`Uploaded ${completed_count} file(s) successfully!`);
    }
    return true;
  } catch (error: unknown) {
    console.error("[Design Wizard] Bulk presign/upload failed:", error);
    const message = getDynamicErrorMessage(error, "Upload failed");
    setFiles((prev) =>
      prev.map((f) =>
        filesToUpload.some((fu) => fu.id === f.id)
          ? { ...f, status: "error", errorMessage: message }
          : f
      )
    );
    toast.error(`Failed to upload drawings: ${message}`);
    return false;
  }
}

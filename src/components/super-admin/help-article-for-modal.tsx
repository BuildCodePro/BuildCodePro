"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { Modal } from "@/components/ui/modal";
import {
  useCreateHelpArticleMutation,
  useHelpArticleDetailQuery,
  useUpdateHelpArticleMutation,
} from "@/services/adminSupportService";
import type {
  CreateHelpArticleRequest,
  HelpArticleCategory,
} from "@/services/adminSupportService";
import { Input, Select } from "../ui";
import { cn } from "@/lib/utils/cn"

const CATEGORY_OPTIONS: { value: HelpArticleCategory; label: string }[] = [
  { value: "getting_started", label: "Getting Started" },
  { value: "upload_drawings", label: "Upload Drawings" },
  { value: "ai_analysis", label: "AI Analysis" },
  { value: "team_billing", label: "Team & Billing" },
  { value: "troubleshooting", label: "Troubleshooting" },
];

const CATEGORY_VALUES = CATEGORY_OPTIONS.map((opt) => opt.value) as [
  HelpArticleCategory,
  ...HelpArticleCategory[],
];

const FORM_ID = "help-article-form";

const EMPTY_FORM: CreateHelpArticleRequest = {
  title: "",
  category: "getting_started",
  summary: "",
  body: "",
  read_time_minutes: 3,
  sort_order: 0,
  is_published: false,
};

// Strips HTML tags so we can validate the actual text content of the
// rich-text editor's body, not the markup length.
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

const helpArticleSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  category: z.enum(CATEGORY_VALUES),
  summary: z
    .string()
    .trim()
    .min(20, "Summary must be at least 20 characters"),
  body: z
    .string()
    .refine((val) => stripHtml(val).length >= 20, {
      message: "Body must be at least 20 characters",
    }),
  read_time_minutes: z.number().min(1, "Read time must be at least 1 minute"),
});

type FormErrors = Partial<Record<keyof CreateHelpArticleRequest, string>>;

interface HelpArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId?: string | null;
  onSuccess?: () => void;
}

// Lightweight rich text editor for the article body — bold, italic,
// underline, and list formatting via contentEditable, no extra deps.
function RichTextEditor({
  id,
  value,
  onChange,
}: {
  id?: string;
  value: string;
  onChange: (html: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync external value changes (e.g. loading an existing article) into the
  // editor without clobbering the cursor while the user is typing.
  useEffect(() => {
    const node = editorRef.current;
    if (node && node.innerHTML !== value && document.activeElement !== node) {
      node.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    onChange(editorRef.current?.innerHTML ?? "");
  };

  const toolbarButtonClass =
    "rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-slate-200";

  return (
    <div className="rounded-md border border-border focus-within:border-primary">
      <div className="flex items-center gap-1 border-b border-border bg-slate-50 px-2 py-1.5">
        <button
          type="button"
          onClick={() => exec("bold")}
          className={cn(toolbarButtonClass, "font-bold")}
          aria-label="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className={cn(toolbarButtonClass, "italic")}
          aria-label="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className={cn(toolbarButtonClass, "underline")}
          aria-label="Underline"
        >
          U
        </button>
        <span className="mx-1 h-4 w-px bg-border" />
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className={toolbarButtonClass}
          aria-label="Bullet list"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          className={toolbarButtonClass}
          aria-label="Numbered list"
        >
          1. List
        </button>
      </div>
      <div
        id={id}
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="min-h-[160px] max-h-[320px] overflow-y-auto px-3 py-2 text-sm outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
      />
    </div>
  );
}

export function HelpArticleFormModal({
  isOpen,
  onClose,
  articleId,
  onSuccess,
}: HelpArticleFormModalProps) {
  const isEditMode = Boolean(articleId);

  const { data: articleDetail, isLoading: isDetailLoading } =
    useHelpArticleDetailQuery(isOpen ? articleId : null);

  const createMutation = useCreateHelpArticleMutation();
  const updateMutation = useUpdateHelpArticleMutation();

  const [form, setForm] = useState<CreateHelpArticleRequest>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  // Tracks which action triggered the save, so we know whether to send
  // is_published: false (draft) or true (publish).
  const [pendingAction, setPendingAction] = useState<"draft" | "publish">(
    "publish",
  );

  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    setPendingAction("publish");

    if (isEditMode && articleDetail) {
      setForm({
        title: articleDetail.title,
        category: articleDetail.category,
        summary: articleDetail.summary,
        body: articleDetail.body,
        read_time_minutes: articleDetail.read_time_minutes,
        sort_order: articleDetail.sort_order,
        is_published: articleDetail.is_published,
      });
    } else if (!isEditMode) {
      setForm(EMPTY_FORM);
    }
  }, [isOpen, isEditMode, articleDetail]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const updateField = <K extends keyof CreateHelpArticleRequest>(
    key: K,
    value: CreateHelpArticleRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const saveArticle = (isDraft: boolean) => {
    const payload: CreateHelpArticleRequest = {
      ...form,
      is_published: !isDraft,
    };

    const result = helpArticleSchema.safeParse(payload);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateHelpArticleRequest;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (isEditMode && articleId) {
      updateMutation.mutate(
        { articleId, payload },
        {
          onSuccess: () => {
            onSuccess?.();
            onClose();
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveArticle(pendingAction === "draft");
  };

  const handleSaveDraft = () => {
    setPendingAction("draft");
    saveArticle(true);
  };

  const statusLabel = form.is_published ? "Published" : "Draft";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Article" : "Create Article"}
      description={
        isEditMode
          ? "Update this help center article."
          : "Add a new article to the help center."
      }
      confirmText={isEditMode ? "Save Changes" : "Publish"}
      cancelText="Cancel"
      isConfirming={isSaving}
      formId={FORM_ID}
    >
      {isEditMode && isDetailLoading ? (
        <div className="space-y-3">
          <div className="h-9 animate-pulse rounded-md bg-slate-100" />
          <div className="h-9 animate-pulse rounded-md bg-slate-100" />
          <div className="h-24 animate-pulse rounded-md bg-slate-100" />
        </div>
      ) : (
        <form
          id={FORM_ID}
          onSubmit={handleSubmit}
          onKeyDown={() => setPendingAction("publish")}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                form.is_published
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-600",
              )}
            >
              {statusLabel}
            </span>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="article-title"
              className="text-sm font-medium text-foreground"
            >
              Title
            </label>
            <Input
              id="article-title"
              type="text"
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="How to upload drawings"
            />
            {errors.title ? (
              <p className="text-xs text-red-600">{errors.title}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="article-category"
                className="text-sm font-medium text-foreground"
              >
                Category
              </label>
              <Select
                options={CATEGORY_OPTIONS.map((opt) => ({
                  key: opt.value,
                  value: opt.value,
                  label: opt.label,
                }))}
                value={form.category}
                onChange={(value: string) =>
                  updateField("category", value as HelpArticleCategory)
                }
              />
              {errors.category ? (
                <p className="text-xs text-red-600">{errors.category}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="article-read-time"
                className="text-sm font-medium text-foreground"
              >
                Read Time (minutes)
              </label>
              <Input
                id="article-read-time"
                type="number"
                min={1}
                required
                value={form.read_time_minutes}
                onChange={(e) =>
                  updateField(
                    "read_time_minutes",
                    Number(e.target.value) || 1,
                  )
                }
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {errors.read_time_minutes ? (
                <p className="text-xs text-red-600">
                  {errors.read_time_minutes}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="article-summary"
              className="text-sm font-medium text-foreground"
            >
              Summary
            </label>
            <textarea
              id="article-summary"
              required
              rows={2}
              value={form.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              className="w-full resize-none rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Short one-line summary shown in the articles list (min. 20 characters)"
            />
            {errors.summary ? (
              <p className="text-xs text-red-600">{errors.summary}</p>
            ) : (
              <p className="text-xs text-stat-label">
                {form.summary.trim().length}/20 characters minimum
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="article-body"
              className="text-sm font-medium text-foreground"
            >
              Body
            </label>
            <RichTextEditor
              id="article-body"
              value={form.body}
              onChange={(html) => updateField("body", html)}
            />
            {errors.body ? (
              <p className="text-xs text-red-600">{errors.body}</p>
            ) : null}
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-slate-50 disabled:opacity-60"
            >
              {isSaving && pendingAction === "draft"
                ? "Saving Draft..."
                : "Save as Draft"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
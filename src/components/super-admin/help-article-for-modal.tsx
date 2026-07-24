"use client";

import { useEffect, useState } from "react";

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

const CATEGORY_OPTIONS: { value: HelpArticleCategory; label: string }[] = [
  { value: "getting_started", label: "Getting Started" },
  { value: "upload_drawings", label: "Upload Drawings" },
  { value: "ai_analysis", label: "AI Analysis" },
  { value: "team_billing", label: "Team & Billing" },
  { value: "troubleshooting", label: "Troubleshooting" },
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

interface HelpArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleId?: string | null;
  onSuccess?: () => void;
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

  useEffect(() => {
    if (!isOpen) return;

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isEditMode && articleId) {
      updateMutation.mutate(
        { articleId, payload: form },
        {
          onSuccess: () => {
            onSuccess?.();
            onClose();
          },
        },
      );
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      });
    }
  };

  const updateField = <K extends keyof CreateHelpArticleRequest>(
    key: K,
    value: CreateHelpArticleRequest[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
      confirmText={isEditMode ? "Save Changes" : "Create Article"}
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
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="article-title"
              className="text-sm font-medium text-foreground"
            >
              Title
            </label>
            <input
              id="article-title"
              type="text"
              required
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="How to upload drawings"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="article-category"
                className="text-sm font-medium text-foreground"
              >
                Category
              </label>
              <select
                id="article-category"
                value={form.category}
                onChange={(e) =>
                  updateField(
                    "category",
                    e.target.value as HelpArticleCategory,
                  )
                }
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="article-read-time"
                className="text-sm font-medium text-foreground"
              >
                Read Time (minutes)
              </label>
              <input
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
              placeholder="Short one-line summary shown in the articles list"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="article-body"
              className="text-sm font-medium text-foreground"
            >
              Body
            </label>
            <textarea
              id="article-body"
              required
              rows={6}
              value={form.body}
              onChange={(e) => updateField("body", e.target.value)}
              className="w-full resize-none rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              placeholder="Full article content"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label
                htmlFor="article-sort-order"
                className="text-sm font-medium text-foreground"
              >
                Sort Order
              </label>
              <input
                id="article-sort-order"
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) =>
                  updateField("sort_order", Number(e.target.value) || 0)
                }
                className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                id="article-is-published"
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => updateField("is_published", e.target.checked)}
                className="size-4 rounded border-border"
              />
              <label
                htmlFor="article-is-published"
                className="text-sm font-medium text-foreground"
              >
                Published
              </label>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
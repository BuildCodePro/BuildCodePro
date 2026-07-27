"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useDeleteHelpArticleMutation } from "@/services/adminSupportService";
import type { HelpArticleItem } from "@/services/adminSupportService";
import { cn } from "@/lib/utils/cn";
import { TableEmptyState } from "../ui/emptyState";

const CATEGORY_LABELS: Record<HelpArticleItem["category"], string> = {
  getting_started: "Getting Started",
  upload_drawings: "Upload Drawings",
  ai_analysis: "AI Analysis",
  team_billing: "Team & Billing",
  troubleshooting: "Troubleshooting",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface HelpArticlesTableProps {
  articles: HelpArticleItem[];
  isLoading?: boolean;
  onEdit: (articleId: string) => void;
  className?: string;
}

export function HelpArticlesTable({
  articles,
  isLoading = false,
  onEdit,
  className,
}: HelpArticlesTableProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const deleteMutation = useDeleteHelpArticleMutation();

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;

    deleteMutation.mutate(pendingDeleteId, {
      onSuccess: () => {
        setPendingDeleteId(null);
      },
    });
  };

  if (isLoading) {
    return <TableSkeleton columns={6} rows={5} className={className} />;
  }

  return (
    <div
      className={cn(
        "rounded-[16px] border border-border bg-white p-5 sm:p-6",
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Read Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-sm text-stat-label"
              >
                <TableEmptyState title="No Articles Found" />
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{article.title}</p>
                    <p className="line-clamp-1 text-xs text-stat-label">
                      {article.summary}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-stat-label">
                  {CATEGORY_LABELS[article.category]}
                </TableCell>
                <TableCell className="text-stat-label">
                  {article.read_time_minutes} min
                </TableCell>
                <TableCell>
                  {article.is_published ? (
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 font-body text-xs font-medium text-success">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 font-body text-xs font-medium text-stat-label">
                      Draft
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-stat-label">
                  {formatDate(article.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(article.id)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-9 rounded-[10px] px-3",
                      )}
                    >
                      <Pencil className="size-3.5" aria-hidden="true" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(article.id)}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-9 rounded-[10px] px-3 text-destructive hover:bg-destructive/5",
                      )}
                    >
                      <Trash2 className="size-3.5" aria-hidden="true" />
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal
        children
        isOpen={pendingDeleteId !== null}
        onClose={() => setPendingDeleteId(null)}
        title="Delete Article"
        description="This action cannot be undone. The article will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isConfirming={deleteMutation.isPending}
      />
    </div>
  );
}
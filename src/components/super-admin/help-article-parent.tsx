"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchInput } from "@/components/ui/search-input";
import { useHelpArticlesQuery } from "@/services/adminSupportService";
import type { HelpArticleCategory } from "@/services/adminSupportService";
import { cn } from "@/lib/utils/cn";

import { HelpArticleFormModal } from "./help-article-for-modal";
import { HelpArticlesTable } from "./help-article-table";
import { SuperAdminModuleHeader } from "./super-admin-module-header";

const CATEGORY_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "getting_started", label: "Getting Started" },
  { value: "upload_drawings", label: "Upload Drawings" },
  { value: "ai_analysis", label: "AI Analysis" },
  { value: "team_billing", label: "Team & Billing" },
  { value: "troubleshooting", label: "Troubleshooting" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

function useDebouncedValue<T>(value: T, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function HelpArticlesContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(
    null,
  );

  const debouncedSearch = useDebouncedValue(searchQuery);

  const articlesQuery = useHelpArticlesQuery({
    page: 1,
    page_size: 10,
    search: debouncedSearch.trim() || undefined,
    category:
      categoryFilter !== "all"
        ? (categoryFilter as HelpArticleCategory)
        : undefined,
    is_published:
      statusFilter === "all" ? undefined : statusFilter === "published",
  });

  const articles = useMemo(
    () => articlesQuery.data?.items ?? [],
    [articlesQuery.data],
  );

  const handleOpenCreate = () => {
    setEditingArticleId(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (articleId: string) => {
    setEditingArticleId(articleId);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingArticleId(null);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SuperAdminModuleHeader
          title="Help Center Articles"
          description="Create and manage help articles shown to companies in the app."
        />
        <button
          type="button"
          onClick={handleOpenCreate}
          className={cn(
            buttonVariants({ variant: "primary" }),
            "h-10 w-full gap-2 px-5 sm:w-auto",
          )}
        >
          <Plus className="size-4" aria-hidden="true" />
          Create Article
        </button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search articles..."
          wrapperClassName="w-full lg:max-w-md"
          aria-label="Search help articles"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FilterSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={CATEGORY_FILTER_OPTIONS}
            aria-label="Filter by category"
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_FILTER_OPTIONS}
            aria-label="Filter by status"
          />
        </div>
      </div>

      <HelpArticlesTable
        articles={articles}
        isLoading={articlesQuery.isLoading}
        onEdit={handleOpenEdit}
      />

      <HelpArticleFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        articleId={editingArticleId}
      />
    </div>
  );
}
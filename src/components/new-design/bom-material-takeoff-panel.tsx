"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Projector } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { TabPanel, UnderlineTabs } from "@/components/ui/underline-tabs";
import { BOM_CATEGORIES, type BomCategoryId } from "@/lib/constants/bom";
import { cn } from "@/lib/utils/cn";
import { getDynamicErrorMessage } from "@/lib/utils/error-handler";
import {
  useBomLiveUpdates,
  useBomQuery,
  useCreateBomLineMutation,
  useDeleteBomLineMutation,
  useRestoreBomLineMutation,
  useUpdateBomLineMutation,
} from "@/services/bomService";
import { useAuthStore } from "@/store/auth-store";
import type { BomLineCreatePayload, BomLineItem, BomLineUpdatePayload } from "@/types/bom";

import { BomAddLineForm } from "./bom-add-line-form";
import { BomLineHistoryCard } from "./bom-line-history-card";
import { BomReviewBoard } from "./bom-review-board";
import { TableSkeleton } from "../ui/table-skeleton";
import { TableEmptyState } from "../ui/emptyState";

const BOM_EDITOR_ROLES = new Set(["company_owner", "estimator", "super_admin"]);

interface BomMaterialTakeoffPanelProps {
  projectId?: string;
  onExportCsv?: () => void;
  onIncludeInPdf?: () => void;
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

function LiveIndicator({ status }: { status: "connecting" | "live" | "offline" }) {
  const label = status === "live" ? "Live" : status === "connecting" ? "Connecting" : "Reconnecting";
  return (
    <span className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-stat-label" data-testid="bom-live-status">
      <span className={cn("size-2 rounded-full", status === "live" ? "bg-emerald-500" : "bg-amber-400")} />
      {label}
    </span>
  );
}

export function BomMaterialTakeoffPanel({ projectId }: BomMaterialTakeoffPanelProps) {
  const [activeCategory, setActiveCategory] = useState<BomCategoryId>("all");
  const [showNeedsReviewOnly, setShowNeedsReviewOnly] = useState(false);
  const [showRemoved, setShowRemoved] = useState(false);
  const [isAddingLine, setIsAddingLine] = useState(false);
  const [historyLine, setHistoryLine] = useState<BomLineItem | null>(null);
  const historyAnchorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (historyLine) historyAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [historyLine]);
  const userRole = useAuthStore((state) => state.role);
  const canEdit = userRole ? BOM_EDITOR_ROLES.has(userRole) : false;
  const { data: bom, isLoading, isError, error } = useBomQuery(projectId, showRemoved);
  const liveStatus = useBomLiveUpdates(projectId);
  const updateLineMutation = useUpdateBomLineMutation(projectId || "");
  const createLineMutation = useCreateBomLineMutation(projectId || "");
  const deleteLineMutation = useDeleteBomLineMutation(projectId || "");
  const restoreLineMutation = useRestoreBomLineMutation(projectId || "");

  const withToast = async (action: () => Promise<unknown>, successMessage: string, failureMessage: string) => {
    try {
      await action();
      toast.success(successMessage);
    } catch (actionError) {
      toast.error(getDynamicErrorMessage(actionError, failureMessage));
      throw actionError;
    }
  };

  const handleSaveLine = (lineId: string, payload: BomLineUpdatePayload) =>
    withToast(() => updateLineMutation.mutateAsync({ lineId, payload }), "Line updated. Totals recalculated.", "Could not update this line");
  const handleDeleteLine = (lineId: string) =>
    withToast(() => deleteLineMutation.mutateAsync(lineId), "Line removed. Use Show removed to restore it.", "Could not remove this line");
  const handleRestoreLine = (lineId: string) =>
    withToast(() => restoreLineMutation.mutateAsync(lineId), "Line restored.", "Could not restore this line");
  const handleCreateLine = async (payload: BomLineCreatePayload) => {
    await withToast(() => createLineMutation.mutateAsync(payload), "Line added.", "Could not add this line");
    setIsAddingLine(false);
  };

  const allLines: BomLineItem[] = useMemo(
    () => [...(bom?.lines ?? [])].sort((first, second) => first.created_at.localeCompare(second.created_at) || first.id.localeCompare(second.id)),
    [bom],
  );
  const currency = bom?.currency ?? "USD";
  const needsReviewCount = allLines.filter((line) => !line.is_deleted && line.needs_review).length;
  const editedCount = allLines.filter((line) => line.is_manual_override && !line.is_deleted).length;
  const categoryLines = useMemo(
    () => (activeCategory === "all" ? allLines : allLines.filter((line) => line.category === activeCategory)),
    [allLines, activeCategory],
  );
  const categoryTabs = BOM_CATEGORIES.map((category) => {
    const categoryLineCount = allLines.filter((line) => !line.is_deleted && (category.id === "all" || line.category === category.id)).length;
    return { id: category.id, label: `${category.label} (${categoryLineCount})` };
  });
  const activeLineCount = allLines.filter((line) => !line.is_deleted).length;

  if (!projectId) {
    return (
      <div className="flex items-center justify-center rounded-[14px] border border-border bg-white py-16">
        <TableEmptyState title="No project selected." icon={<Projector className="h-8 w-8" />} />
      </div>
    );
  }

  if (isLoading) {
    return <TableSkeleton columns={4} rows={6} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 rounded-[14px] border border-border bg-white py-16">
        <p className="font-body text-sm font-medium text-red-600">Bill of materials not found.</p>
        <p className="font-body text-xs text-stat-label">{getDynamicErrorMessage(error, "Please try again.")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-body text-lg font-medium" data-testid="bom-total">
              Project total: {formatCurrency(bom?.total_cost ?? 0, currency)}
            </p>
            <LiveIndicator status={liveStatus} />
          </div>
          <p className="font-body text-sm text-stat-label">
            {activeLineCount.toLocaleString("en-US")} line items
            {editedCount ? ` · ${editedCount} edited` : ""}
            {bom?.total_cost_is_partial ? ` · ${bom.unpriced_line_count} without a price` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end [&>button]:h-10 [&>button]:w-auto [&>button]:shrink-0 [&>button]:px-4 [&>button]:text-sm">
          <Button
            type="button"
            variant={showNeedsReviewOnly ? "primary" : "outline"}
            onClick={() => setShowNeedsReviewOnly((current) => !current)}
            aria-pressed={showNeedsReviewOnly}
            data-testid="bom-needs-review-filter"
          >
            Needs review ({needsReviewCount})
          </Button>
          <Button type="button" variant={showRemoved ? "primary" : "outline"} onClick={() => setShowRemoved((current) => !current)} aria-pressed={showRemoved} title="Show lines you removed so you can restore them">
            {showRemoved ? "Hide removed" : "Show removed"}
          </Button>
          {canEdit ? (
            <Button type="button" onClick={() => setIsAddingLine(true)} disabled={isAddingLine} data-testid="bom-add-line">
              <Plus className="mr-1.5 size-4" /> Add line
            </Button>
          ) : null}
        </div>
      </div>

      {isAddingLine ? <BomAddLineForm onSubmit={handleCreateLine} onCancel={() => setIsAddingLine(false)} /> : null}
      <div ref={historyAnchorRef}>
        {historyLine ? <BomLineHistoryCard projectId={projectId} lineItem={historyLine} onClose={() => setHistoryLine(null)} /> : null}
      </div>

      <UnderlineTabs tabs={categoryTabs} activeTab={activeCategory} onTabChange={setActiveCategory} aria-label="BOM categories" />

      <TabPanel id={`tabpanel-bom-${activeCategory}`} labelledBy={`tab-${activeCategory}`}>
        <BomReviewBoard
          lines={categoryLines}
          currency={currency}
          canEdit={canEdit}
          showNeedsReviewOnly={showNeedsReviewOnly}
          onSaveLine={handleSaveLine}
          onDeleteLine={handleDeleteLine}
          onRestoreLine={handleRestoreLine}
          onShowHistory={setHistoryLine}
        />
      </TabPanel>
    </div>
  );
}

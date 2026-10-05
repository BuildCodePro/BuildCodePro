"use client";

import { X } from "lucide-react";

import { useBomLineHistoryQuery } from "@/services/bomService";
import type { BomLineItem } from "@/types/bom";

interface BomLineHistoryCardProps {
  projectId: string;
  lineItem: BomLineItem;
  onClose: () => void;
}

const ACTION_LABELS: Record<string, string> = {
  created: "Added",
  updated: "Changed",
  deleted: "Removed",
  restored: "Restored",
};

function describeChanges(changes: Record<string, unknown>): string {
  const described = Object.entries(changes)
    .filter(([, change]) => change && typeof change === "object" && "to" in (change as object))
    .map(([fieldName, change]) => {
      const { from, to } = change as { from: unknown; to: unknown };
      return `${fieldName.replace(/_/g, " ")}: ${from ?? "—"} → ${to ?? "—"}`;
    });
  return described.join(" · ");
}

export function BomLineHistoryCard({ projectId, lineItem, onClose }: BomLineHistoryCardProps) {
  const { data: revisions, isLoading } = useBomLineHistoryQuery(projectId, lineItem.id);
  return (
    <section className="space-y-3 rounded-[14px] border border-border bg-white p-4" aria-label="Line change history">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-body text-sm font-semibold">Change history</p>
          <p className="font-body text-xs text-stat-label">{lineItem.device_name}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded p-1 text-stat-label hover:bg-slate-100" aria-label="Close history">
          <X className="size-4" />
        </button>
      </div>
      {isLoading ? (
        <p className="font-body text-sm text-stat-label">Loading…</p>
      ) : !revisions?.length ? (
        <p className="font-body text-sm text-stat-label">No manual changes. This line is as the AI produced it.</p>
      ) : (
        <ol className="space-y-2">
          {revisions.map((revision) => (
            <li key={revision.id} className="flex flex-wrap gap-x-3 font-body text-sm">
              <span className="font-medium">{ACTION_LABELS[revision.action] ?? revision.action}</span>
              <span className="text-stat-label tabular-nums">{new Date(revision.created_at.endsWith("Z") ? revision.created_at : `${revision.created_at}Z`).toLocaleString()}</span>
              <span className="text-stat-label">{describeChanges(revision.changes as Record<string, unknown>)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

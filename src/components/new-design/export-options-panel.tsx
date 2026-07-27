"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Mail, BarChart3, FileText, Printer, Lock } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ExportFormatCard } from "@/components/ui/export-format-card";
import { ExportIncludeList } from "@/components/ui/export-include-list";
import {
  EXPORT_DOWNLOAD_LABELS,
  EXPORT_FORMAT_OPTIONS,
  EXPORT_INCLUDE_OPTIONS,
} from "@/lib/constants/exports";
import { cn } from "@/lib/utils/cn";
import type { ExportFormatId } from "@/types/new-design";

export interface ExportSectionsPayload {
  design_recommendations: boolean;
  bom: boolean;
  compliance_checklist: boolean;
  design_narrative: boolean;
  nfpa_disclaimer: boolean;
  company_branding: boolean;
}

const FORMAT_ICONS: Record<ExportFormatId, React.ReactNode> = {
  pdf: <FileText className="size-5 text-slate-500" />,
  csv: <BarChart3 className="size-5 text-slate-500" />,
  print: <Printer className="size-5 text-slate-500" />,
  email: <Mail className="size-5 text-slate-500" />,
};

// Maps include-list option ids to the plan module that gates them.
// Options not listed here are always available.
const SECTION_MODULE_MAP: Record<string, "bom_generation" | "compliance_engine"> = {
  bom: "bom_generation",
  compliance: "compliance_engine",
};

interface ExportOptionsPanelProps {
  onDownload?: (format: ExportFormatId, sections: ExportSectionsPayload) => void;
  onExportCsv?: () => void;
  onSendEmail?: () => void;
  isExporting?: boolean;
  disabled?: boolean;
  className?: string;
  // Permission props — all optional so this component still works if a
  // caller doesn't pass them (everything defaults to allowed).
  allowedSections?: ExportSectionsPayload;
  canExportPdf?: boolean;
  canExportCsv?: boolean;
  canExportEmail?: boolean;
}

export function ExportOptionsPanel({
  onDownload,
  onExportCsv,
  onSendEmail,
  isExporting = false,
  disabled = false,
  className,
  allowedSections,
  canExportPdf = true,
  canExportCsv = true,
  canExportEmail = true,
}: ExportOptionsPanelProps) {
  const formatAllowedMap: Record<ExportFormatId, boolean> = {
    pdf: canExportPdf,
    csv: canExportCsv,
    print: canExportPdf, // print reuses the pdf pipeline
    email: canExportEmail,
  };

  const firstAllowedFormat =
    (EXPORT_FORMAT_OPTIONS.find((o) => formatAllowedMap[o.id])?.id as
      | ExportFormatId
      | undefined) ?? "pdf";

  const [selectedFormat, setSelectedFormat] =
    useState<ExportFormatId>(firstAllowedFormat);

  // If the currently selected format becomes locked (e.g. plan
  // permissions loaded/changed after mount), fall back to the first
  // allowed format instead of leaving a locked one selected.
  useEffect(() => {
    if (!formatAllowedMap[selectedFormat]) {
      setSelectedFormat(firstAllowedFormat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canExportPdf, canExportCsv, canExportEmail]);

  const [includeOptions, setIncludeOptions] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        EXPORT_INCLUDE_OPTIONS.map((option) => {
          const moduleKey = SECTION_MODULE_MAP[option.id];
          const allowed = moduleKey ? isOptionAllowed(option.id) : true;
          return [option.id, allowed ? option.defaultChecked : false];
        }),
      ),
  );

  function isOptionAllowed(optionId: string): boolean {
    if (optionId === "bom") return allowedSections?.bom ?? true;
    if (optionId === "compliance") return allowedSections?.compliance_checklist ?? true;
    return true;
  }

  // Keep any locked include-option forced to unchecked, in case
  // permissions arrive/change after initial state was set.
  useEffect(() => {
    setIncludeOptions((current) => {
      const next = { ...current };
      EXPORT_INCLUDE_OPTIONS.forEach((option) => {
        if (!isOptionAllowed(option.id)) {
          next[option.id] = false;
        }
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedSections?.bom, allowedSections?.compliance_checklist]);

  const includeItems = useMemo(
    () =>
      EXPORT_INCLUDE_OPTIONS.map((option) => {
        const allowed = isOptionAllowed(option.id);
        return {
          id: option.id,
          label: option.label,
          checked: allowed ? includeOptions[option.id] ?? option.defaultChecked : false,
          disabled: !allowed,
          badge: !allowed ? "Upgrade to unlock" : undefined,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [includeOptions, allowedSections?.bom, allowedSections?.compliance_checklist],
  );

  const sections = useMemo<ExportSectionsPayload>(
    () => ({
      design_recommendations: includeOptions["design-recommendations"] ?? true,
      bom: (includeOptions.bom ?? true) && isOptionAllowed("bom"),
      compliance_checklist:
        (includeOptions.compliance ?? true) && isOptionAllowed("compliance"),
      design_narrative: includeOptions.narrative ?? true,
      nfpa_disclaimer: includeOptions["nfpa-disclaimer"] ?? false,
      company_branding: includeOptions["company-branding"] ?? false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [includeOptions, allowedSections?.bom, allowedSections?.compliance_checklist],
  );

  const handleFormatChange = (onSelectId: ExportFormatId) => {
    if (!formatAllowedMap[onSelectId]) return; // locked — no-op
    setSelectedFormat(onSelectId);
  };

  const isSelectedFormatLocked = !formatAllowedMap[selectedFormat];

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-1">
        <h3 className="text-narrative-title">Export Options</h3>
        <p className="text-stat-label">Choose what to include in your report</p>
      </div>

      <div
        className="space-y-3"
        role="radiogroup"
        aria-label="Export format"
      >
        {EXPORT_FORMAT_OPTIONS.map((option) => {
          const allowed = formatAllowedMap[option.id];

          return (
            <div key={option.id} className="relative">
              <div className={cn(!allowed && "pointer-events-none opacity-50")}>
                <ExportFormatCard
                  id={option.id}
                  title={option.title}
                  description={option.description}
                  icon={FORMAT_ICONS[option.id]}
                  isSelected={selectedFormat === option.id}
                  onSelect={handleFormatChange}
                />
              </div>
              {!allowed ? (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-body text-[11px] font-medium text-primary">
                  <Lock className="size-3" aria-hidden="true" />
                  Upgrade to unlock
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        <h4 className="text-narrative-section-title">Include in Report</h4>
        <ExportIncludeList
          items={includeItems}
          onItemChange={(id, checked) => {
            if (!isOptionAllowed(id)) return; // locked — no-op
            setIncludeOptions((current) => ({ ...current, [id]: checked }));
          }}
        />
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => onDownload?.(selectedFormat, sections)}
          disabled={disabled || isExporting || isSelectedFormatLocked}
          className={cn(
            buttonVariants({ variant: "primary" }),
            "h-11 w-full max-w-none gap-2",
            (disabled || isExporting || isSelectedFormatLocked) &&
            "pointer-events-none opacity-60",
          )}
        >
          {isSelectedFormatLocked ? (
            <Lock className="size-4" aria-hidden="true" />
          ) : (
            <Download className="size-4" aria-hidden="true" />
          )}
          {isExporting ? "Creating export..." : EXPORT_DOWNLOAD_LABELS[selectedFormat]}
        </button>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 max-w-none gap-2"
            disabled={disabled || isExporting || !canExportCsv}
            onClick={onExportCsv}
          >
            {!canExportCsv ? (
              <Lock className="size-4" aria-hidden="true" />
            ) : (
              <Download className="size-4" aria-hidden="true" />
            )}
            Export CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 max-w-none gap-2"
            disabled={disabled || isExporting || !canExportEmail}
            onClick={onSendEmail}
          >
            {!canExportEmail ? (
              <Lock className="size-4" aria-hidden="true" />
            ) : (
              <Mail className="size-4" aria-hidden="true" />
            )}
            Send via Email
          </Button>
        </div>
      </div>
    </div>
  );
}
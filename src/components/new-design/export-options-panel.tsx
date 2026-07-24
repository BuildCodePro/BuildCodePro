"use client";

import { useMemo, useState } from "react";
import { Download, Mail, BarChart3, FileText, Printer } from "lucide-react";

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

interface ExportOptionsPanelProps {
  onDownload?: (format: ExportFormatId, sections: ExportSectionsPayload) => void;
  onExportCsv?: () => void;
  onSendEmail?: () => void;
  isExporting?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ExportOptionsPanel({
  onDownload,
  onExportCsv,
  onSendEmail,
  isExporting = false,
  disabled = false,
  className,
}: ExportOptionsPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatId>("pdf");
  const [includeOptions, setIncludeOptions] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        EXPORT_INCLUDE_OPTIONS.map((option) => [
          option.id,
          option.defaultChecked,
        ]),
      ),
  );

  const includeItems = useMemo(
    () =>
      EXPORT_INCLUDE_OPTIONS.map((option) => ({
        id: option.id,
        label: option.label,
        checked: includeOptions[option.id] ?? option.defaultChecked,
      })),
    [includeOptions],
  );

  const sections = useMemo<ExportSectionsPayload>(
    () => ({
      design_recommendations: includeOptions["design-recommendations"] ?? true,
      bom: includeOptions.bom ?? true,
      compliance_checklist: includeOptions.compliance ?? true,
      design_narrative: includeOptions.narrative ?? true,
      nfpa_disclaimer: includeOptions["nfpa-disclaimer"] ?? false,
      company_branding: includeOptions["company-branding"] ?? false,
    }),
    [includeOptions],
  );

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
        {EXPORT_FORMAT_OPTIONS.map((option) => (
          <ExportFormatCard
            key={option.id}
            id={option.id}
            title={option.title}
            description={option.description}
            icon={FORMAT_ICONS[option.id]}
            isSelected={selectedFormat === option.id}
            onSelect={setSelectedFormat}
          />
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-narrative-section-title">Include in Report</h4>
        <ExportIncludeList
          items={includeItems}
          onItemChange={(id, checked) =>
            setIncludeOptions((current) => ({ ...current, [id]: checked }))
          }
        />
      </div>

      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={() => onDownload?.(selectedFormat, sections)}
          disabled={disabled || isExporting}
          className={cn(
            buttonVariants({ variant: "primary" }),
            "h-11 w-full max-w-none gap-2",
            (disabled || isExporting) && "pointer-events-none opacity-60",
          )}
        >
          <Download className="size-4" aria-hidden="true" />
          {isExporting ? "Creating export..." : EXPORT_DOWNLOAD_LABELS[selectedFormat]}
        </button>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="h-11 max-w-none gap-2"
            disabled={disabled || isExporting}
            onClick={onExportCsv}
          >
            <Download className="size-4" aria-hidden="true" />
            Export CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 max-w-none gap-2"
            disabled={disabled || isExporting}
            onClick={onSendEmail}
          >
            <Mail className="size-4" aria-hidden="true" />
            Send via Email
          </Button>
        </div>
      </div>
    </div>
  );
}

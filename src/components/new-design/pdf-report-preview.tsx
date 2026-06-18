import { AlertTriangle } from "lucide-react";

import { Logo } from "@/components/icons/logo";
import { cn } from "@/lib/utils/cn";
import { EXPORT_DISCLAIMER_TEXT } from "@/lib/constants/exports";
import type { ExportPreviewData } from "@/types/new-design";

interface PreviewRowProps {
  label: string;
  value: string;
}

function PreviewRow({ label, value }: PreviewRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-stat-label">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

interface PreviewSectionProps {
  title: string;
  children: React.ReactNode;
}

function PreviewSection({ title, children }: PreviewSectionProps) {
  return (
    <section className="space-y-2">
      <h5 className="font-body text-xs font-semibold text-foreground">{title}</h5>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

interface PdfReportPreviewProps {
  data: ExportPreviewData;
  className?: string;
}

export function PdfReportPreview({ data, className }: PdfReportPreviewProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div>
        <h3 className="text-narrative-title">PDF Report Preview</h3>
        <p className="mt-1 text-stat-label">{data.projectName}</p>
      </div>

      <div className="overflow-hidden rounded-[12px] border border-border bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 bg-sidebar px-4 py-3 text-white">
          <div className="min-w-0 space-y-1">
            <Logo height={22} className="brightness-0 invert" />
            <p className="font-body text-[10px] text-slate-400">
              Fire Alarm Design Estimate
            </p>
          </div>
          <p className="max-w-[140px] truncate text-right font-body text-[10px] font-semibold sm:max-w-none sm:text-xs">
            {data.projectName}
          </p>
        </div>

        <div className="space-y-4 p-4">
          <PreviewSection title="Project Summary">
            <PreviewRow label="Occupancy" value={data.occupancy} />
            <PreviewRow label="Address" value={data.address} />
            <PreviewRow label="Sq Ft" value={data.squareFootage} />
            <PreviewRow label="Floors" value={data.floors} />
          </PreviewSection>

          <PreviewSection title="Design Recommendations">
            <PreviewRow
              label="Initiating Devices"
              value={`${data.initiatingDevices} recommended`}
            />
            <PreviewRow
              label="Notification"
              value={`${data.notificationDevices} recommended`}
            />
            <PreviewRow
              label="Control"
              value={`${data.controlDevices} recommended`}
            />
          </PreviewSection>

          <PreviewSection title="Bill of Materials Summary">
            <PreviewRow label="Total Items" value={data.totalItems} />
            <PreviewRow label="Est. Cable" value={data.estimatedCable} />
            <PreviewRow label="Est. Conduit" value={data.estimatedConduit} />
          </PreviewSection>

          <PreviewSection title="Compliance Status">
            <PreviewRow
              label="NFPA 72 Score"
              value={`${data.complianceScore} — ${data.complianceStatus}`}
            />
            <PreviewRow
              label="Flagged Items"
              value={`${data.flaggedItems} for review`}
            />
          </PreviewSection>
        </div>

        <div className="mx-4 mb-4 flex items-start gap-2 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2">
          <AlertTriangle
            className="mt-0.5 size-3.5 shrink-0 text-warning"
            aria-hidden="true"
          />
          <p className="font-body text-[10px] leading-relaxed text-amber-700">
            {EXPORT_DISCLAIMER_TEXT}
          </p>
        </div>
      </div>
    </div>
  );
}

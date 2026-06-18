import { buildExportPreviewData } from "@/lib/constants/exports";
import type { DesignResults, ProjectInfoFormData } from "@/types/new-design";

import { ExportOptionsPanel } from "./export-options-panel";
import { PdfReportPreview } from "./pdf-report-preview";

interface ExportsPanelProps {
  projectInfo: ProjectInfoFormData;
  results?: DesignResults;
}

export function ExportsPanel({ projectInfo, results }: ExportsPanelProps) {
  const previewData = buildExportPreviewData(projectInfo, results);

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
      <PdfReportPreview data={previewData} />
      <ExportOptionsPanel />
    </div>
  );
}

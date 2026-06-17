"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { RegenerateButton } from "@/components/ui/regenerate-button";
import {
  buildDesignNarrative,
  formatNarrativeSubtitle,
} from "@/lib/constants/narrative";
import { getProjectDisplayName } from "@/lib/constants/results";
import type { DesignNarrative, ProjectInfoFormData } from "@/types/new-design";

import { NarrativeExportToggle } from "./narrative-export-toggle";
import { NarrativeSection } from "./narrative-section";

interface DesignNarrativePanelProps {
  projectInfo: ProjectInfoFormData;
  narrative?: DesignNarrative;
  generatedAt?: string;
  onEdit?: () => void;
  onRegenerate?: () => void;
}

export function DesignNarrativePanel({
  projectInfo,
  narrative: initialNarrative,
  generatedAt,
  onEdit,
  onRegenerate,
}: DesignNarrativePanelProps) {
  const [narrative, setNarrative] = useState<DesignNarrative>(
    initialNarrative ?? buildDesignNarrative(projectInfo),
  );

  const projectName = getProjectDisplayName(projectInfo);
  const subtitle = formatNarrativeSubtitle(projectName, generatedAt);

  const handleRegenerate = () => {
    setNarrative(buildDesignNarrative(projectInfo));
    onRegenerate?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-narrative-title">AI-Generated Design Narrative</h3>
          <p className="text-stat-label">{subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-9 max-w-none rounded-lg px-4 font-body text-sm font-semibold"
            onClick={onEdit}
          >
            Edit
          </Button>
          <RegenerateButton onClick={handleRegenerate} />
        </div>
      </div>

      <div className="space-y-6">
        {narrative.sections.map((section) => (
          <NarrativeSection key={section.id} section={section} />
        ))}
      </div>

      <NarrativeExportToggle
        checked={narrative.includeInExport}
        onCheckedChange={(includeInExport) =>
          setNarrative((current) => ({ ...current, includeInExport }))
        }
      />
    </div>
  );
}

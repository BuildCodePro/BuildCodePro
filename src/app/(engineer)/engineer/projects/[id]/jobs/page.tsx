"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JobsHistoryPanel } from "@/components/new-design";
import { routes } from "@/config/routes";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProjectJobsPage({ params }: Props) {
  const { id } = use(params);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-3">
        <Link
          href={`/engineer/projects/${id}`}
          className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Project Details
        </Link>
        <div className="space-y-1">
          <h2 className="text-section-title">Project Jobs History</h2>
          <p className="font-body text-sm text-stat-label">
            View all previous analysis runs for this project.
          </p>
        </div>
      </div>
      
      <JobsHistoryPanel projectId={id} />
    </div>
  );
}

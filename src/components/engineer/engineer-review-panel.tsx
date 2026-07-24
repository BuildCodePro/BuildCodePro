"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, FileCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ENGINEER_REVIEW_STATUS_LABELS } from "@/lib/constants/engineer";
import { cn } from "@/lib/utils/cn";
import {
  useMarkProjectPermitReadyMutation,
  useProjectReviewQuery,
  useSubmitProjectReviewDecisionMutation,
  useUpdateEngineerNotesMutation,
  useUpdatePermitChecklistMutation,
  type ProjectReviewResponse,
} from "@/services/projectReviewService";
import type {
  EngineerReviewRecord,
  EngineerReviewStatus,
  PermitChecklistItem,
} from "@/types/engineer";

const statusStyles: Record<EngineerReviewStatus, string> = {
  "pending-review": "bg-amber-50 text-amber-700",
  "changes-requested": "bg-red-50 text-primary",
  approved: "bg-emerald-50 text-emerald-700",
  "permit-ready": "bg-violet-50 text-violet-700",
};

function mapReviewStatus(status?: string): EngineerReviewStatus {
  if (status === "approved") return "approved";
  if (status === "permit_ready" || status === "permit-ready") return "permit-ready";
  if (status === "changes_requested" || status === "changes-requested" || status === "rejected") {
    return "changes-requested";
  }
  return "pending-review";
}

function formatReviewDate(value?: string | null): string {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapApiReviewToRecord(data: ProjectReviewResponse): EngineerReviewRecord {
  return {
    projectId: data.project_id,
    status: mapReviewStatus(data.engineer_review_status),
    reviewedBy: data.reviewed_by?.name ?? "",
    reviewedAt: formatReviewDate(data.reviewed_at),
    engineerNotes: data.engineer_notes ?? "",
    permitChecklist: data.permit_checklist.map((item) => ({
      id: item.id,
      label: item.label,
      completed: item.checked,
    })),
  };
}

interface EngineerReviewPanelProps {
  review: EngineerReviewRecord;
  className?: string;
}

export function EngineerReviewPanel({
  review: initialReview,
  className,
}: EngineerReviewPanelProps) {
  const [review, setReview] = useState(initialReview);
  const [notes, setNotes] = useState(initialReview.engineerNotes);
  const [checklist, setChecklist] = useState(initialReview.permitChecklist);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectId = initialReview.projectId;
  const reviewQuery = useProjectReviewQuery(projectId);
  const submitDecisionMutation = useSubmitProjectReviewDecisionMutation(projectId);
  const updateNotesMutation = useUpdateEngineerNotesMutation(projectId);
  const updateChecklistMutation = useUpdatePermitChecklistMutation(projectId);
  const markPermitReadyMutation = useMarkProjectPermitReadyMutation(projectId);

  useEffect(() => {
    if (!reviewQuery.data) return;

    const apiReview = mapApiReviewToRecord(reviewQuery.data);
    setReview(apiReview);
    setNotes(apiReview.engineerNotes);
    setChecklist(apiReview.permitChecklist);
  }, [reviewQuery.data]);

  const handleChecklistToggle = (id: string, checked: boolean) => {
    const nextChecklist = checklist.map((item) =>
        item.id === id ? { ...item, completed: checked } : item,
    );
    setChecklist(nextChecklist);

    updateChecklistMutation.mutate(
      {
        items: nextChecklist.map((item) => ({
          id: item.id,
          label: item.label,
          checked: item.completed,
        })),
      },
      {
        onError: () => toast.error("Failed to update permit checklist."),
      },
    );
  };

  const handleNotesBlur = () => {
    if (notes === review.engineerNotes) return;

    updateNotesMutation.mutate(
      { notes },
      {
        onSuccess: (data) => {
          const apiReview = mapApiReviewToRecord(data);
          setReview(apiReview);
          setNotes(apiReview.engineerNotes);
          setChecklist(apiReview.permitChecklist);
        },
        onError: () => toast.error("Failed to update engineer notes."),
      },
    );
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const data = await submitDecisionMutation.mutateAsync({ action: "approve", notes });
      const apiReview = mapApiReviewToRecord(data);
      setReview(apiReview);
      setNotes(apiReview.engineerNotes);
      setChecklist(apiReview.permitChecklist);
      toast.success("Design approved successfully.");
    } catch {
      toast.error("Failed to approve design.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChanges = async () => {
    setIsSubmitting(true);
    try {
      const data = await submitDecisionMutation.mutateAsync({ action: "request_changes", notes });
      const apiReview = mapApiReviewToRecord(data);
      setReview(apiReview);
      setNotes(apiReview.engineerNotes);
      setChecklist(apiReview.permitChecklist);
      toast.success("Changes requested successfully.");
    } catch {
      toast.error("Failed to request changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkPermitReady = async () => {
    setIsSubmitting(true);
    try {
      const data = await markPermitReadyMutation.mutateAsync();
      const apiReview = mapApiReviewToRecord(data);
      setReview(apiReview);
      setNotes(apiReview.engineerNotes);
      setChecklist(apiReview.permitChecklist);
      toast.success("Project marked permit-ready.");
    } catch {
      toast.error("Failed to mark permit-ready.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allChecklistComplete = checklist.every((item) => item.completed);
  const isBusy = isSubmitting || reviewQuery.isLoading;

  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-body text-sm font-medium text-stat-label">
                Engineer Review Status
              </p>
              <span
                className={cn(
                  "inline-flex rounded-full px-3 py-1 font-body text-xs font-semibold",
                  statusStyles[review.status],
                )}
              >
                {ENGINEER_REVIEW_STATUS_LABELS[review.status]}
              </span>
              {review.reviewedBy ? (
                <p className="font-body text-xs text-stat-label">
                  {review.reviewedBy} &bull; {review.reviewedAt}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                disabled={isBusy || !reviewQuery.data?.can_request_changes}
                onClick={handleRequestChanges}
                className="gap-2"
              >
                <RotateCcw className="size-4" />
                Request Changes
              </Button>
              <Button
                type="button"
                disabled={isBusy || !reviewQuery.data?.can_approve}
                onClick={handleApprove}
                className="gap-2"
              >
                <CheckCircle2 className="size-4" />
                Approve Design
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="engineer-notes">Engineer Notes</Label>
            <Textarea
              id="engineer-notes"
              placeholder="Document review findings, spacing exceptions, or approval conditions..."
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              onBlur={handleNotesBlur}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 sm:p-6">
          <CardHeader className="mb-4">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="size-5 text-primary" />
              Permit Submission Checklist
            </CardTitle>
            <CardDescription>
              Verify all items before marking the project permit-ready for AHJ
              submission
            </CardDescription>
          </CardHeader>

          <ul className="space-y-3">
            {checklist.map((item: PermitChecklistItem) => (
              <li key={item.id} className="flex items-center gap-3">
                <Checkbox
                  id={`permit-${item.id}`}
                  checked={item.completed}
                  disabled={isBusy}
                  onChange={(event) =>
                    handleChecklistToggle(item.id, event.target.checked)
                  }
                />
                <Label
                  htmlFor={`permit-${item.id}`}
                  className="cursor-pointer font-body text-sm font-normal"
                >
                  {item.label}
                </Label>
              </li>
            ))}
          </ul>

          {review.status === "approved" || allChecklistComplete ? (
            <Button
              type="button"
              disabled={isBusy || review.status === "permit-ready" || !reviewQuery.data?.can_mark_permit_ready}
              onClick={handleMarkPermitReady}
              className="mt-4 gap-2"
            >
              <FileCheck className="size-4" />
              {review.status === "permit-ready"
                ? "Permit Package Ready"
                : "Mark Permit Ready"}
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <AlertBanner
        title="Licensed engineer review required"
        description="AI-generated designs require review and approval by a licensed Professional Engineer before permit submission. This platform does not replace licensed engineering review."
      />
    </div>
  );
}

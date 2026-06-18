"use client";

import { useState } from "react";
import { CheckCircle2, FileCheck, RotateCcw } from "lucide-react";

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

  const handleChecklistToggle = (id: string, checked: boolean) => {
    setChecklist((current) =>
      current.map((item) =>
        item.id === id ? { ...item, completed: checked } : item,
      ),
    );
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setReview((current) => ({
      ...current,
      status: "approved",
      reviewedBy: "Mike Rodriguez, PE",
      reviewedAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      engineerNotes: notes,
    }));
    setIsSubmitting(false);
  };

  const handleRequestChanges = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setReview((current) => ({
      ...current,
      status: "changes-requested",
      reviewedBy: "Mike Rodriguez, PE",
      reviewedAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      engineerNotes: notes,
    }));
    setIsSubmitting(false);
  };

  const handleMarkPermitReady = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setChecklist((current) =>
      current.map((item) => ({ ...item, completed: true })),
    );
    setReview((current) => ({
      ...current,
      status: "permit-ready",
      reviewedBy: "Mike Rodriguez, PE",
      reviewedAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      engineerNotes: notes,
    }));
    setIsSubmitting(false);
  };

  const allChecklistComplete = checklist.every((item) => item.completed);

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
                disabled={isSubmitting}
                onClick={handleRequestChanges}
                className="gap-2"
              >
                <RotateCcw className="size-4" />
                Request Changes
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
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
              disabled={isSubmitting || review.status === "permit-ready"}
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

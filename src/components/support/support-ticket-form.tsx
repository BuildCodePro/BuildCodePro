"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SUPPORT_TICKET_CATEGORIES } from "@/lib/constants/support";
import {
  useCreateSupportTicketMutation,
  type TicketCategory,
} from "@/services/supportService";

interface TicketFormData {
  subject: string;
  category: TicketCategory;
  description: string;
}

const INITIAL_FORM: TicketFormData = {
  subject: "",
  category: "technical",
  description: "",
};

const CATEGORY_VALUES = SUPPORT_TICKET_CATEGORIES.map(
  (option) => option.value
) as [TicketCategory, ...TicketCategory[]];

const ticketFormSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .min(5, "Subject must be at least 5 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(20, "Description must be at least 20 characters"),
});

type TicketFormErrors = Partial<Record<keyof TicketFormData, string>>;

export function SupportTicketForm() {
  const [formData, setFormData] = useState<TicketFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<TicketFormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createTicketMutation = useCreateSupportTicketMutation();

  const validate = (data: TicketFormData): boolean => {
    const result = ticketFormSchema.safeParse(data);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: TicketFormErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof TicketFormData;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    setErrors(fieldErrors);
    return false;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(false);

    if (!validate(formData)) {
      return;
    }

    try {
      await createTicketMutation.mutateAsync({
        subject: formData.subject.trim(),
        category: formData.category,
        description: formData.description.trim(),
      });
      setIsSubmitted(true);
      setFormData(INITIAL_FORM);
      setErrors({});
    } catch {
      // error surfaced below via createTicketMutation.isError
    }
  };

  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <CardHeader className="mb-6">
          <CardTitle>Submit a Support Ticket</CardTitle>
          <CardDescription>
            Describe your issue and our team will follow up within 24 hours
          </CardDescription>
        </CardHeader>

        {isSubmitted ? (
          <p className="font-body text-sm text-success" role="status">
            Your ticket has been submitted. We&apos;ll respond via email shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <FormField
                label="Subject"
                name="subject"
                placeholder="Brief summary of your issue"
                value={formData.subject}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    subject: event.target.value,
                  }))
                }
                required
              />
              {errors.subject ? (
                <p className="font-body text-sm text-red-600" role="alert">
                  {errors.subject}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <SelectField
                label="Category"
                name="category"
                value={formData.category}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value as TicketCategory,
                  }))
                }
                options={SUPPORT_TICKET_CATEGORIES.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
              />
              {errors.category ? (
                <p className="font-body text-sm text-destructive" role="alert">
                  {errors.category}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticket-description">Description</Label>
              <Textarea
                id="ticket-description"
                name="description"
                placeholder="Provide details about your issue... (min 20 characters)"
                rows={4}
                value={formData.description}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                required
              />
              {errors.description ? (
                <p className="font-body text-sm text-red-600" role="alert">
                  {errors.description}
                </p>
              ) : null}
            </div>

            {createTicketMutation.isError ? (
              <p className="font-body text-sm text-destructive" role="alert">
                Something went wrong submitting your ticket. Please try again.
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={createTicketMutation.isPending}
              className="h-11"
            >
              {createTicketMutation.isPending
                ? "Submitting..."
                : "Submit Ticket"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
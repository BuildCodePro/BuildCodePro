"use client";

import { useState } from "react";

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
import type { SupportTicketCategory } from "@/lib/constants/support";

interface TicketFormData {
  subject: string;
  category: SupportTicketCategory;
  description: string;
}

const INITIAL_FORM: TicketFormData = {
  subject: "",
  category: "technical",
  description: "",
};

export function SupportTicketForm() {
  const [formData, setFormData] = useState<TicketFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData(INITIAL_FORM);
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

            <SelectField
              label="Category"
              name="category"
              value={formData.category}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  category: value as SupportTicketCategory,
                }))
              }
              options={SUPPORT_TICKET_CATEGORIES.map((option) => ({
                value: option.value,
                label: option.label,
              }))}
            />

            <div className="space-y-2">
              <Label htmlFor="ticket-description">Description</Label>
              <Textarea
                id="ticket-description"
                name="description"
                placeholder="Provide details about your issue..."
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
            </div>

            <Button type="submit" disabled={isSubmitting} className="h-11">
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

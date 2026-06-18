"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select";
import { INVITE_ROLE_OPTIONS } from "@/lib/constants/team";
import type { InviteTeamMemberFormData } from "@/types/team";
import type { PlatformUserRole } from "@/types/super-admin";

const INITIAL_FORM: InviteTeamMemberFormData = {
  fullName: "",
  email: "",
  role: "estimator",
};

interface InviteUserFormProps {
  onInvite: (data: InviteTeamMemberFormData) => void;
}

export function InviteUserForm({ onInvite }: InviteUserFormProps) {
  const [formData, setFormData] = useState<InviteTeamMemberFormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    onInvite(formData);
    setFormData(INITIAL_FORM);
    setSuccessMessage(
      `Invitation sent to ${formData.email}. They will receive an email to join your team.`,
    );
    setIsSubmitting(false);
  };

  const selectedRole = INVITE_ROLE_OPTIONS.find(
    (option) => option.value === formData.role,
  );

  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <CardHeader className="mb-6">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" />
            Invite Team Member
          </CardTitle>
          <CardDescription>
            Invite estimators and engineers to collaborate on your company
            account
          </CardDescription>
        </CardHeader>

        {successMessage ? (
          <p className="mb-4 font-body text-sm text-success" role="status">
            {successMessage}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Full Name"
              name="fullName"
              placeholder="e.g. Jane Smith"
              value={formData.fullName}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  fullName: event.target.value,
                }))
              }
              required
            />
            <FormField
              label="Email Address"
              name="email"
              type="email"
              placeholder="colleague@acmefire.com"
              value={formData.email}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              required
            />
          </div>

          <SelectField
            label="Role"
            name="role"
            value={formData.role}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                role: value as PlatformUserRole,
              }))
            }
            options={INVITE_ROLE_OPTIONS.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />

          {selectedRole ? (
            <p className="font-body text-sm text-stat-label">
              {selectedRole.description}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting} className="h-11 gap-2">
            <UserPlus className="size-4" />
            {isSubmitting ? "Sending Invite..." : "Send Invitation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

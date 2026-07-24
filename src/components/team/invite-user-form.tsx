"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select";
import { INVITE_ROLE_OPTIONS } from "@/lib/constants/team";
import type { InviteTeamMemberFormData } from "@/types/team";
import type { PlatformUserRole } from "@/types/super-admin";

const INITIAL_FORM: InviteTeamMemberFormData = {
  // fullName: "",
  email: "",
  role: "estimator",
};

interface InviteUserFormProps {
  onInvite: (data: InviteTeamMemberFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function InviteUserForm({ onInvite, isSubmitting = false }: InviteUserFormProps) {
  const [formData, setFormData] = useState<InviteTeamMemberFormData>(INITIAL_FORM);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);

    try {
      await onInvite(formData);
      setFormData(INITIAL_FORM);
      setSuccessMessage(
        `Invitation sent to ${formData.email}. They will receive an email to join your team.`,
      );
    } catch (error) {
      // Error is handled by the parent
    }
  };

  const selectedRole = INVITE_ROLE_OPTIONS.find(
    (option) => option.value === formData.role,
  );

  return (
    <div className="space-y-6">
      {successMessage ? (
        <p className="font-body text-sm text-success" role="status">
          {successMessage}
        </p>
      ) : null}

      <form id="invite-user-form" onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 ">
          
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
      </form>
    </div>
  );
}

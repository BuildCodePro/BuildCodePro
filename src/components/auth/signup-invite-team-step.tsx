"use client";

import { useState } from "react";
import { Trash2, UserPlus } from "lucide-react";

import { UserRoleBadge } from "@/components/ui/user-role-badge";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select";
import { SIGNUP_INVITE_ROLE_OPTIONS } from "@/lib/constants/team";
import { validateSignupTeamInvite } from "@/lib/validations/auth";
import { cn } from "@/lib/utils/cn";
import type { SignupTeamInvite, SignupTeamInviteFormData } from "@/types/team";
import type { PlatformUserRole } from "@/types/super-admin";

const INITIAL_INVITE: SignupTeamInviteFormData = {
  fullName: "",
  email: "",
  role: "estimator",
  password: "",
  confirmPassword: "",
};

interface SignupInviteTeamStepProps {
  invites: SignupTeamInvite[];
  onAddInvite: (invite: SignupTeamInvite) => void;
  onRemoveInvite: (id: string) => void;
  onBack: () => void;
  onComplete: () => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

export function SignupInviteTeamStep({
  invites,
  onAddInvite,
  onRemoveInvite,
  onBack,
  onComplete,
  onSkip,
  isSubmitting,
}: SignupInviteTeamStepProps) {
  const [formData, setFormData] =
    useState<SignupTeamInviteFormData>(INITIAL_INVITE);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupTeamInviteFormData, string>>
  >({});

  const selectedRole = SIGNUP_INVITE_ROLE_OPTIONS.find(
    (option) => option.value === formData.role,
  );

  const handleAddMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const existingEmails = invites.map((invite) => invite.email);
    const validation = validateSignupTeamInvite(formData, existingEmails);
    setErrors(validation.errors);

    if (!validation.success) {
      return;
    }

    onAddInvite({
      ...formData,
      id: `invite-${Date.now()}`,
    });
    setFormData(INITIAL_INVITE);
    setErrors({});
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {invites.length > 0 ? (
        <div className="rounded-[12px] border border-border bg-surface p-4">
          <p className="mb-3 font-body text-sm font-medium text-foreground">
            Team members added ({invites.length})
          </p>
          <ul className="space-y-2">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="flex items-center justify-between gap-3 rounded-[10px] border border-border bg-white px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate font-body text-sm font-medium text-foreground">
                    {invite.fullName}
                  </p>
                  <p className="truncate font-body text-xs text-stat-label">
                    {invite.email}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <UserRoleBadge role={invite.role} />
                  <button
                    type="button"
                    onClick={() => onRemoveInvite(invite.id)}
                    className="inline-flex size-8 items-center justify-center rounded-[8px] border border-border text-stat-label transition-colors hover:bg-slate-50 hover:text-primary"
                    aria-label={`Remove ${invite.fullName}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form onSubmit={handleAddMember} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Full Name"
            name="inviteFullName"
            placeholder="e.g. Sarah Chen"
            value={formData.fullName}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                fullName: event.target.value,
              }))
            }
            error={errors.fullName}
            required
          />
          <FormField
            label="Email Address"
            name="inviteEmail"
            type="email"
            placeholder="colleague@company.com"
            value={formData.email}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, email: event.target.value }))
            }
            error={errors.email}
            required
          />
        </div>

        <SelectField
          label="Role"
          name="inviteRole"
          value={formData.role}
          onChange={(value) =>
            setFormData((prev) => ({
              ...prev,
              role: value as PlatformUserRole,
            }))
          }
          options={SIGNUP_INVITE_ROLE_OPTIONS.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
        />

        {selectedRole ? (
          <p className="font-body text-sm text-stat-label">
            {selectedRole.description}
          </p>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Login Password"
            name="invitePassword"
            type="password"
            autoComplete="new-password"
            placeholder="Set their password"
            value={formData.password}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            error={errors.password}
            required
          />
          <FormField
            label="Confirm Password"
            name="inviteConfirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: event.target.value,
              }))
            }
            error={errors.confirmPassword}
            required
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          className={cn("h-11 w-full max-w-none gap-2 sm:w-auto")}
        >
          <UserPlus className="size-4" />
          Add Team Member
        </Button>
      </form>

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 max-w-none"
        >
          Back
        </Button>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={onSkip}
            disabled={isSubmitting}
            className="h-11 max-w-none"
          >
            Skip for Now
          </Button>
          <Button
            type="button"
            onClick={onComplete}
            disabled={isSubmitting}
            className="h-11 max-w-none"
          >
            {isSubmitting ? "Creating account..." : "Complete Setup"}
          </Button>
        </div>
      </div>
    </div>
  );
}

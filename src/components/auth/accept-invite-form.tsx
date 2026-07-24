"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthStatusMessage } from "@/components/auth/auth-status-message";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { getDashboardPathForRole } from "@/lib/auth/session";
import type { AcceptInviteFormData } from "@/types/auth";
import { useAcceptInviteMutation } from "@/services/inviteService";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { PasswordField } from "../ui";

export function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [formData, setFormData] = useState<AcceptInviteFormData>({
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AcceptInviteFormData, string>>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { mutate: acceptInvite, isPending: isSubmitting } = useAcceptInviteMutation();

  const validateForm = (data: AcceptInviteFormData) => {
    const newErrors: Partial<Record<keyof AcceptInviteFormData, string>> = {};

    // Inline simple password validation
    if (!data.password) newErrors.password = "Password is required";
    else if (data.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (!data.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (data.password !== data.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    return { success: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setAuthError(null);

    const validation = validateForm(formData);
    setErrors(validation.errors);

    if (!validation.success) {
      return;
    }

    if (!token) {
      setAuthError("Missing or invalid invite token. Please contact your administrator.");
      return;
    }

    acceptInvite(
      { token, password: formData.password },
      {
        onSuccess: (response) => {
          const role = response.role ?? response.data?.role ?? useAuthStore.getState().role;

          setIsComplete(true);
          toast.success("Invite Accepted Successfully");

          if (role) {
            router.replace(getDashboardPathForRole(role));
            return;
          }

          router.replace(routes.login);
        },
        onError: (error: any) => {
          const message =
            error instanceof Error
              ? error.message
              : error.data.message;
          setAuthError(message);
          toast.error(message)
        },
      }
    );
  };

  if (isComplete) {
    return (
      <AuthFormShell>
        <AuthStatusMessage
          title="Welcome to BuildCode Pro!"
          subtitle="You have successfully accepted the invite. Redirecting you to your dashboard..."
        >
          <Button type="button" onClick={() => router.push(routes.dashboard)}>
            Go to dashboard
          </Button>
        </AuthStatusMessage>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell>
      <AuthHeader
        title="Accept Invitation"
        subtitle="Set up your profile and password to join your team"
      />

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-5"
        noValidate
      >
        {/* <FormField
          label="Full Name"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          error={errors.fullName}
          required
        /> */}

        <PasswordField
          label="Create Password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a new password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          error={errors.password}
          required
        />

        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          error={errors.confirmPassword}
          required
        />

        {authError ? (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {authError}
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={isSubmitting || !formData.password || !formData.confirmPassword}
          className="mt-1"
        >
          {isSubmitting ? "Setting up account..." : "Accept Invite & Join"}
        </Button>
      </form>
    </AuthFormShell>
  );
}

"use client";

import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { ToggleCard } from "@/components/ui/toggle-card";
import {
  ACTIVE_SESSIONS,
  type ChangePasswordFormData,
} from "@/lib/constants/settings";
import { validateChangePasswordForm } from "@/lib/validations/settings";
import { cn } from "@/lib/utils/cn";

export function SecuritySettingsPanel() {
  const [passwordForm, setPasswordForm] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof ChangePasswordFormData, string>>
  >({});
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState(ACTIVE_SESSIONS);

  const handlePasswordChange = (
    field: keyof ChangePasswordFormData,
    value: string,
  ) => {
    setPasswordForm((current) => ({ ...current, [field]: value }));
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validation = validateChangePasswordForm(passwordForm);
    setPasswordErrors(validation.errors);

    if (!validation.success) {
      return;
    }

    setIsUpdatingPassword(true);

    // API integration will be wired later
    await new Promise((resolve) => setTimeout(resolve, 600));

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setIsUpdatingPassword(false);
  };

  const handleSignOutSession = (sessionId: string) => {
    setSessions((current) =>
      current.filter((session) => session.id !== sessionId),
    );
  };

  return (
    <Card>
      <CardContent className="space-y-8 p-5 sm:p-6">
        <section>
          <CardHeader className="mb-6">
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>

          <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
            <FormField
              label="Current Password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                handlePasswordChange("currentPassword", event.target.value)
              }
              error={passwordErrors.currentPassword}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="New Password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  handlePasswordChange("newPassword", event.target.value)
                }
                error={passwordErrors.newPassword}
              />
              <FormField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={passwordForm.confirmPassword}
                onChange={(event) =>
                  handlePasswordChange("confirmPassword", event.target.value)
                }
                error={passwordErrors.confirmPassword}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isUpdatingPassword}
                className="h-11 max-w-none px-8"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </section>

        <section className="border-t border-border pt-8">
          <CardHeader className="mb-4">
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>

          <ToggleCard
            label="Enable two-factor authentication"
            description="Require a verification code from your authenticator app when signing in."
            checked={twoFactorEnabled}
            onCheckedChange={setTwoFactorEnabled}
          />
        </section>

        <section className="border-t border-border pt-8">
          <CardHeader className="mb-4">
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Manage devices currently signed in to your account
            </CardDescription>
          </CardHeader>

          <ul className="space-y-3">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex flex-col gap-3 rounded-[12px] border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">
                    {session.device}
                    {session.isCurrent ? (
                      <span className="ml-2 font-normal text-success">
                        (This device)
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 font-body text-xs text-stat-label">
                    {session.location} &bull; {session.lastActive}
                  </p>
                </div>

                {!session.isCurrent ? (
                  <button
                    type="button"
                    onClick={() => handleSignOutSession(session.id)}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 w-full max-w-none rounded-[10px] px-4 sm:w-auto",
                    )}
                  >
                    Sign Out
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}

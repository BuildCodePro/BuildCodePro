"use client";

import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { useAuthStore } from "@/store/auth-store";
import { useMeQuery } from "@/services/authService";
import {
  useRequestEmailChangeMutation,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/services/useProfileService";

import { LogoUploadField } from "./logo-upload-field";

interface ProfileFormData {
  fullName: string;
  companyName: string;
  email: string;
}

// Reads the company name off any shape we might have stored/received —
// nested `company.name` (from /auth/me, MeResponse) or a flat
// `companyName` / `company_name` (in case some flow ever stores it flat).
function getCompanyName(source: unknown): string {
  if (!source || typeof source !== "object") return "";
  const s = source as Record<string, any>;
  return s.company?.name ?? s.companyName ?? s.company_name ?? "";
}

function getAvatarUrl(source: unknown): string | undefined {
  if (!source || typeof source !== "object") return undefined;
  const s = source as Record<string, any>;
  return s.avatar_url ?? s.avatarUrl ?? undefined;
}

export function ProfileSettingsForm() {
  const { user } = useAuthStore();
  const { data: me, isLoading: isMeLoading } = useMeQuery();

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    companyName: "",
    email: "",
  });

  const [isEmailChangeOpen, setIsEmailChangeOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailChangeMessage, setEmailChangeMessage] = useState<string | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfileMutation = useUpdateProfileMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const requestEmailChangeMutation = useRequestEmailChangeMutation();

  // Prefill the form from whichever source has data, and never let a
  // source that's missing a field (e.g. `me` still loading, or a stale
  // `user` that doesn't carry companyName) blank out a value we already
  // have. We merge field-by-field instead of replacing the whole object.
  useEffect(() => {
    const nextFullName = me?.name || user?.name || "";
    const nextCompanyName = getCompanyName(me) || getCompanyName(user);
    const nextEmail = me?.email || user?.email || "";

    setFormData((current) => ({
      fullName: nextFullName || current.fullName,
      companyName: nextCompanyName || current.companyName,
      email: nextEmail || current.email,
    }));
  }, [me, user]);

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProfileMutation.mutate({ full_name: formData.fullName });
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    uploadAvatarMutation.mutate(file);

    // reset input so the same file can be re-selected later if needed
    event.target.value = "";
  };

  const handleRequestEmailChange = () => {
    if (!newEmail.trim()) return;

    setEmailChangeMessage(null);
    requestEmailChangeMutation.mutate(
      { new_email: newEmail.trim() },
      {
        onSuccess: (res) => {
          setEmailChangeMessage(
            res?.message ?? "Verification email sent. Please check your inbox.",
          );
        },
        onError: () => {
          setEmailChangeMessage("Failed to request email change. Please try again.");
        },
      },
    );
  };

  const isSaving = updateProfileMutation.isPending;

  // Avatar priority: freshly uploaded (this session) > /auth/me response
  // > whatever is persisted in the store from a previous session.
  const currentAvatarUrl =
    uploadAvatarMutation.data?.avatar_url ??
    getAvatarUrl(me) ??
    getAvatarUrl(user);

  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <CardHeader className="mb-6">
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal and company details
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar
              name={formData.fullName || "User"}
              src={currentAvatarUrl}
              className="size-16 text-lg"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelected}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleChangePhotoClick}
              disabled={uploadAvatarMutation.isPending}
              className="h-10 max-w-none px-5"
            >
              {uploadAvatarMutation.isPending ? "Uploading..." : "Change Photo"}
            </Button>
            {uploadAvatarMutation.isError ? (
              <p className="w-full font-body text-xs text-red-500">
                Couldn&apos;t upload photo. Please try again.
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
              disabled={isMeLoading}
            />
            <FormField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={() => undefined}
              disabled
            />

            <div className="space-y-1.5 md:col-span-2">
              <FormField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={() => undefined}
                disabled
              />
              {!isEmailChangeOpen ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEmailChangeOpen(true);
                    setNewEmail("");
                    setEmailChangeMessage(null);
                  }}
                  className="font-body text-xs text-primary hover:underline cursor-pointer"
                >
                  Change Email
                </button>
              ) : (
                <div className="space-y-2 rounded-md border border-border p-3">
                  <label
                    htmlFor="new-email"
                    className="font-body text-xs font-medium text-foreground"
                  >
                    New Email Address
                  </label>
                  <input
                    id="new-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="new-email@example.com"
                    className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleRequestEmailChange}
                      disabled={
                        requestEmailChangeMutation.isPending || !newEmail.trim()
                      }
                      className="h-9 max-w-none px-4"
                    >
                      {requestEmailChangeMutation.isPending
                        ? "Sending..."
                        : "Send Verification"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEmailChangeOpen(false)}
                      className="h-9 max-w-none px-4"
                    >
                      Cancel
                    </Button>
                  </div>
                  {emailChangeMessage ? (
                    <p className="font-body text-xs text-stat-label">
                      {emailChangeMessage}
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* <LogoUploadField className="" /> */}

          {updateProfileMutation.isError && (
            <p className="text-sm text-red-500">
              Couldn&apos;t save changes. Please try again.
            </p>
          )}
          {updateProfileMutation.isSuccess && (
            <p className="text-sm text-success">
              Profile updated successfully.
            </p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="h-11 max-w-none px-8"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
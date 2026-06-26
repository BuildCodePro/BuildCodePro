"use client";

import { useState } from "react";

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
import { DEFAULT_PROFILE_SETTINGS } from "@/lib/constants/settings";
import type { ProfileSettings } from "@/lib/constants/settings";

import { LogoUploadField } from "./logo-upload-field";

export function ProfileSettingsForm() {
  const [formData, setFormData] = useState<ProfileSettings>(
    DEFAULT_PROFILE_SETTINGS,
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof ProfileSettings, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    // API integration will be wired later
    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsSaving(false);
  };

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
              name={formData.fullName}
              className="size-16 text-lg"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 max-w-none px-5"
            >
              Change Photo
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={(event) => handleChange("fullName", event.target.value)}
            />
            <FormField
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={(event) =>
                handleChange("companyName", event.target.value)
              }
            />
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={(event) => handleChange("email", event.target.value)}
            />
            <FormField
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
            />
          </div>

          <LogoUploadField className="max-w-md" />

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

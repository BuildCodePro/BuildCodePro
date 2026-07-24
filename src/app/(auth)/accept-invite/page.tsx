import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { AcceptInviteForm } from "@/components/auth/accept-invite-form";

export const metadata: Metadata = {
  title: "Accept Invitation",
  description: "Set up your account to join BuildCode Pro",
};

export default function AcceptInvitePage() {
  return (
    <AuthSplitLayout>
      <Suspense fallback={null}>
        <AcceptInviteForm />
      </Suspense>
    </AuthSplitLayout>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { VerifyEmailChangeForm } from "@/components/auth/verify-email-change";

export const metadata: Metadata = {
  title: "Verify Email Change",
  description: "Verify your BuildCode Pro account email address",
};

export default function VerifyEmailPage() {
  return (
    <AuthSplitLayout>
      <Suspense>
        <VerifyEmailChangeForm />
      </Suspense>
    </AuthSplitLayout>
  );
}

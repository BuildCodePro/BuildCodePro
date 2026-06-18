import type { Metadata } from "next";

import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your BuildCode Pro account",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <ResetPasswordForm />
    </AuthSplitLayout>
  );
}

import type { Metadata } from "next";

import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { SignupWizard } from "@/components/auth/signup-wizard";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create your BuildCode Pro company account and invite your estimation team",
};

export default function SignupPage() {
  return (
    <AuthSplitLayout>
      <SignupWizard />
    </AuthSplitLayout>
  );
}

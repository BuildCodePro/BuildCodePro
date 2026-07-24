import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { VerifyOtpForm } from "@/components/auth/verify-otp-form";

export const metadata: Metadata = {
  title: "Verify OTP",
  description: "Verify your OTP code",
};

export default function VerifyOtpPage() {
  return (  
    <div className="flex w-full flex-col gap-6">
      <AuthSplitLayout>
        <Suspense>
          <VerifyOtpForm />
        </Suspense>
      </AuthSplitLayout>
    </div>
  );
}

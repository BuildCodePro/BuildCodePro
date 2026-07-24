// "use client";

// import { useState } from "react";

// import { Button, buttonVariants } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { FormField } from "@/components/ui/form-field";
// import { ToggleCard } from "@/components/ui/toggle-card";
// import {
//   ACTIVE_SESSIONS,
//   type ChangePasswordFormData,
// } from "@/lib/constants/settings";
// import { validateChangePasswordForm } from "@/lib/validations/settings";
// import { cn } from "@/lib/utils/cn";
// import { PasswordField } from "../ui";

// export function SecuritySettingsPanel() {
//   const [passwordForm, setPasswordForm] = useState<ChangePasswordFormData>({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
//   const [passwordErrors, setPasswordErrors] = useState<
//     Partial<Record<keyof ChangePasswordFormData, string>>
//   >({});
//   const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
//   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
//   const [sessions, setSessions] = useState(ACTIVE_SESSIONS);

//   const handlePasswordChange = (
//     field: keyof ChangePasswordFormData,
//     value: string,
//   ) => {
//     setPasswordForm((current) => ({ ...current, [field]: value }));
//   };

//   const handlePasswordSubmit = async (
//     event: React.FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();

//     const validation = validateChangePasswordForm(passwordForm);
//     setPasswordErrors(validation.errors);

//     if (!validation.success) {
//       return;
//     }

//     setIsUpdatingPassword(true);

//     // API integration will be wired later
//     // await new Promise((resolve) => setTimeout(resolve, 600));

//     setPasswordForm({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });
//     setPasswordErrors({});
//     setIsUpdatingPassword(false);
//   };

//   const handleSignOutSession = (sessionId: string) => {
//     setSessions((current) =>
//       current.filter((session) => session.id !== sessionId),
//     );
//   };

//   return (
//     <Card>
//       <CardContent className="space-y-8 p-5 sm:p-6">
//         <section>
//           <CardHeader className="mb-6">
//             <CardTitle>Change Password</CardTitle>
//             <CardDescription>
//               Update your password to keep your account secure
//             </CardDescription>
//           </CardHeader>

//           <form onSubmit={handlePasswordSubmit} className="space-y-4" noValidate>
//             <PasswordField
//               label="Current Password"
//               name="currentPassword"
//               placeholder="Enter Current Password"
//               autoComplete="current-password"
//               value={passwordForm.currentPassword}
//               onChange={(event) =>
//                 handlePasswordChange("currentPassword", event.target.value)
//               }
//               error={passwordErrors.currentPassword}
//             />

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <PasswordField
//                 label="New Password"
//                 name="newPassword"
//                 placeholder="Enter New Password"
//                 autoComplete="new-password"
//                 value={passwordForm.newPassword}
//                 onChange={(event) =>
//                   handlePasswordChange("newPassword", event.target.value)
//                 }
//                 error={passwordErrors.newPassword}
//               />
//               <PasswordField
//                 label="Confirm New Password"
//                 name="confirmPassword"
//                 placeholder="Confirm New Password"
//                 autoComplete="new-password"
//                 value={passwordForm.confirmPassword}
//                 onChange={(event) =>
//                   handlePasswordChange("confirmPassword", event.target.value)
//                 }
//                 error={passwordErrors.confirmPassword}
//               />
//             </div>

//             <div className="flex justify-end pt-2">
//               <Button
//                 type="submit"
//                 disabled={isUpdatingPassword}
//                 className="h-11 max-w-none px-8"
//               >
//                 {isUpdatingPassword ? "Updating..." : "Update Password"}
//               </Button>
//             </div>
//           </form>
//         </section>

        

//         <section className="border-t border-border pt-8">
//           <CardHeader className="mb-4">
//             <CardTitle>Active Sessions</CardTitle>
//             <CardDescription>
//               Manage devices currently signed in to your account
//             </CardDescription>
//           </CardHeader>

//           <ul className="space-y-3">
//             {sessions.map((session) => (
//               <li
//                 key={session.id}
//                 className="flex flex-col gap-3 rounded-[12px] border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
//               >
//                 <div>
//                   <p className="font-body text-sm font-semibold text-foreground">
//                     {session.device}
//                     {session.isCurrent ? (
//                       <span className="ml-2 font-normal text-success">
//                         (This device)
//                       </span>
//                     ) : null}
//                   </p>
//                   <p className="mt-0.5 font-body text-xs text-stat-label">
//                     {session.location} &bull; {session.lastActive}
//                   </p>
//                 </div>

//                 {!session.isCurrent ? (
//                   <button
//                     type="button"
//                     onClick={() => handleSignOutSession(session.id)}
//                     className={cn(
//                       buttonVariants({ variant: "outline", size: "sm" }),
//                       "h-9 w-full max-w-none rounded-[10px] px-4 sm:w-auto",
//                     )}
//                   >
//                     Sign Out
//                   </button>
//                 ) : null}
//               </li>
//             ))}
//           </ul>
//         </section>
//       </CardContent>
//     </Card>
//   );
// }


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
import type { ChangePasswordFormData } from "@/lib/constants/settings";
import { validateChangePasswordForm } from "@/lib/validations/settings";
import { cn } from "@/lib/utils/cn";
import { PasswordField } from "../ui";
import {
  useDeleteSessionMutation,
  useSessionsQuery,
} from "@/services/authService";
import {
  useChangePasswordMutation
} from "@/services/useProfileService";

function formatSessionTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function SecuritySettingsPanel() {
  const [passwordForm, setPasswordForm] = useState<ChangePasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof ChangePasswordFormData, string>>
  >({});

  const changePasswordMutation = useChangePasswordMutation();
  const sessionsQuery = useSessionsQuery();
  const deleteSessionMutation = useDeleteSessionMutation();

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

    changePasswordMutation.mutate(
      {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setPasswordErrors({});
        },
        onError: () => {
          // API returns a generic { message } on failure (e.g. wrong current
          // password) rather than field-level errors, so surface it here.
          setPasswordErrors({
            currentPassword: "Current password is incorrect.",
          });
        },
      },
    );
  };

  const handleSignOutSession = (sessionId: string) => {
    deleteSessionMutation.mutate(sessionId);
  };

  const isUpdatingPassword = changePasswordMutation.isPending;
  // sessionsQuery.data is typed as {} by whatever generic (or lack of one)
  // useSessionsQuery uses in authService — cast it here to Session[] so
  // .length / .map resolve without touching authService itself.
  const sessions = (sessionsQuery.data ?? []) as any;

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
            <PasswordField
              label="Current Password"
              name="currentPassword"
              placeholder="Enter Current Password"
              autoComplete="current-password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                handlePasswordChange("currentPassword", event.target.value)
              }
              error={passwordErrors.currentPassword}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <PasswordField
                label="New Password"
                name="newPassword"
                placeholder="Enter New Password"
                autoComplete="new-password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  handlePasswordChange("newPassword", event.target.value)
                }
                error={passwordErrors.newPassword}
              />
              <PasswordField
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="Confirm New Password"
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
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Manage devices currently signed in to your account
            </CardDescription>
          </CardHeader>

          {sessionsQuery.isLoading ? (
            <p className="font-body text-sm text-stat-label">
              Loading sessions...
            </p>
          ) : sessionsQuery.isError ? (
            <p className="text-sm text-red-500">
              Couldn&apos;t load active sessions.
            </p>
          ) : sessions.length === 0 ? (
            <p className="font-body text-sm text-stat-label">
              No active sessions found.
            </p>
          ) : (
            <ul className="space-y-3">
              {sessions.map((session : any) => (
                <li
                  key={session.id}
                  className="flex flex-col gap-3 rounded-[12px] border border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-body text-sm font-semibold text-foreground">
                      {session.ip_address}
                      {session.remember_me ? (
                        <span className="ml-2 font-normal text-stat-label">
                          (remembered)
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 font-body text-xs text-stat-label">
                      Last active {formatSessionTimestamp(session.last_used_at)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSignOutSession(session.id)}
                    disabled={
                      deleteSessionMutation.isPending &&
                      deleteSessionMutation.variables === session.id
                    }
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 w-full max-w-none rounded-[10px] px-4 sm:w-auto",
                    )}
                  >
                    {deleteSessionMutation.isPending &&
                    deleteSessionMutation.variables === session.id
                      ? "Signing out..."
                      : "Sign Out"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
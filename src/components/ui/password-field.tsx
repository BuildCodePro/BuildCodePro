"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

import { FormField } from "@/components/ui/form-field";
import type { InputProps } from "@/components/ui/input";

interface PasswordFieldProps extends Omit<InputProps, "type" | "leftIcon" | "rightSlot"> {
  label: string;
}

export function PasswordField({
  label,
  id,
  name,
  error,
  ...inputProps
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = id ?? name;

  return (
    <FormField
      label={label}
      id={fieldId}
      name={name}
      type={showPassword ? "text" : "password"}
      error={error}
      leftIcon={<Lock className="size-[18px]" aria-hidden="true" />}
      rightSlot={
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="inline-flex size-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:text-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="size-[18px]" aria-hidden="true" />
          ) : (
            <Eye className="size-[18px]" aria-hidden="true" />
          )}
        </button>
      }
      {...inputProps}
    />
  );
}

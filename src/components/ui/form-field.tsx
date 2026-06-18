import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps extends InputProps {
  label: string;
}

export function FormField({
  label,
  id,
  name,
  error,
  leftIcon,
  rightSlot,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id ?? name;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input
        id={fieldId}
        name={name}
        error={error}
        leftIcon={leftIcon}
        rightSlot={rightSlot}
        {...inputProps}
      />
    </div>
  );
}

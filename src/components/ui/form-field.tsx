import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps extends Omit<InputProps, 'children'> {
  label: string;
  children?: React.ReactNode;
}

export function FormField({
  label,
  id,
  name,
  error,
  leftIcon,
  rightSlot,
  children,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id ?? name;

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      {children ? (
        children
      ) : (
        <Input
          id={fieldId}
          className="max-h-[40px]"
          name={name}
          error={error}
          leftIcon={leftIcon}
          rightSlot={rightSlot}
          {...inputProps}
        />
      )}
    </div>
  );
}

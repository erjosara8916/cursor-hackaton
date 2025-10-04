import type { Control, FieldPath } from "react-hook-form";
import { useController } from "react-hook-form";

import { TextField } from "#/components/text-field/text-field.component";

type NativeInputProps = Pick<
  React.ComponentProps<"input">,
  "className" | "placeholder" | "type"
>;

type FormFields = Record<string, string | null | undefined>;

type ControlledFormElementProps<TFormFields extends FormFields> = Readonly<
  {
    control: Control<TFormFields, unknown, TFormFields>;
    label: string;
    name: FieldPath<TFormFields>;
  } & NativeInputProps
>;

export const ControlledTextField = <TFormFields extends FormFields>(
  props: ControlledFormElementProps<TFormFields>,
) => {
  const { control, label, name, className, placeholder, type = "text" } = props;

  const { field, fieldState } = useController({
    control,
    name,
  });

  return (
    <TextField
      className={className}
      errorMessage={fieldState.error?.message}
      isDisabled={field.disabled}
      isInvalid={fieldState.invalid}
      label={label}
      name={field.name}
      slotProps={{
        input: {
          placeholder,
          ref: field.ref,
        },
      }}
      type={type}
      value={field.value ?? undefined}
      onBlur={field.onBlur}
      onChange={field.onChange}
    />
  );
};

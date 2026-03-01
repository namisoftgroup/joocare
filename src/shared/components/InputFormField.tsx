import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { Input } from "./ui/input";

type InputFormFieldProps = {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  icon?: React.ReactNode;
  className?: string;
} & React.ComponentProps<"input">;

export const InputFormField = React.forwardRef<
  HTMLInputElement,
  InputFormFieldProps
>(({ label, id, placeholder, type = "text", className, ...props }, ref) => {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      <label htmlFor={id} className="mb-1 font-semibold">
        {label}
      </label>
      <Input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
});

InputFormField.displayName = "InputFormField";

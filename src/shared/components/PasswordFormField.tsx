"use client";
import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { Input } from "./ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

type PasswordFormFieldProps = {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  className?: string;
} & React.ComponentProps<"input">;

export const PasswordFormField = React.forwardRef<
  HTMLInputElement,
  PasswordFormFieldProps
>(({ label, id, placeholder, className, ...props }, ref) => {
  const [show, setShow] = React.useState(false);

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <label htmlFor={id} className="mb-1 font-semibold">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          {...props}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer">
          {show ? (
            <EyeOffIcon
              className="h-4 w-4 cursor-pointer"
              onClick={() => setShow(false)}
            />
          ) : (
            <EyeIcon
              className="h-4 w-4 cursor-pointer"
              onClick={() => setShow(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
});

PasswordFormField.displayName = "PasswordFormField";

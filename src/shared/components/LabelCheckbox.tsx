import { ReactNode } from "react";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { cn } from "../lib/utils";

type LabelCheckboxProps = {
  id: string;
  children: ReactNode;
  className?: string;
  error?: string;
};

const LabelCheckbox = ({
  id,
  children,
  error,
  className,
}: LabelCheckboxProps) => {
  return (
    <section className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-2 items-center">
        <Checkbox id={id} name={id} />
        <Label className={"flex flex-wrap"} htmlFor={id}>
          {children}
        </Label>
      </div>
      {error && <span className="text-red-500 text-[12px] mt-1">{error}</span>}
    </section>
  );
};

export default LabelCheckbox;

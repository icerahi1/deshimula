import { cn } from "@/lib/cn";
import { LabelHTMLAttributes, forwardRef } from "react";

const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("mb-2 block text-sm font-medium text-slate-700", className)}
    {...props}
  />
));

Label.displayName = "Label";

export { Label };

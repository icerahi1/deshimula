import { cn } from "@/lib/cn";
import { type HTMLAttributes, forwardRef } from "react";

const Badge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700",
        className,
      )}
      {...props}
    />
  ),
);

Badge.displayName = "Badge";

export { Badge };

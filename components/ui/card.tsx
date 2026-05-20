import { cn } from "@/lib/cn";
import { type HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm",
        className,
      )}
      {...props}
    />
  ),
);

Card.displayName = "Card";

export { Card };

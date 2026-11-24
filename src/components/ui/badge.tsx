import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-[#c8d5bc] bg-secondary text-secondary-foreground",
        accent: "border-transparent bg-accent/15 text-[#495a30]",
        outline: "border-border bg-white/80 text-foreground",
        available: "border-[#b9d4b4] bg-[#ebf4e8] text-[#244d36]",
        limited: "border-[#e6d5ad] bg-[#fbf5e6] text-[#7c5819]",
        seasonal: "border-[#d8d3e3] bg-[#f4f1f8] text-[#53466f]",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

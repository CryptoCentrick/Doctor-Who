import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        default: "border-border/70 bg-secondary/60 text-foreground",
        success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200",
        warning: "border-yellow-500/30 bg-yellow-500/15 text-yellow-200",
        danger: "border-red-500/30 bg-red-500/15 text-red-200",
        outline: "border-border/70 text-muted-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

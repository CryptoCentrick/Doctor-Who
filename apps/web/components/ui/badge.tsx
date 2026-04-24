import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
  {
    variants: {
      variant: {
        default: "border-border bg-secondary/70 text-foreground",
        success: "border-primary/30 bg-primary/12 text-primary dark:text-[rgb(198,236,232)]",
        warning: "border-accent/35 bg-accent/12 text-[rgb(138,88,78)] dark:text-[rgb(250,222,214)]",
        danger: "border-accent/40 bg-accent/16 text-[rgb(138,88,78)] dark:text-[rgb(250,222,214)]",
        outline: "border-border/80 bg-background/50 text-muted-foreground"
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

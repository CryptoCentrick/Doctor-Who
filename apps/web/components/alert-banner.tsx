import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap = {
  info: Info,
  warning: AlertTriangle,
  critical: ShieldAlert
};

const badgeMap = {
  info: "default",
  warning: "warning",
  critical: "danger"
} as const;

export function AlertBanner({
  severity,
  title,
  message
}: {
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
}) {
  const Icon = iconMap[severity];

  return (
    <Card
      className={cn(
        "glass-panel border-border/70 p-4",
        severity === "critical" && "border-red-500/30",
        severity === "warning" && "border-yellow-500/30"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-background/70 p-3">
          <Icon className="size-5" />
        </div>
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="font-display text-lg font-semibold">{title}</h3>
            <Badge variant={badgeMap[severity]}>{severity}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Not a medical diagnosis. Consult a doctor if symptoms concern you.
          </p>
        </div>
      </div>
    </Card>
  );
}


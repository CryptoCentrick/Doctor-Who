import { Card, CardContent } from "@/components/ui/card";

export function ReportMetricGrid({
  items
}: {
  items: Array<{ label: string; value: string; helper?: string; tone?: "positive" | "neutral" | "warning" | "critical" }>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="glass-panel border-white/10">
          <CardContent className="space-y-3 pt-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
            <p className="font-display text-2xl font-semibold">{item.value}</p>
            {item.helper ? <p className="text-sm text-muted-foreground">{item.helper}</p> : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

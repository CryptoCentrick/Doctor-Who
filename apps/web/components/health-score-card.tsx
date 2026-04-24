import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HealthScoreCard({
  title,
  description,
  accent,
  score,
  href,
  bandLabel
}: {
  title: string;
  description: string;
  accent: string;
  score: number;
  href: string;
  bandLabel: string;
}) {
  return (
    <Card className="glass-panel border-border/70">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div
            className="size-14 rounded-[22px]"
            style={{
              background: `radial-gradient(circle at top left, ${accent}, transparent 68%), rgba(255,255,255,0.06)`
            }}
          />
          <Badge variant={score > 70 ? "success" : score > 40 ? "warning" : "danger"}>{bandLabel}</Badge>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Health score</p>
            <p className="mt-2 font-display text-5xl font-bold">{score}</p>
          </div>
          <Button asChild variant="outline">
            <Link href={href}>
              Open report
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


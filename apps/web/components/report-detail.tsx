"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { type HealthReport } from "@doctor-who/shared";

import { ReportChart } from "@/components/report-chart";
import { ReportMetricGrid } from "@/components/report-metric-grid";
import { ScoreGauge } from "@/components/score-gauge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const rangeOptions = [
  { label: "7D", points: 7 },
  { label: "30D", points: 30 },
  { label: "90D", points: 90 }
] as const;

function sliceChartData(chart: HealthReport["data"]["charts"][number], points: number) {
  if (chart.type === "pie" || chart.type === "heatmap") {
    return chart.data;
  }

  return chart.data.slice(-points);
}

export function ReportDetail({ report }: { report: HealthReport }) {
  const [range, setRange] = useState<(typeof rangeOptions)[number]>(rangeOptions[1]);

  const chartData = useMemo(() => {
    return report.data.charts.map((chart) => ({
      ...chart,
      data: sliceChartData(chart, range.points)
    }));
  }, [range.points, report.data.charts]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[320px,1fr]">
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <Badge variant={report.data.score > 70 ? "success" : report.data.score > 40 ? "warning" : "danger"}>
              {report.moduleType.replace("_", " ")}
            </Badge>
            <CardTitle className="text-2xl">{report.data.headline}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <ScoreGauge score={report.data.score} />
            <div className="w-full space-y-3">
              <Button asChild className="w-full">
                <Link href={`/api/exports/pdf?module=${report.moduleType.toLowerCase()}`}>
                  <Download className="size-4" />
                  Export PDF
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/api/exports/csv?module=${report.moduleType.toLowerCase()}`}>
                  <FileSpreadsheet className="size-4" />
                  Export Spreadsheet
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Date range</p>
              <div className="mt-2 flex gap-2">
                {rangeOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={range.label === option.label ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRange(option)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
            <Badge variant="outline">Interactive charts with brush zoom</Badge>
          </div>

          <ReportMetricGrid items={report.data.summary} />
        </div>
      </div>

      <div className="grid gap-6 2xl:grid-cols-2">
        {chartData.map((chart) => (
          <ReportChart key={chart.id} title={chart.title} type={chart.type} data={chart.data} keys={chart.keys} helper={chart.helper} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle>Trend interpretation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.data.insights.map((insight) => (
              <div key={insight.title} className="rounded-[24px] border border-border/60 bg-background/25 p-4">
                <div className="mb-2 flex items-center gap-3">
                  <Badge variant={insight.severity === "critical" ? "danger" : insight.severity === "warning" ? "warning" : "default"}>
                    {insight.severity}
                  </Badge>
                  <h3 className="font-semibold">{insight.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle>Recommendations & disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.data.recommendations.map((recommendation) => (
              <div key={recommendation} className="rounded-[24px] border border-border/60 bg-background/25 p-4 text-sm text-muted-foreground">
                {recommendation}
              </div>
            ))}
            <div className="rounded-[24px] border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
              {report.data.disclaimer}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

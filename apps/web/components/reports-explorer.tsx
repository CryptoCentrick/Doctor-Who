"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { getScoreBand, type HealthReport, type ReportModuleType } from "@doctor-who/shared";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const moduleOptions: Array<ReportModuleType | "ALL"> = [
  "ALL",
  "CARDIOVASCULAR",
  "METABOLIC",
  "SLEEP",
  "FITNESS",
  "STRESS",
  "PREDICTIVE"
];

export function ReportsExplorer({ reports }: { reports: HealthReport[] }) {
  const [query, setQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<ReportModuleType | "ALL">("ALL");

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesQuery =
        report.data.headline.toLowerCase().includes(query.toLowerCase()) ||
        report.moduleType.toLowerCase().includes(query.toLowerCase());
      const matchesModule = moduleFilter === "ALL" || report.moduleType === moduleFilter;
      return matchesQuery && matchesModule;
    });
  }, [moduleFilter, query, reports]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.6fr,240px]">
        <label className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by module or headline"
            className="pl-11"
          />
        </label>
        <select
          value={moduleFilter}
          onChange={(event) => setModuleFilter(event.target.value as ReportModuleType | "ALL")}
          className="h-11 rounded-2xl border border-input bg-background/40 px-4 text-sm"
        >
          {moduleOptions.map((option) => (
            <option key={option} value={option}>
              {option === "ALL" ? "All modules" : option.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <Card className="glass-panel border-white/10">
          <CardContent className="pt-6">
            <p className="font-display text-xl font-semibold">No reports match this filter.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a broader search, generate a new report, or connect a device to collect more readings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredReports.map((report) => {
            const band = getScoreBand(report.data.score);

            return (
              <Link key={report.id} href={`/reports/${report.id}`}>
                <Card className="glass-panel h-full border-white/10 transition hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant={report.data.score > 70 ? "success" : report.data.score > 40 ? "warning" : "danger"}>
                        {band.label}
                      </Badge>
                      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        {format(new Date(report.generatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <CardTitle>{report.moduleType.replace("_", " ")}</CardTitle>
                    <CardDescription>{report.data.headline}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Score</p>
                      <p className="font-display text-4xl font-semibold">{report.data.score}</p>
                    </div>
                    <div className="space-y-1 text-right text-sm text-muted-foreground">
                      <p>{report.data.summary[0]?.value}</p>
                      <p>{report.data.summary[1]?.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

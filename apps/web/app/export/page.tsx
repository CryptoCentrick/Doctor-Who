import { Download, FileSpreadsheet, FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { reports } from "@/lib/mock-data";

export default function ExportPage() {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-border/70">
        <CardHeader>
          <Badge variant="outline">Exports</Badge>
          <CardTitle className="text-3xl">Branded PDFs and spreadsheet exports</CardTitle>
          <CardDescription>
            Export the full suite or drill into a single report module in PDF or XLSX format.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="glass-panel border-border/70">
          <CardHeader>
            <CardTitle>Full-suite export</CardTitle>
            <CardDescription>Generate a combined health review across all report modules.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <a href="/api/exports/pdf?module=all">
                <FileText className="size-4" />
                Export PDF bundle
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="/api/exports/csv?module=all">
                <FileSpreadsheet className="size-4" />
                Export spreadsheet
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-panel border-border/70">
          <CardHeader>
            <CardTitle>Per-module export</CardTitle>
            <CardDescription>Choose a report below to generate module-specific files.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {reports.map((report) => (
              <div key={report.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-border/60 bg-background/25 p-4">
                <div>
                  <p className="font-semibold">{report.moduleType.replace("_", " ")}</p>
                  <p className="text-sm text-muted-foreground">{report.data.headline}</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <a href={`/api/exports/pdf?module=${report.moduleType.toLowerCase()}`}>
                      <Download className="size-4" />
                      PDF
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a href={`/api/exports/csv?module=${report.moduleType.toLowerCase()}`}>XLSX</a>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


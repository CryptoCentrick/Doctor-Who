import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportDetail } from "@/components/report-detail";
import { getReportById } from "@/lib/mock-data";

export default async function ReportDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = getReportById(id);

  if (!report) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-border/70">
        <CardHeader>
          <Badge variant="outline">Report detail</Badge>
          <CardTitle className="text-3xl">{report.moduleType.replace("_", " ")}</CardTitle>
          <CardDescription>
            This app is not a medical device. Reports are for informational and wellness purposes only.
          </CardDescription>
        </CardHeader>
      </Card>

      <ReportDetail report={report} />
    </div>
  );
}


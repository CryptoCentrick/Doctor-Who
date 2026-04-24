import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsExplorer } from "@/components/reports-explorer";
import { reports } from "@/lib/mock-data";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-border/70">
        <CardHeader>
          <Badge variant="outline">Generated reports</Badge>
          <CardTitle className="text-3xl">Health report library</CardTitle>
          <CardDescription>
            Filter, search, and reopen historical reports across all six wellness modules.
          </CardDescription>
        </CardHeader>
      </Card>

      <ReportsExplorer reports={reports} />
    </div>
  );
}


import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SleepModePanel } from "@/components/sleep-mode-panel";
import { sleepSessions } from "@/lib/mock-data";

export default function SleepPage() {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-white/10">
        <CardHeader>
          <Badge variant="outline">Overnight mode</Badge>
          <CardTitle className="text-3xl">Sleep health and overnight audio monitoring</CardTitle>
          <CardDescription>
            Track duration, estimate sleep-stage balance, and flag snoring or apnea-style events overnight.
          </CardDescription>
        </CardHeader>
      </Card>

      <SleepModePanel sessions={sleepSessions} />
    </div>
  );
}

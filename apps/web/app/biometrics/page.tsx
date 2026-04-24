import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BiometricsConsole } from "@/components/biometrics-console";

export default function BiometricsPage() {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-border/70">
        <CardHeader>
          <Badge variant="warning">Estimate-based capture</Badge>
          <CardTitle className="text-3xl">Live biometric capture</CardTitle>
          <CardDescription>
            Combine phone sensors, webcam rPPG, microphone breathing analysis, and manual fallback input from one screen.
          </CardDescription>
        </CardHeader>
      </Card>

      <BiometricsConsole />
    </div>
  );
}


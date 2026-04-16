import { ArrowUpFromLine, Bluetooth, Cable, CloudUpload, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { devices } from "@/lib/mock-data";

export default function ConnectPage() {
  return (
    <div className="space-y-6">
      <Card className="glass-panel border-white/10">
        <CardHeader>
          <Badge variant="outline">Connection hub</Badge>
          <CardTitle className="text-3xl">Wearables, peripherals, and data imports</CardTitle>
          <CardDescription>
            Pair BLE and USB devices, connect cloud sources, or import Apple Health, Google Fit, Fitbit, and Garmin exports.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle>Connected devices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between rounded-[24px] border border-border/60 bg-background/25 p-4">
                <div>
                  <p className="font-semibold">{device.deviceName}</p>
                  <p className="text-sm text-muted-foreground">
                    {device.deviceType} via {device.connectionMethod.toLowerCase()}
                  </p>
                </div>
                <Badge variant="success">Synced</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          {[
            {
              title: "Bluetooth LE scanner",
              description: "Generic heart rate, glucose, and smartwatch discovery profile.",
              icon: Bluetooth
            },
            {
              title: "USB / Serial bridge",
              description: "Pulse oximeters, blood pressure cuffs, and serial medical peripherals.",
              icon: Cable
            },
            {
              title: "Import health files",
              description: "CSV, JSON, XML, and wearable export ingestion with normalization.",
              icon: ArrowUpFromLine
            },
            {
              title: "Privacy controls",
              description: "Review data policy before enabling cloud integrations or OAuth sources.",
              icon: Shield
            }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="glass-panel border-white/10">
                <CardContent className="flex items-start justify-between gap-4 pt-6">
                  <div>
                    <div className="mb-3 rounded-2xl bg-primary/15 p-3">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Button variant="outline">Open</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle>Supported cloud imports</CardTitle>
          <CardDescription>Fitbit OAuth, Garmin export ingestion, Google Fit JSON, Apple Health XML.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {["Fitbit OAuth", "Garmin Connect", "Google Fit JSON", "Apple Health XML", "CSV uploader", "Cloud sync"].map((item) => (
            <Button key={item} variant="outline">
              <CloudUpload className="size-4" />
              {item}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

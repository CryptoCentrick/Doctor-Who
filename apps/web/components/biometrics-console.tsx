"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Camera, Mic, Smartphone, Waves, Webcam } from "lucide-react";
import { SENSOR_ESTIMATE_DISCLAIMER } from "@doctor-who/shared";

import { AlertBanner } from "@/components/alert-banner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function randomRange(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

export function BiometricsConsole() {
  const [isScanning, setIsScanning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [heartRate, setHeartRate] = useState(68);
  const [spo2, setSpo2] = useState(98);
  const [breathingRate, setBreathingRate] = useState(15);
  const [manualValue, setManualValue] = useState("");

  useEffect(() => {
    if (!isScanning) {
      return;
    }

    const interval = window.setInterval(() => {
      setHeartRate(randomRange(61, 84));
      setSpo2(randomRange(95, 99));
      setBreathingRate(randomRange(12, 18));
      setSecondsLeft((value) => {
        if (value <= 1) {
          setIsScanning(false);
          return 60;
        }

        return value - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isScanning]);

  const waveform = useMemo(
    () =>
      Array.from(
        { length: 32 },
        (_, index) =>
          20 +
          Math.sin(index / 2 + heartRate / 18) * 10 +
          Math.cos(index / 3 + breathingRate / 8) * 8
      ),
    [heartRate, breathingRate]
  );

  return (
    <div className="space-y-6">
      <AlertBanner
        severity="warning"
        title="Estimate-only capture"
        message={`${SENSOR_ESTIMATE_DISCLAIMER} Keep the camera steady, use good lighting, and stay still during each scan.`}
      />

      <div className="grid gap-6 xl:grid-cols-[1.25fr,0.9fr]">
        <Card className="glass-panel border-border/70">
          <CardHeader>
            <CardTitle>Quick Scan</CardTitle>
            <CardDescription>
              Run a 60-second session across webcam rPPG, microphone breathing analysis, and phone sensor relay.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[28px] border border-border/60 bg-background/25 p-5">
                <Camera className="mb-4 size-5 text-primary" />
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Heart rate</p>
                <p className="mt-2 font-display text-4xl font-semibold">{heartRate} bpm</p>
              </div>
              <div className="rounded-[28px] border border-border/60 bg-background/25 p-5">
                <Activity className="mb-4 size-5 text-primary" />
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">SpO2 proxy</p>
                <p className="mt-2 font-display text-4xl font-semibold">{spo2}%</p>
              </div>
              <div className="rounded-[28px] border border-border/60 bg-background/25 p-5">
                <Mic className="mb-4 size-5 text-primary" />
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Breathing</p>
                <p className="mt-2 font-display text-4xl font-semibold">{breathingRate} br/min</p>
              </div>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-background/25 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Waveform</p>
                  <p className="text-sm text-muted-foreground">Live microphone breathing envelope visualization</p>
                </div>
                <div className="text-sm text-muted-foreground">{isScanning ? `${secondsLeft}s remaining` : "Ready"}</div>
              </div>
              <div className="flex h-28 items-end gap-2">
                {waveform.map((value, index) => (
                  <div
                    key={`${index}-${value}`}
                    className="flex-1 rounded-full bg-gradient-to-t from-primary/20 to-primary"
                    style={{ height: `${value * 2}px` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  setSecondsLeft(60);
                  setIsScanning(true);
                }}
              >
                Start Quick Scan
              </Button>
              <Button variant="outline" onClick={() => setIsScanning(false)}>
                Stop session
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-panel border-border/70">
            <CardHeader>
              <CardTitle>Sensor bridge status</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                { label: "Phone PWA bridge", icon: Smartphone, state: "Ready for Web Bluetooth / Web USB" },
                { label: "Desktop webcam", icon: Webcam, state: "Available for rPPG capture" },
                { label: "Motion + posture", icon: Waves, state: "Awaiting sensor permission" }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4 rounded-[24px] border border-border/60 bg-background/25 p-4">
                    <div className="rounded-2xl bg-primary/15 p-3">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.state}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="glass-panel border-border/70">
            <CardHeader>
              <CardTitle>Manual fallback entry</CardTitle>
              <CardDescription>Enter vitals manually whenever a sensor or wearable is unavailable.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={manualValue} onChange={(event) => setManualValue(event.target.value)} placeholder="Enter heart rate, glucose, or blood pressure" />
              <Button variant="outline">Save manual reading</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


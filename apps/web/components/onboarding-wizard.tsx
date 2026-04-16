"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const STORAGE_KEY = "doctor-who-onboarding-complete";

export function OnboardingWizard() {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState("175");
  const [weight, setWeight] = useState("74");
  const [cloudSync, setCloudSync] = useState(false);

  useEffect(() => {
    setOpen(!window.localStorage.getItem(STORAGE_KEY));
  }, []);

  const bmi = useMemo(() => {
    const heightMeters = Number(height) / 100;
    const weightKg = Number(weight);

    if (!heightMeters || !weightKg) {
      return "0.0";
    }

    return (weightKg / (heightMeters * heightMeters)).toFixed(1);
  }, [height, weight]);

  if (!open) {
    return null;
  }

  return (
    <Card className="glass-panel border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/20 p-3">
            <Sparkles className="size-5" />
          </div>
          <div>
            <CardTitle>First-launch onboarding</CardTitle>
            <CardDescription>Capture baseline health context, units, and privacy preferences.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2 text-sm">
            <span className="text-muted-foreground">Height (cm)</span>
            <Input value={height} onChange={(event) => setHeight(event.target.value)} />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-muted-foreground">Weight (kg)</span>
            <Input value={weight} onChange={(event) => setWeight(event.target.value)} />
          </label>
          <div className="rounded-3xl border border-border/70 bg-background/30 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Baseline BMI</p>
            <p className="mt-2 font-display text-3xl font-semibold">{bmi}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[28px] border border-border/70 bg-background/30 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 size-5 text-primary" />
            <div>
              <p className="font-semibold">End-to-end encrypted cloud sync</p>
              <p className="text-sm text-muted-foreground">
                Local storage stays the default. Enable sync only if you want cross-device history.
              </p>
            </div>
          </div>
          <Switch checked={cloudSync} onCheckedChange={setCloudSync} />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, "true");
              window.localStorage.setItem("doctor-who-cloud-sync", String(cloudSync));
              setOpen(false);
            }}
          >
            Save baseline
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Remind me later
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

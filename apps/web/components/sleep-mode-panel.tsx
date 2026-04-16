"use client";

import { useMemo, useState } from "react";
import { BedDouble, MoonStar, TimerReset } from "lucide-react";
import type { SleepSession } from "@doctor-who/shared";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SleepModePanel({ sessions }: { sessions: SleepSession[] }) {
  const [active, setActive] = useState(false);

  const latestNights = useMemo(() => sessions.slice(-5).reverse(), [sessions]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle>Overnight monitoring</CardTitle>
          <CardDescription>
            Use the microphone to estimate snoring and breathing irregularity while the phone stays charging.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-[28px] border border-border/60 bg-background/25 p-6">
            <div className="mb-4 flex items-center gap-3">
              <MoonStar className="size-5 text-primary" />
              <p className="font-display text-2xl font-semibold">{active ? "Sleep Mode Active" : "Sleep Mode Ready"}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Accuracy improves when the room is quiet, the device is still, and the microphone remains unobstructed.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-border/60 bg-background/25 p-5">
              <BedDouble className="mb-3 size-5 text-primary" />
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Recommended bedtime</p>
              <p className="mt-2 font-display text-3xl font-semibold">10:30 PM</p>
            </div>
            <div className="rounded-[28px] border border-border/60 bg-background/25 p-5">
              <TimerReset className="mb-3 size-5 text-primary" />
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Sleep debt target</p>
              <p className="mt-2 font-display text-3xl font-semibold">Under 2 hrs</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setActive(true)}>Start Sleep Mode</Button>
            <Button variant="outline" onClick={() => setActive(false)}>
              End session
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel border-white/10">
        <CardHeader>
          <CardTitle>Recent sleep event log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {latestNights.map((session) => (
            <div key={session.id} className="rounded-[24px] border border-border/60 bg-background/25 p-4">
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="font-semibold">{new Date(session.endTime).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 3_600_000 * 10) / 10} hrs
                </p>
              </div>
              <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                <p>REM: {session.stages.remMinutes} min</p>
                <p>Snore events: {session.snoreEvents}</p>
                <p>Apnea flags: {session.apneaEvents}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

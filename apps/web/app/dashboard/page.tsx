import { Activity, Award, BellRing, Flame, Goal } from "lucide-react";

import { AlertBanner } from "@/components/alert-banner";
import { HealthScoreCard } from "@/components/health-score-card";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { ScoreGauge } from "@/components/score-gauge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { alerts, currentUser, dashboardCards } from "@/lib/mock-data";

export default function DashboardPage() {
  const overallScore = Math.round(
    dashboardCards.reduce((sum, card) => sum + card.report.data.score, 0) / dashboardCards.length
  );

  return (
    <div className="space-y-6">
      <OnboardingWizard />

      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card className="glass-panel pattern-grid overflow-hidden border-white/10">
          <CardHeader className="relative">
            <Badge variant="outline">Daily overview</Badge>
            <CardTitle className="max-w-2xl text-3xl sm:text-4xl">
              {currentUser.name}, your health data is trending steadily with recovery and sleep as the clearest leverage points.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base">
              Live biometrics, imported readings, and desktop behavior patterns are combined into six longitudinal report modules.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Health streak", value: "18 days", icon: Flame },
              { label: "Weekly goals", value: "4 / 5 hit", icon: Goal },
              { label: "Unread alerts", value: `${alerts.length}`, icon: BellRing },
              { label: "Badges earned", value: "12", icon: Award }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-[28px] border border-border/60 bg-background/25 p-5">
                  <Icon className="mb-4 size-5 text-primary" />
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <p className="mt-2 font-display text-3xl font-semibold">{item.value}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="glass-panel border-white/10">
          <CardHeader>
            <Badge variant="success">Overall Health Index</Badge>
            <CardTitle>Composite 30/60/90 day outlook</CardTitle>
            <CardDescription>
              Scores below are wellness indicators built from multiple estimate-grade signals and imported device data.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5">
            <ScoreGauge score={overallScore} />
            <div className="grid w-full gap-3">
              {[
                "Daily reports generate automatically at 6:00 AM.",
                "Bluetooth wearable sync is healthy.",
                "Cloud sync remains disabled for privacy."
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-border/60 bg-background/25 p-4 text-sm text-muted-foreground">
                  {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {dashboardCards.map((card) => (
          <HealthScoreCard
            key={card.moduleType}
            title={card.title}
            description={card.description}
            accent={card.accent}
            score={card.report.data.score}
            href={`/reports/${card.report.id}`}
            bandLabel={card.scoreBand.label}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <AlertBanner
          severity={alerts[0]?.severity ?? "info"}
          title="Primary anomaly alert"
          message={alerts[0]?.message ?? "No active alerts at the moment."}
        />

        <Card className="glass-panel border-white/10">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Run Quick Scan", description: "Capture webcam HR, breathing, and posture signals." },
              { title: "Connect a wearable", description: "Pair a Bluetooth heart-rate strap or glucose device." },
              { title: "Import health data", description: "Upload Fitbit, Garmin, Apple Health, or Google Fit exports." },
              { title: "Generate full report", description: "Produce branded PDF and spreadsheet exports for every module." }
            ].map((item) => (
              <div key={item.title} className="rounded-[28px] border border-border/60 bg-background/25 p-5">
                <Activity className="mb-3 size-5 text-primary" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

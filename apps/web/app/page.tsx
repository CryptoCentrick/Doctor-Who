import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Bluetooth,
  FileBarChart2,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Stethoscope
} from "lucide-react";

import { ScoreGauge } from "@/components/score-gauge";
import { HealthScoreCard } from "@/components/health-score-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { alerts, currentUser, dashboardCards, devices } from "@/lib/mock-data";

const faqItems = [
  {
    question: "What does Doctor Who help me do?",
    answer:
      "It brings together quick biometric capture, connected devices, historical reports, and exports in one patient-friendly portal."
  },
  {
    question: "Is this a medical diagnosis tool?",
    answer:
      "No. The experience is built for wellness tracking and informational reporting. Clear disclaimers remain visible across reports and scans."
  },
  {
    question: "Can I use it without external devices?",
    answer:
      "Yes. Doctor Who supports manual entries and imports, then blends those readings with any connected phone or desktop signals you enable."
  },
  {
    question: "How is my data handled?",
    answer:
      "The product is designed local-first, with privacy controls, export tools, and optional integrations surfaced clearly in the portal."
  }
];

const blogPosts = [
  {
    title: "How the quick scan fits into a daily routine",
    summary: "A calmer way to capture wellness signals, review trends, and spot changes before a busy day starts.",
    href: "/biometrics"
  },
  {
    title: "What a strong report handoff should include",
    summary: "Use the export flow to package charts, summaries, and context before sharing information with a clinician.",
    href: "/export"
  },
  {
    title: "Choosing the right connected devices",
    summary: "A practical guide to BLE wearables, USB peripherals, and import files that help Doctor Who stay useful.",
    href: "/connect"
  }
];

export default function HomePage() {
  const overallScore = Math.round(
    dashboardCards.reduce((sum, card) => sum + card.report.data.score, 0) / dashboardCards.length
  );
  const featuredModules = dashboardCards.slice(0, 3);
  const leadAlert = alerts[0];

  return (
    <div className="space-y-12 lg:space-y-16">
      <section className="grid min-h-[72vh] gap-6 xl:grid-cols-[1.08fr,0.92fr]">
        <Card className="glass-panel pattern-grid overflow-hidden border-border/70">
          <CardContent className="flex h-full flex-col justify-between gap-10 p-8 sm:p-10 xl:p-12">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Medical patient portal</Badge>
                <Badge variant="success">Soft coral and soft teal UI</Badge>
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
                  Doctor Who makes biometric capture, patient reporting, and device sync feel clear, calm, and trustworthy.
                </h1>
                <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Track wellness signals from phone sensors, desktop peripherals, imports, and connected devices, then turn them
                  into readable dashboards, report modules, and export-ready summaries for real conversations.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Open patient portal
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/reports">Review reports</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Overall score",
                  value: `${overallScore}`,
                  helper: "Composite 30/60/90 day health index"
                },
                {
                  label: "Report modules",
                  value: `${dashboardCards.length}`,
                  helper: "Cardio, metabolic, sleep, fitness, stress, predictive"
                },
                {
                  label: "Connected devices",
                  value: `${devices.length}`,
                  helper: "Bluetooth, USB, and import-ready data sources"
                },
                {
                  label: "Privacy posture",
                  value: "Local-first",
                  helper: "Clear controls before sync or export"
                }
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={
                    index % 2 === 0
                      ? "soft-teal rounded-[28px] border border-border/70 p-5"
                      : "soft-coral rounded-[28px] border border-border/70 p-5"
                  }
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
                  <p className="mt-3 font-display text-3xl font-semibold">{item.value}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.helper}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="glass-panel border-border/70">
            <CardHeader>
              <Badge variant="outline">Today at a glance</Badge>
              <CardTitle className="text-3xl">A polished front door for {currentUser.name}&rsquo;s health story.</CardTitle>
              <CardDescription>
                The homepage introduces Doctor Who clearly, while the full portal keeps daily trends, report history, and device flows one tap away.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[0.7fr,1fr] lg:items-center">
              <div className="flex justify-center">
                <ScoreGauge score={overallScore} />
              </div>
              <div className="grid gap-3">
                {[
                  "Quick scans, imports, and device sync all feed the same report engine.",
                  "Every report keeps a wellness disclaimer visible and easy to understand.",
                  leadAlert
                    ? `Latest alert: ${leadAlert.message}`
                    : "No active anomaly alerts are blocking the current care workflow."
                ].map((item) => (
                  <div key={item} className="rounded-[24px] border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Quick scan",
                description: "Run the biometric capture flow for a fast wellness snapshot.",
                href: "/biometrics",
                icon: Activity
              },
              {
                title: "Health reports",
                description: "Review module-based charts and plain-language summaries.",
                href: "/reports",
                icon: FileBarChart2
              },
              {
                title: "Device hub",
                description: "Pair wearables, desktop sensors, or import external files.",
                href: "/connect",
                icon: Bluetooth
              }
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="glass-panel h-full border-border/70">
                  <CardContent className="flex h-full flex-col gap-5 p-6">
                    <div className="flex items-center justify-between">
                      <div className="rounded-2xl bg-primary/12 p-3">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <Sparkles className="size-4 text-accent" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h2>
                      <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                    </div>
                    <Button asChild variant="outline" className="mt-auto">
                      <Link href={item.href}>Open</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="grid gap-6 lg:grid-cols-[0.86fr,1.14fr]">
        <div className="space-y-5">
          <Badge variant="outline">About Doctor Who</Badge>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            A professional patient portal that explains itself clearly before asking anyone to trust it.
          </h2>
          <p className="text-base leading-8 text-muted-foreground">
            The experience is built to feel dependable in both light and dark themes, with strong contrast, calm spacing, and route structure
            that helps people move naturally from capture to understanding to export.
          </p>
          <div className="grid gap-3">
            {[
              "Clear language instead of vague wellness jargon.",
              "Structured report modules with charts, summaries, and export paths.",
              "Privacy-first positioning across onboarding, settings, and footer links."
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-border/70 bg-card/80 px-5 py-4 text-sm text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Capture",
              description: "Blend phone sensors, desktop inputs, imports, and wearables into one continuous data story.",
              icon: HeartPulse,
              tone: "soft-teal"
            },
            {
              title: "Understand",
              description: "Turn those readings into six report modules with charts, scores, and patient-friendly explanations.",
              icon: Stethoscope,
              tone: "soft-coral"
            },
            {
              title: "Protect",
              description: "Keep a local-first workflow, visible disclaimers, and settings that make privacy choices explicit.",
              icon: ShieldCheck,
              tone: "soft-teal"
            },
            {
              title: "Act",
              description: "Move smoothly into quick scans, device setup, exports, and long-term trend review without losing context.",
              icon: FileBarChart2,
              tone: "soft-coral"
            }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="glass-panel border-border/70">
                <CardContent className="flex h-full flex-col gap-5 p-6">
                  <div className={`${item.tone} flex size-14 items-center justify-center rounded-[22px] border border-border/70`}>
                    <Icon className="size-6 text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="outline">Portal preview</Badge>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              A homepage that leads naturally into the reports patients and teams actually need.
            </h2>
            <p className="max-w-3xl text-base leading-8 text-muted-foreground">
              These modules surface the clearest signals first, then let the user go deeper into full trends, alerts, and exports when needed.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard">
              Go to dashboard
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {featuredModules.map((card) => (
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
        </div>
      </section>

      <section id="faqs" className="space-y-6">
        <div className="space-y-3">
          <Badge variant="outline">FAQs</Badge>
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Questions people ask before they commit to a health portal.</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {faqItems.map((item, index) => (
            <Card key={item.question} className="glass-panel border-border/70">
              <CardContent className="flex h-full gap-4 p-6">
                <div
                  className={
                    index % 2 === 0
                      ? "soft-teal flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 text-sm font-semibold"
                      : "soft-coral flex size-11 shrink-0 items-center justify-center rounded-2xl border border-border/70 text-sm font-semibold"
                  }
                >
                  0{index + 1}
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-semibold tracking-tight">{item.question}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="blog" className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="outline">Blog</Badge>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Useful next reads for patients, caregivers, and product teams.</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/reports">Browse report library</Link>
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {blogPosts.map((post, index) => (
            <Card key={post.title} className="glass-panel h-full border-border/70">
              <CardContent className="flex h-full flex-col gap-5 p-6">
                <div
                  className={
                    index % 2 === 0
                      ? "soft-teal rounded-[24px] border border-border/70 p-5"
                      : "soft-coral rounded-[24px] border border-border/70 p-5"
                  }
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Editorial note</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">{post.title}</h3>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{post.summary}</p>
                <Button asChild variant="outline" className="mt-auto">
                  <Link href={post.href}>
                    Read more
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

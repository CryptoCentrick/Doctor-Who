"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BedDouble,
  Bluetooth,
  FileBarChart2,
  Gauge,
  HeartPulse,
  Menu,
  Settings,
  Share2
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: HeartPulse },
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/reports", label: "Reports", icon: FileBarChart2 },
  { href: "/biometrics", label: "Biometrics", icon: Activity },
  { href: "/connect", label: "Connect", icon: Bluetooth },
  { href: "/sleep", label: "Sleep", icon: BedDouble },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/export", label: "Export", icon: Share2 }
];

const footerSections = [
  {
    title: "About",
    links: [
      { label: "Our mission", href: "/#about" },
      { label: "Data policy", href: "/settings" },
      { label: "Patient trust", href: "/#about" }
    ]
  },
  {
    title: "FAQs",
    links: [
      { label: "How scans work", href: "/#faqs" },
      { label: "Privacy answers", href: "/#faqs" },
      { label: "Supported devices", href: "/connect" }
    ]
  },
  {
    title: "Blog",
    links: [
      { label: "Wellness insights", href: "/#blog" },
      { label: "Release notes", href: "/#blog" },
      { label: "Clinical disclaimers", href: "/#blog" }
    ]
  },
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Reports", href: "/reports" },
      { label: "Quick scan", href: "/biometrics" }
    ]
  },
  {
    title: "Resources",
    links: [
      { label: "Exports", href: "/export" },
      { label: "Connection hub", href: "/connect" },
      { label: "Sleep mode", href: "/sleep" }
    ]
  },
  {
    title: "Follow us",
    links: [
      { label: "LinkedIn placeholder", href: "#" },
      { label: "Instagram placeholder", href: "#" },
      { label: "X placeholder", href: "#" }
    ]
  }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/88 backdrop-blur-xl">
        <div className="page-wrap flex h-20 items-center gap-4">
          <Link href="/" className="min-w-0 shrink-0">
            <p className="font-display text-2xl font-semibold tracking-tight">Doctor Who</p>
            <p className="text-sm text-muted-foreground">Health analytics and patient portal</p>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 xl:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-primary/14 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Badge variant="outline" className="hidden md:inline-flex">
              Private by design
            </Badge>
            <ThemeToggle />
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/dashboard">Open portal</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="xl:hidden"
              onClick={() => setOpen((value) => !value)}
            >
              <Menu className="size-4" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-border/80 bg-background/96 xl:hidden">
            <div className="page-wrap grid gap-2 py-4 sm:grid-cols-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-3 text-sm font-medium text-foreground"
                  >
                    <Icon className="size-4 text-primary" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </header>

      <main className="flex-1">
        <div className="page-wrap py-8 sm:py-10 lg:py-12">{children}</div>
      </main>

      <footer className="mt-12 border-t border-border/80 bg-card/72">
        <div className="page-wrap py-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-4">
              <Badge variant="outline">Medical patient portal homepage</Badge>
              <h2 className="font-display text-3xl font-semibold tracking-tight">
                Doctor Who keeps biometric capture, reports, device sync, and patient-friendly summaries in one trusted portal.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Designed for clear health monitoring with soft coral and soft teal visual cues, accessible contrast, and a privacy-first local workflow.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-border/80 bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Portal support</p>
                <p className="mt-3 font-semibold">Reports, exports, and device setup are available from the main navigation above.</p>
              </div>
              <div className="rounded-[24px] border border-border/80 bg-background/70 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Wellness notice</p>
                <p className="mt-3 font-semibold">This app supports wellness tracking and information sharing. It is not a medical device.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h3 className="font-display text-lg font-semibold">{section.title}</h3>
                <div className="space-y-3">
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-border/80 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p>© 2026 Doctor Who. Clean, trustworthy health portal experiences for web and desktop.</p>
            <p>Soft coral and soft teal palette. Accessible in both light and dark modes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

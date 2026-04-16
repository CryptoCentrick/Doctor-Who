"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BedDouble,
  Bluetooth,
  FileBarChart2,
  Gauge,
  PanelLeft,
  Settings,
  Share2
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/reports", label: "Reports", icon: FileBarChart2 },
  { href: "/biometrics", label: "Biometrics", icon: Activity },
  { href: "/connect", label: "Connect", icon: Bluetooth },
  { href: "/sleep", label: "Sleep", icon: BedDouble },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/export", label: "Export", icon: Share2 }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 px-3 py-3 sm:px-4 lg:px-6">
        <aside
          className={cn(
            "glass-panel pattern-grid fixed inset-y-3 left-3 z-40 w-[280px] rounded-[32px] border border-white/10 p-5 text-white shadow-glow transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <Link href="/dashboard" className="space-y-1">
              <div className="font-display text-2xl font-bold tracking-tight">Doctor Who</div>
              <p className="text-sm text-slate-300">Personal health intelligence, local-first.</p>
            </Link>
            <Badge variant="success">Protected</Badge>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-white/12 text-white"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Privacy Mode</p>
            <h3 className="mt-2 font-display text-lg font-semibold">Cloud sync is optional</h3>
            <p className="mt-2 text-sm text-slate-300">
              Biometric data stays local by default, with encrypted sync available when you opt in.
            </p>
          </div>
        </aside>

        <div className="flex min-h-[calc(100vh-24px)] flex-1 flex-col lg:pl-0">
          <header className="glass-panel mb-4 flex items-center justify-between rounded-[28px] border border-white/10 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen((value) => !value)}
              >
                <PanelLeft className="size-4" />
                <span className="sr-only">Toggle navigation</span>
              </Button>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Wellness telemetry</p>
                <h1 className="font-display text-2xl font-semibold tracking-tight">Doctor Who Health Console</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline">Not a medical diagnosis</Badge>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

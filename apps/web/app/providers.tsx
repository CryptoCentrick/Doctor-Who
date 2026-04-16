"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <ServiceWorkerRegister />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}

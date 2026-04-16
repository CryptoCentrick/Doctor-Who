# Doctor Who

Doctor Who is a local-first health analytics monorepo with a Next.js 15 web app, a Tauri desktop wrapper, shared biometric/report logic, Prisma/PostgreSQL persistence, BullMQ scheduling, PDF/XLSX exports, and a mobile-friendly PWA sensor bridge foundation.

## Monorepo

`apps/web`
Next.js 15 App Router app with dashboard, reports, biometrics, connect, sleep, settings, export pages, API routes, Prisma schema/seed, PDF/XLSX exports, auth wiring, and BullMQ worker definitions.

`apps/desktop`
Tauri desktop wrapper with Rust command stubs for Bluetooth, USB, desktop metrics, notifications, and a local SQLite scaffold for desktop-first storage.

`packages/shared`
Cross-app health models, sample biometric data, report generation logic, schedules, import helpers, and score utilities.

## Features included

- Overview dashboard with all 6 health score cards and quick stats
- Searchable report library plus detailed module pages with Recharts and D3 gauge visualizations
- Live-style biometric capture console with quick scan simulation, waveform UI, and manual fallback entry
- Device connection hub for BLE, USB, wearable, and file-import workflows
- Sleep Mode UI for overnight monitoring and event review
- Settings and export pages with privacy messaging and file generation hooks
- Next.js API routes for reports, exports, imports, alerts, devices, quick scan, health check, and NextAuth
- Prisma schema for the requested health models plus NextAuth adapter tables
- Seed script with realistic 90-day sample biometric history
- BullMQ queue + worker scaffold for scheduled report generation
- PDFKit-based module templates and XLSX spreadsheet export
- Tauri desktop shell with native command stubs and SQLite migration scaffold

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the web environment file:

```bash
cp apps/web/.env.example apps/web/.env
```

On Windows PowerShell:

```powershell
Copy-Item apps/web/.env.example apps/web/.env
```

3. Start PostgreSQL and Redis:

```bash
npm run infra:up
```

4. Generate Prisma client, apply the schema, and seed the database:

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

5. Start the web app:

```bash
npm run dev:web
```

6. Start the report worker in a second terminal:

```bash
npm run worker
```

7. Register the recurring BullMQ schedules:

```bash
npm run jobs:schedule
```

8. Start the desktop wrapper when you want the Tauri shell:

```bash
npm run dev:desktop
```

## Environment variables

`DATABASE_URL`
PostgreSQL connection string for Prisma and NextAuth persistence.

`NEXTAUTH_URL`
Base URL for the Next.js app.

`NEXTAUTH_SECRET`
Session and token signing secret.

`EMAIL_SERVER`
SMTP transport for magic-link email authentication.

`EMAIL_FROM`
From address for email login links.

`GITHUB_ID` and `GITHUB_SECRET`
Optional OAuth provider configuration.

`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
BullMQ / Redis connection settings.

## Important notes

- The web app currently ships with rich demo data so the UI is populated immediately even before database wiring is turned on.
- API routes and the worker are written to fall back gracefully to shared demo data when database or Redis services are not available.
- The packaged Tauri shell includes native command scaffolding and local SQLite migrations. The development workflow wraps the real Next.js app through `devUrl`.
- Report screens include the required wellness disclaimer, and camera/microphone capture surfaces include estimate-only messaging.

## Useful commands

```bash
npm run dev:web
npm run dev:desktop
npm run worker
npm run jobs:schedule
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run infra:up
npm run infra:down
```

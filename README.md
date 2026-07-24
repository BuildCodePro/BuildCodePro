# BuildCode Pro

AI-powered fire alarm design and estimation platform for company_owners. Upload construction drawings, run NFPA 72 analysis, and receive bid-ready outputs: device recommendations, material takeoffs (BOM), compliance checklists, design narratives, and exportable PDF/CSV reports.

This repository is the **frontend** for BuildCode Pro, built with Next.js App Router. It currently uses mock authentication and static demo data while backend services (Supabase, Stripe, AI engine) are integrated per the product milestone plan.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Demo Credentials](#demo-credentials)
- [Application Routes](#application-routes)
- [New Design Wizard](#new-design-wizard)
- [Project Structure](#project-structure)
- [Architecture Notes](#architecture-notes)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Product Scope](#product-scope)

---

## Features

### Company (company_owner Admin)

Full company_owner workspace for small and medium fire alarm businesses.

| Module | Description |
|--------|-------------|
| **Dashboard** | Stats, plan usage banner, recent projects |
| **New Design** | 4-step wizard: upload → project info → AI analysis → results |
| **Projects** | Grid and list views with search and filters |
| **Project Details** | Results, version history, activity logs |
| **Team** | Invite estimators and PE reviewers, manage members |
| **Billing** | Subscription plans, usage tracking, invoices, payment method |
| **Settings** | Profile and security (password, 2FA toggle, sessions) |
| **Support** | Help articles, FAQs, ticket submission, contact support |

### Estimator

Estimation-focused workspace (no billing or team management).

- Dashboard with monthly design usage
- New Design wizard and project management
- Project details with full results tabs
- Profile, security, and support

### Engineer (PE Reviewer)

Review and approval workspace for licensed professional engineers.

- Dashboard with review queue and stats
- Projects list and project details with PE review panel
- Approve / request changes workflow and permit checklist
- Profile, security, and support

### Super Admin

Platform operator dashboard (multi-tenant SaaS administration).

- Platform overview and activity feed
- Companies and users management
- Subscriptions, usage tracking, and billing oversight
- Support ticket management

### Authentication

- Login, signup (2-step: company owner account + team invites), email verification UI
- Forgot password and reset password flows
- Role-based route guards with session persistence (`localStorage`)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Utilities | `clsx`, `tailwind-merge`, `class-variance-authority` |
| Fonts | DM Sans & Inter via `next/font` |

**Planned backend integrations** (per PRD): Supabase/PostgreSQL, JWT auth, Stripe billing, Anthropic/OpenAI for AI processing.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Unauthenticated users are redirected to `/login` when accessing protected routes.

### Production build

```bash
npm run build
npm run start
```

### Quality checks

```bash
npm run lint
npm run typecheck
```

---

## Demo Credentials

Mock users are defined in `src/lib/auth/mock-users.ts`. Use these to explore each role:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Company (company_owner) | `john@acmefire.com` | `Company@123` | `/dashboard` |
| Estimator | `sarah@acmefire.com` | `Estimator@123` | `/estimator` |
| Engineer (PE) | `mike@acmefire.com` | `Engineer@123` | `/engineer` |
| Super Admin | `admin@buildcodepro.com` | `SuperAdmin@123` | `/super-admin` |

Sessions are stored in `localStorage` under `buildcodepro-auth-session`. Clear site data or use logout to reset.

---

## Application Routes

Route constants live in `src/config/routes.ts`.

### Public / Auth

| Route | Description |
|-------|-------------|
| `/login` | Sign in |
| `/signup` | Company signup wizard (owner + team invites) |
| `/verify-email` | Email verification confirmation |
| `/forgot-password` | Request password reset |
| `/reset-password` | Set new password |

### Company (`company` role)

| Route | Description |
|-------|-------------|
| `/dashboard` | Home dashboard |
| `/new-design` | New design wizard |
| `/projects` | Projects listing |
| `/projects/[id]` | Project details |
| `/team` | Team management |
| `/billing` | Subscription and invoices |
| `/settings` | Profile and security |
| `/support` | Help center |

### Estimator (`estimator` role)

| Route | Description |
|-------|-------------|
| `/estimator` | Dashboard |
| `/estimator/new-design` | New design wizard |
| `/estimator/projects` | Projects listing |
| `/estimator/projects/[id]` | Project details |
| `/estimator/settings` | Settings |
| `/estimator/support` | Support |

### Engineer (`engineer` role)

| Route | Description |
|-------|-------------|
| `/engineer` | Dashboard (review queue) |
| `/engineer/projects` | Projects listing |
| `/engineer/projects/[id]` | Project details + PE review |
| `/engineer/settings` | Settings |
| `/engineer/support` | Support |

### Super Admin (`super_admin` role)

| Route | Description |
|-------|-------------|
| `/super-admin` | Platform dashboard |
| `/super-admin/companies` | Tenant companies |
| `/super-admin/users` | Platform users |
| `/super-admin/subscriptions` | Plans and usage |
| `/super-admin/support` | Support tickets |

---

## New Design Wizard

The core estimation workflow (`DesignWizard`) runs in four steps:

1. **Upload Drawings** — PDF, PNG, JPG, JPEG, WEBP (max 50 MB per file, multiple files)
2. **Project Info** — Name, address, jurisdiction, square footage, floors, occupancy, optional building features
3. **AI Analysis** — Simulated progress with checklist tasks
4. **Results** — Design recommendations, BOM/material takeoff, compliance checklist, design narrative, exports (PDF, CSV, print, email)

Results are also available on saved projects via the **Project Details** page (Results, History, Activity tabs).

---

## Project Structure

```
buildcodepro-FE/
├── public/
│   └── images/                 # Brand assets, project thumbnails
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login, signup, password flows
│   │   ├── (dashboard)/        # Company company_owner routes
│   │   ├── (estimator)/        # Estimator routes
│   │   ├── (engineer)/         # PE reviewer routes
│   │   ├── (super-admin)/      # Platform admin routes
│   │   ├── globals.css         # Design tokens and typography
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Redirects to dashboard
│   ├── components/
│   │   ├── auth/               # Forms, guards, signup wizard
│   │   ├── billing/            # Plans, usage, invoices
│   │   ├── dashboard/          # Shell, sidebar, stats, tables
│   │   ├── engineer/           # PE review UI
│   │   ├── estimator/          # Estimator-specific layout
│   │   ├── new-design/         # Design wizard and results panels
│   │   ├── projects/           # Project cards, list/grid, details
│   │   ├── settings/           # Profile and security panels
│   │   ├── super-admin/        # Platform administration UI
│   │   ├── support/            # Help articles, FAQs, tickets
│   │   ├── team/               # Team invites and member table
│   │   └── ui/                 # Shared primitives (Button, Card, Table, …)
│   ├── config/
│   │   ├── routes.ts           # Central route map
│   │   ├── navigation.ts       # Sidebar nav per role
│   │   ├── fonts.ts
│   │   └── site.ts
│   ├── lib/
│   │   ├── auth/               # Mock users, session helpers
│   │   ├── constants/          # Mock data and UI config
│   │   ├── data/                 # Demo datasets
│   │   ├── utils/              # Formatters and helpers
│   │   └── validations/        # Client-side form validation
│   └── types/                  # Shared TypeScript types
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json               # Path alias: @/* → src/*
└── package.json
```

---

## Architecture Notes

### Route groups and guards

Each dashboard uses a Next.js route group with a dedicated layout:

- `(dashboard)` — `RoleAuthGuard` allows `company` only → `DashboardShell`
- `(estimator)` — `estimator` role → `EstimatorShell`
- `(engineer)` — `engineer` role → `EngineerShell`
- `(super-admin)` — `super_admin` role → `SuperAdminShell`
- `(auth)` — `GuestAuthGuard` redirects authenticated users to their role dashboard

### Shared components

Role-specific shells reuse shared building blocks where possible:

- `StatsGrid`, `RecentProjectsTable` — dashboard metrics
- `DesignWizard` — company and estimator new-design flows
- `ProjectDetailsContent` — shared project details for company and estimator
- `SupportContent` — help articles, FAQs, and tickets across company_owner roles

### Data layer (current)

All project, billing, compliance, and admin data is **static mock data** under `src/lib/constants/` and `src/lib/data/`. Form submissions and wizard actions simulate success in the UI without API calls.

### Path alias

Import project modules with the `@/` prefix:

```ts
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check without emit |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Public app URL for metadata/links | `http://localhost:3000` |

Additional variables for Supabase, Stripe, and AI services will be added when backend integration is implemented.

---

## Product Scope

BuildCode Pro targets the **pre-bid estimation stage** for fire alarm company_owners. AI output accelerates BOM and compliance work but does **not** replace licensed engineering review or permit approval.

### Subscription plans (PRD)

| Plan | Price | Monthly designs |
|------|-------|-----------------|
| Starter | $99 | 5 |
| Professional | $249 | 25 |
| Enterprise | $599 | Unlimited |

### PRD modules implemented in UI

| Module | UI coverage |
|--------|-------------|
| Authentication & user management | Auth flows, team invites, role guards |
| Project management | Projects, details, search/filter, history, activity |
| AI design engine | Wizard upload, analysis, recommendations |
| Material takeoff | BOM tab in results |
| Compliance engine | Compliance checklist tab |
| Export center | PDF, CSV, print, email in exports tab |
| Subscription & billing | Plans, usage, invoices (company admin) |
| Support center | Help articles, FAQs, tickets, contact |

### Out of scope (frontend mock / future phases)

- Live Supabase auth, database, and file storage
- Stripe payment processing
- Real AI inference and async job queues
- NFPA edition / manufacturer selection in project info
- CAD file upload, permit packages, ERP integrations (Phase 2–3 roadmap)

---

## License

Private — All rights reserved.

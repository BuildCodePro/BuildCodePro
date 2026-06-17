# BuildCode Pro — Database Schema

Complete PostgreSQL schema for all platform modules (Milestones 1–5).

## Entity Relationship Overview

```
users ──┬── projects ──┬── project_buildings
        │              ├── project_drawings ── files
        │              ├── project_versions
        │              └── design_jobs ──┬── design_results
        │                                ├── device_placements
        │                                ├── bom_items
        │                                ├── bom_wiring_estimates
        │                                ├── compliance_reports ── compliance_items
        │                                └── exports ── export_emails
        ├── user_subscriptions ── invoices
        ├── usage_events
        ├── support_tickets ── ticket_replies
        └── activity_logs

Reference: nfpa_editions | manufacturers | occupancy_types | jurisdictions | device_types
Billing:    subscription_plans
Support:    faq_categories ── faqs | help_articles
Auth:       roles ── permissions | user_sessions | two_factor_auth
```

---

## Module 1 — Authentication & User Management

| Table | Purpose |
|-------|---------|
| `users` | Platform users with profile, role, email verification |
| `roles` | Admin, User, Engineer |
| `permissions` | Granular RBAC permissions |
| `role_permissions` | Role ↔ permission mapping |
| `auth_log` | Login/logout audit trail |
| `user_sessions` | Refresh token session management |
| `two_factor_auth` | 2FA secrets and backup codes |
| `notifications` | In-app user notifications |
| `files` | Cloudinary file metadata (drawings, exports, avatars) |

---

## Reference Data

| Table | Purpose |
|-------|---------|
| `nfpa_editions` | NFPA 72 editions (2016, 2019, 2022, 2025) with IBC/IFC tie-ins |
| `manufacturers` | Fire alarm manufacturers (Notifier, Edwards, etc.) |
| `occupancy_types` | IBC occupancy classifications |
| `jurisdictions` | AHJ jurisdictions with optional rule overrides (JSON) |
| `device_types` | Fire alarm device catalog for BOM and placement |

---

## Module 2 — Project Management

| Table | Purpose |
|-------|---------|
| `projects` | Project metadata (address, occupancy, NFPA edition, manufacturer preference) |
| `project_buildings` | Multi-building campus support |
| `project_drawings` | Drawing files linked to projects/buildings/floors |
| `project_versions` | Version history snapshots (JSON) |
| `activity_logs` | Audit trail for projects, designs, exports, subscriptions |

---

## Module 3 — AI Design Engine

| Table | Purpose |
|-------|---------|
| `design_jobs` | AI processing queue (status, prompt, provider, confidence) |
| `design_results` | Design narrative, summary, alternatives (JSON) |
| `device_placements` | AI-suggested device locations with confidence & explanation |

---

## Module 4 — Material Takeoff Engine

| Table | Purpose |
|-------|---------|
| `bom_items` | Bill of materials line items with quantities and costs |
| `bom_wiring_estimates` | Wiring and conduit quantity estimates |

---

## Module 5 — Compliance Engine

| Table | Purpose |
|-------|---------|
| `compliance_reports` | Overall compliance status per design job |
| `compliance_items` | Individual NFPA rule checks (pass/review/fail) |

---

## Module 6 — Export Center

| Table | Purpose |
|-------|---------|
| `exports` | PDF/CSV export records linked to design jobs |
| `export_emails` | Email sharing history for exports |

---

## Module 7 — Subscription & Billing

| Table | Purpose |
|-------|---------|
| `subscription_plans` | Starter ($99), Professional ($249), Enterprise ($599) |
| `user_subscriptions` | Active subscriptions with Stripe IDs and usage counters |
| `usage_events` | Metering for designs, exports, uploads |
| `invoices` | Billing history with Stripe invoice references |

Billing cycles supported: `MONTHLY`, `QUARTERLY`, `SEMI_ANNUAL`, `ANNUAL`

---

## Module 8 — Support Center

| Table | Purpose |
|-------|---------|
| `faq_categories` | FAQ groupings |
| `faqs` | Frequently asked questions |
| `help_articles` | Knowledge base articles |
| `support_tickets` | User support tickets |
| `ticket_replies` | Ticket conversation thread |

---

## Lookup Tables (replaces PostgreSQL ENUMs)

All former enum values are stored in dedicated lookup tables with `code`, `name`, `description`, `sort_order`, and `is_active` fields. This allows adding or modifying values without database migrations.

| Lookup Table | Used By | Example Codes |
|--------------|---------|---------------|
| `user_statuses` | `users.status_id` | ACTIVE, PENDING, BLOCKED |
| `auth_log_types` | `auth_log.type_id` | login, logout |
| `file_resource_types` | `files.resource_type_id` | image, raw, pdf |
| `project_statuses` | `projects.status_id` | DRAFT, ACTIVE, COMPLETED |
| `design_job_statuses` | `design_jobs.status_id` | QUEUED, PROCESSING, COMPLETED |
| `compliance_statuses` | `compliance_reports`, `compliance_items` | PASS, REVIEW, FAIL |
| `export_formats` | `exports.format_id` | PDF, CSV |
| `export_statuses` | `exports.status_id` | PENDING, COMPLETED |
| `billing_cycles` | `user_subscriptions`, `invoices` | MONTHLY, ANNUAL |
| `subscription_statuses` | `user_subscriptions.status_id` | ACTIVE, CANCELLED |
| `invoice_statuses` | `invoices.status_id` | DRAFT, PAID |
| `ticket_statuses` | `support_tickets.status_id` | OPEN, CLOSED |
| `ticket_priorities` | `support_tickets.priority_id` | LOW, URGENT |
| `activity_entity_types` | `activity_logs.entity_type_id` | PROJECT, DESIGN_JOB |
| `activity_actions` | `activity_logs.action_id` | CREATED, EXPORTED |
| `usage_event_types` | `usage_events.event_type_id` | DESIGN_GENERATED |
| `ai_providers` | `design_jobs.ai_provider_id` | OPENAI, ANTHROPIC |

Lookup data is seeded via `node/seeders/lookupDataSeeder.js` with stable IDs defined in `node/constants/lookup.constants.js`.

---

## Key Defaults (via lookup IDs)

| Field | Default ID | Code |
|-------|------------|------|
| `users.status_id` | 4 | PENDING |
| `projects.status_id` | 1 | DRAFT |
| `design_jobs.status_id` | 1 | QUEUED |
| `compliance_reports.overall_status_id` | 2 | REVIEW |

---

## Former Enums (removed)

PostgreSQL ENUM types have been removed. Use lookup table foreign keys instead.


## Migrations

```bash
cd node
npm run migrate_dev
```

Seeders run automatically on server start and populate roles, permissions, reference data, and admin user.

# NirmaanCloud AI Construction ERP

NirmaanCloud is a dashboard-first, mobile-ready Construction ERP product concept for Indian real estate, EPC, civil, MEP, infrastructure, interiors, builders, and PMC companies. The current workspace contains a working front-end prototype plus the implementation blueprint for a scalable cloud platform.

## Open The Prototype

Open `D:\new er\index.html` in a browser. The app is self-contained and includes dark mode, role dashboards, module filtering, global search, animated AI insights, mobile layout, PWA metadata, and drag-and-drop widgets.

## Product Surface

- Executive, Project, Finance, Site Engineer, Vendor, and Customer dashboards.
- Twenty connected ERP modules covering admin, CRM, tendering, projects, procurement, inventory, contractors, labour, plant, QA/QC, EHS, finance, HRMS, DMS, customer portal, assets, BI, workflows, mobile apps, and AI agents.
- Indian compliance and integrations including GST, e-invoice, e-way bill, Aadhaar, PAN, UPI, Razorpay, Tally, WhatsApp, maps, Microsoft 365, Google Workspace, IoT, RFID, and biometric systems.
- Automation surfaces for smart approvals, SLA escalation, OCR invoice processing, PO generation, DPR auto-drafts, vendor onboarding, and real-time notifications.

## Target Architecture

Frontend:
- Next.js, React, TypeScript, Tailwind CSS, PWA, offline storage, role-aware dashboards.
- Mobile-first app shells for management, site engineers, labour attendance, vendors, and customers.

Backend:
- NestJS modular monolith to start, split into services when tenant scale requires it.
- GraphQL for dashboard composition and REST/webhooks for integrations.
- Python AI services for OCR, forecasting, anomaly detection, document classification, and recommendation agents.

Data:
- PostgreSQL for transactional ERP records with tenant isolation.
- Redis for cache, workflow queues, session state, and real-time notification fanout.
- Object storage for drawings, contracts, photos, invoices, and OCR artifacts.
- Append-only audit/event ledger for approvals, financial changes, compliance actions, and workflow decisions.

Cloud and DevOps:
- Docker containers, Kubernetes, CI/CD, blue-green deployments, managed PostgreSQL, Redis, object storage, CDN, WAF, backup and disaster recovery.
- API-first multi-tenant architecture with encryption at rest, encryption in transit, JWT, MFA, SSO, RBAC, approval hierarchy, audit logs, and data retention policies.

## Core Event Flow

1. Lead, tender, DPR, MR, invoice, attendance, or field photo enters through web, mobile, WhatsApp, API, OCR, IoT, or portal.
2. The workflow engine validates tenant rules, routes approvals, enriches records, and prevents duplicate entry.
3. Domain modules update shared project, vendor, inventory, finance, contractor, labour, and document ledgers.
4. AI agents forecast risks, recommend actions, detect anomalies, draft reports, and trigger reminders.
5. Dashboards, mobile apps, reports, and notifications update in real time.

## Next Build Phases

1. Convert this static prototype into a Next.js TypeScript app with reusable components and route-level module pages. Complete.
2. Add NestJS services for tenants, users, projects, approvals, procurement, inventory, finance, documents, and workflows. Complete.
3. Implement PostgreSQL schema, event ledger, RBAC policies, and seed data. Started.
4. Add AI/OCR service boundaries and integration adapters for Indian compliance APIs.
5. Ship mobile PWA workflows for DPR, attendance, material issue, inspections, incidents, and approvals.

## Phase 2 API

The backend scaffold lives in `apps/api` and runs as a NestJS service.

Commands:

```bash
npm run api:dev
npm run typecheck:api
npm run api:build
```

Default API base URL:

```text
http://127.0.0.1:7001/api/v1
```

Useful seeded endpoints:

- `GET /api/v1/tenants`
- `GET /api/v1/tenants/tenant-nirmaan/dashboard/erp-home`
- `GET /api/v1/tenants/tenant-nirmaan/projects`
- `GET /api/v1/tenants/tenant-nirmaan/projects/health`
- `GET /api/v1/tenants/tenant-nirmaan/approvals`
- `PATCH /api/v1/tenants/tenant-nirmaan/approvals/apr-po-steel/decision`
- `GET /api/v1/tenants/tenant-nirmaan/procurement`
- `POST /api/v1/tenants/tenant-nirmaan/procurement/mat-tmt/draft-po`
- `GET /api/v1/tenants/tenant-nirmaan/inventory/low-stock`
- `GET /api/v1/tenants/tenant-nirmaan/finance/summary`
- `GET /api/v1/tenants/tenant-nirmaan/documents`
- `GET /api/v1/tenants/tenant-nirmaan/workflows`

## Phase 3 Foundation

Phase 3 adds the database and security foundation:

- PostgreSQL Prisma schema in `prisma/schema.prisma`
- Seed script in `prisma/seed.ts`
- Environment example in `.env.example`
- Auth API with signed token response
- Audit API and in-memory audit event capture
- RBAC-ready schema for roles, permissions, users, and approval hierarchy
- Multi-tenant schema design with `tenantId` indexes on operational records

Commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run typecheck:api
npm run api:build
```

Smoke-tested Phase 3 endpoints:

- `POST /api/v1/auth/login`
- `GET /api/v1/tenants/tenant-nirmaan/audit`

Demo login payload:

```json
{
  "tenantId": "tenant-nirmaan",
  "email": "cfo@nirmaancloud.in",
  "password": "Nirmaan@123"
}
```

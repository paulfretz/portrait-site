## Relevant Files

- `.github/workflows/ci.yml` - Main CI pipeline; update to ensure automated checks use the test database/storage.
- `.github/workflows/playwright.yml` - Playwright workflow that seeds data; must run against the test environment.
- `.github/workflows/nightly-orphan-cleanup-prod.yml` - New nightly job to audit orphaned blobs in production.
- `.github/workflows/nightly-orphan-cleanup-dev.yml` - New nightly job to audit orphaned blobs in development.
- `.github/workflows/nightly-orphan-cleanup-test.yml` - New nightly job to audit orphaned blobs in test.
- `.github/workflows/migrate-test.yml` - New workflow to auto-apply migrations to the test database.
- `.github/workflows/migrate-prod.yml` - New workflow requiring manual approval to run migrations on production.
- `.github/actions/orphan-audit/` - (Optional) Composite action housing shared audit logic for reuse across workflows.
- `scripts/orphan-audit.ts` - New script for comparing Blob objects to database references.
- `e2e/global-setup.ts` - Guardrails for Supabase project usage; ensure updates align with new environment separation.
- `.env.example`, `.env.local`, `.env.test` - Environment templates documenting prod/dev/test variables.
- `README.md` / `docs/` (e.g., `docs/github-actions-setup.md`, `docs/lighthouse-audit.md`) - Documentation updates for environment usage, deployment checklist, and owner instructions.
- `supabase/migrations/` - Migration files targeted by the new CI workflows.

### Notes

- Shared GitHub workflow logic can live in `.github/actions/` to reduce duplication.
- TypeScript utility scripts (e.g., `scripts/orphan-audit.ts`) should include unit tests if logic becomes complex.
- Use `npm test` / `npx jest` to run targeted tests for new scripts or utilities.

## Tasks

- [ ] 1.0 Stand up three Supabase + Blob environments (prod, dev, test) with documented credentials and guardrails
  - [ ] 1.1 Provision or confirm separate Supabase projects for prod, dev, and test; record project IDs.
  - [ ] 1.2 Configure Blob storage separation strategy (shared bucket with prefixes vs. per-environment tokens) and document the decision.
  - [ ] 1.3 Update `.env.example`, `.env.local`, and `.env.test` to clearly delineate prod/dev/test variables and instructions.
  - [ ] 1.4 Verify Playwright global setup (`e2e/global-setup.ts`) aborts when TEST env vars target prod resources; tighten checks if needed.
  - [ ] 1.5 Document credential management (Vercel env vars, GitHub secrets, local `.env` usage) for all three environments in README or a dedicated doc.
- [ ] 2.0 Separate storage and implement nightly orphan-audit workflows (one per environment)
  - [ ] 2.1 Build a reusable audit script (`scripts/orphan-audit.ts`) to list Blob paths and compare against DB image URLs.
  - [ ] 2.2 Create `nightly-orphan-cleanup-prod.yml` workflow (cron) that runs the audit script in dry-run mode and stores results (artifact/log).
  - [ ] 2.3 Create analogous workflows for dev and test environments with their respective credentials.
  - [ ] 2.4 Add optional delete mode or retention window logic to the audit script; leave default as dry-run.
  - [ ] 2.5 Configure notifications (email/Slack/etc.) for orphan findings and document how to review/deal with results.
- [ ] 3.0 Update CI/CD to enforce test-only databases for automated suites and gate migrations
  - [ ] 3.1 Update `.github/workflows/ci.yml` and `.github/workflows/playwright.yml` so every job uses `TEST_SUPABASE_*` and `TEST_BLOB_*` variables.
  - [ ] 3.2 Ensure Playwright auth/admin suites pass in CI using seeded test credentials (update docs/tests if necessary).
  - [ ] 3.3 Add `migrate-test.yml` workflow that applies migrations to the test DB whenever migrations change on `main`.
  - [ ] 3.4 Add `migrate-prod.yml` workflow that requires manual approval before applying migrations to production; block deploy until approved.
  - [ ] 3.5 Make deployments fail or block if the test migration workflow fails.
- [ ] 4.0 Complete deferred launch-readiness checklist (audits, device QA, deployment docs, analytics)
  - [ ] 4.1 Run Lighthouse on staging/test build; fix regressions and document scores ≥80.
  - [ ] 4.2 Run Lighthouse on production once stable; document scores/changes.
  - [ ] 4.3 Perform real-device testing (iOS + Android); log defects/fixes.
  - [ ] 4.4 Set up production Vercel env vars, Supabase prod configuration, Blob storage, email service, and confirm they match documentation.
  - [ ] 4.5 Handle deployment tasks: GitHub/Vercel integration, custom domain, DNS/SSL, analytics (GA4), monitoring (Vercel Analytics/Sentry), Supabase backups.
  - [ ] 4.6 Submit sitemaps to Google Search Console & Bing Webmaster Tools; verify indexing and Core Web Vitals.
  - [ ] 4.7 Produce owner-facing deployment and content management guides (docs/README updates).
- [ ] 5.0 Add monitoring, alerting, and owner notifications for workflows and migration status
  - [ ] 5.1 Integrate alerts (email/Slack) for nightly orphan audits and migration workflow outcomes.
  - [ ] 5.2 Configure alerts for failed CI/migration jobs (GitHub notifications or external service).
  - [ ] 5.3 Document escalation steps: how to re-run cleanup with delete mode, resolve migration failures, or contact support.


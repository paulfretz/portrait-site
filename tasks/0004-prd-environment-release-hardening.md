# PRD 0004: Environment & Release Hardening

## 1. Introduction / Overview

Now that the core site experience and gallery upgrades are live, we need to finish the operational work that keeps production safe and reliable. This PRD consolidates every deferred launch-readiness task from earlier PRDs (0001–0003) and adds new requirements for multi-environment hygiene, automated testing, and storage maintenance.

**Problem Statement:**  
Production and development currently share infrastructure, automated tests can still reach the production database if misconfigured, and we lack ongoing jobs to clean up orphaned storage assets. Deployment tasks (Lighthouse audit, device QA, owner documentation, DNS/domain setup, etc.) also remain unfinished.

**Goal:**  
Establish a three-environment workflow (prod, dev, test) with isolated databases and storage, guarantee all automated tests target the test environment, automate nightly orphan cleanup checks, and complete the outstanding launch-readiness tasks so PRDs 0001–0003 can be closed.

---

## 2. Goals

1. Provide clearly separated `prod`, `dev`, and `test` Supabase projects and Blob storage, with tooling safeguards that prevent cross-contamination.
2. Ensure all automated tests (CI and local Playwright suites) run exclusively against the test environment, while `npm run dev` uses the dev environment.
3. Add nightly GitHub workflows (one per environment) to detect and optionally remove orphaned storage objects.
4. Automate migrations in CI: apply to the test database on every merge, require manual approval before promoting migrations to production.
5. Complete remaining launch-readiness work: Lighthouse audits, production deployment tasks, device QA, owner docs, analytics/monitoring, and support tooling.

---

## 3. User Stories

- **As a developer**, I need separate credentials for dev, test, and prod so I can safely run `npm run dev` without worrying about polluting the test or production databases.
- **As the automation pipeline**, I must run all unit, integration, and Playwright tests against the test database/storage so that production data is never touched by seeds.
- **As the site owner**, I want nightly automation that identifies (and optionally removes) orphaned images so storage stays tidy and costs low.
- **As the release engineer**, I want migrations to run on test automatically and only roll into production after an explicit approval step.
- **As the photographer**, I need a deployment checklist, documentation, and analytics/monitoring so I can trust the production site after launch.

---

## 4. Functional Requirements

### 4.1 Multi-Environment Architecture

1. The system MUST provide three Supabase projects: `prod`, `dev`, and `test` (new project if needed).  
2. The system MUST configure environment files so:
   - `npm run dev` uses the **dev** Supabase project and Blob storage.  
   - `npm run test`, `npm run test:e2e`, and all CI workflows use the **test** Supabase project and Blob storage.  
   - The deployed site uses the **prod** project.  
3. The system MUST add runtime guardrails that exit immediately if any test seed script detects a production project ID or URL.
4. The system MUST document credential management (where keys live in Vercel, GitHub, local `.env` files) for all three environments.

### 4.2 Storage Separation & Orphan Cleanup

5. The system MUST choose an approach for Blob storage separation (prefixed buckets vs. per-environment tokens) and implement it consistently across all environments.  
6. The system MUST add nightly GitHub workflows—**one per environment**—that:  
   - List storage objects for that environment.  
   - Compare against database references.  
   - Report orphaned assets (and optionally delete them after a configurable retention period).  
7. The workflow MUST support dry-run mode by default, with a configuration switch to delete verified orphans.

### 4.3 CI/CD & Automated Testing

8. The system MUST update CI workflows so all automated tests run on push/pull request against the **test** database and storage.  
9. The system MUST ensure authentication Playwright suites (admin login, inline editing, etc.) pass using test credentials seeded during global setup.  
10. The system MUST document how to point local Playwright runs at the test environment (e.g., `.env.test`, npm script).  
11. The system MUST add a migration workflow that:
    - Automatically runs `supabase db push` (or equivalent SQL) against the **test** project whenever migrations change on `main`.  
    - Requires manual approval before applying the same migrations to **prod**.  
    - Blocks deployment if migrations fail on test.

### 4.4 Launch Readiness & QA (Deferred Items)

12. The system MUST incorporate the outstanding tasks from PRD 0001 and PRD 0002 into the release checklist, including:  
    - Lighthouse audits (staging/test and production).  
    - Mobile device testing on iOS and Android hardware.  
    - Production deployment steps (Vercel env vars, Supabase prod configuration, Blob storage setup, domain/DNS/SSL, analytics, monitoring, backups).  
    - Owner documentation (deployment guide, content management guide).  
    - Search Console submissions and post-launch Core Web Vitals verification.  
13. The system MUST track these items as part of this PRD (so the earlier PRDs can be archived as complete).  
14. The system MUST generate an updated deployment checklist that the owner can follow before going live.

### 4.5 Monitoring & Alerts

15. The system MUST configure error/uptime monitoring (e.g., Vercel Analytics, Sentry) for production.  
16. The system SHOULD notify the owner (email or Slack) when nightly workflows detect orphaned assets or when migrations fail on test.

---

## 5. Non-Goals (Out of Scope)

1. Reworking gallery layouts or image presentation (handled in PRD 0002/0003).  
2. Adding new content types or admin UI features.  
3. Building a full staging site beyond the defined `dev` environment.  
4. Automated rollback of migrations (manual intervention is acceptable).

---

## 6. Design Considerations (Optional)

- Use GitHub Actions for nightly cron jobs and migration workflows (we already rely on GitHub CI).  
- Use a shared workflow template if multiple per-environment jobs would otherwise duplicate logic.  
- Provide comprehensive README updates describing environment usage.

---

## 7. Technical Considerations

- Supabase quotas: confirm the plan includes enough projects and backups (prod, dev, test).  
- Vercel Blob billing: weigh prefixed paths vs. separate stores for cost and simplicity.  
- Secrets management: use Vercel’s environment variables and GitHub encrypted secrets; avoid storing prod keys locally.  
- Playwright global setup already guards against prod URLs—extend it to validate environment names explicitly.

---

## 8. Success Metrics

1. `npm run test`, `npm run test:e2e`, and CI workflows execute exclusively against the test DB/storage.  
2. Nightly GitHub workflows run successfully for prod, dev, and test, and produce reports on orphaned objects.  
3. All outstanding checklist items from PRDs 0001 and 0002 are marked complete within this PRD.  
4. Migrations run automatically on test after every merge, and production migrations require approved manual promotion.  
5. Lighthouse scores ≥80 and Core Web Vitals pass for both test/staging and production builds.

---

## 9. Open Questions

1. What naming convention should we use for the new Supabase and Blob resources (e.g., `portrait-site-dev`, `portrait-site-test`)?  
2. Should the nightly cleanup jobs auto-delete orphans after a grace period, or leave that as a manual step?  
3. Which notification channel should receive workflow results (email, Slack, SMS)?  
4. Do we want deployment pipelines to block until Lighthouse thresholds are met, or simply report failures?



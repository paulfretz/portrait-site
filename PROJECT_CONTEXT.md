# Project Context

This file should be created as `PROJECT_CONTEXT.md` in the root of each repository to provide agents with essential project information.

## Project Overview

### Basic Information
- **Project Name**: DJ Coveno Portraits
- **Description**: A modern, SEO-optimized portrait photography website for Montana-based photographer DJ Coveno. Built with Next.js, TypeScript, and Tailwind CSS, with admin tools for galleries, categories, and inline content editing.
- **Repository**: [GitHub - portrait-site] (private; see local path `/Users/paulfretz/personal-workspace/portrait-site`)
- **Primary Language(s)**: TypeScript, JavaScript, SQL, CSS
- **Framework(s)**: Next.js 14+ (App Router), React 18, Tailwind CSS
- **Last Updated**: December 2025

### Architecture
- **Type**: Web app (SSR/ISR with API routes) + Admin UI
- **Architecture Pattern**: Modular monolith with App Router; RESTful route handlers; SSR data-fetch on server components, client components for editing
- **Database**: Supabase PostgreSQL (production project `nmgptiywaefuvvatlcah`, test project `viqvpxipqmkswpflpqfx`)
- **Infrastructure**: Vercel (hosting/CDN), Supabase (DB/Auth), Vercel Blob (image storage)
- **Key Services**: Authentication (Supabase Auth + Google OAuth), Galleries/Categories CRUD, Image upload/optimization, Inline editing, Contact/Inquiries, SEO/Structured data

## Development Environment

### Prerequisites
- **Node/Python/etc Version**: Node.js 20+
- **Package Manager**: npm
- **Required Tools**: Git, Supabase CLI (optional/local), Docker Desktop (optional for local Supabase), OpenSSL (system), Playwright browsers (auto-installed)
- **Environment Variables**: Key env vars (see below and `.env.example`)
  - Production: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_ADMIN_EMAIL`
  - Test/E2E: `TEST_SUPABASE_URL`, `TEST_SUPABASE_ANON_KEY`, `TEST_SUPABASE_SERVICE_ROLE_KEY`, `TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD`

### Setup Commands
```bash
# Installation
npm install

# Development server
npm run dev
# Open http://localhost:3000

# Build process
npm run build
npm run start

# Lint / format / typecheck
npm run lint
npm run lint:fix
npm run format
npm run format:check
npx tsc --noEmit

# Test execution
npm test                 # Jest (unit/integration)
npm run test:e2e         # Playwright E2E (all browsers)
npm run test:e2e:ui      # Playwright UI mode
npm run test:coverage    # Coverage report
npm run test:all         # All tests
```

## Project Conventions

### Code Standards
- **Linting**: ESLint + Prettier (run `npm run lint` / `npm run format`)
- **Testing**: Jest + React Testing Library (unit/integration), Playwright (E2E) with global setup and test DB seeding
- **Documentation**: Markdown in `README.md`, `tasks/SESSION-LOG.md`, `docs/*`, `e2e/README.md`.
- **Git Flow**: One parent task per feature branch (e.g., `task-10.0-testing-suite`); PR to `main` after completing; wait for review/merge before marking parent task complete. Conventional commits recommended.

### File Structure
```
portrait-site/
├── app/                      # Next.js App Router (pages, layouts, API)
├── components/               # UI components (layout, home, gallery, admin, contact, ui)
├── lib/                      # supabase, auth, db, utils, hooks, seo
├── __tests__/                # Jest unit/integration tests
├── e2e/                      # Playwright tests, global-setup, auth.setup
├── docs/                     # Project docs (coverage, GSC, lighthouse, schema)
├── tasks/                    # PRDs, task lists, session log
├── public/                   # Static assets (icons, manifest)
└── supabase/                 # migrations/, config, seed SQL
```

### Naming Conventions
- **Files**: kebab-case for files; PascalCase for React components
- **Functions**: descriptive verb phrases (TypeScript typed)
- **Variables**: descriptive noun phrases; avoid abbreviations; no 1–2 letter names
- **Components**: PascalCase; props typed; client vs server components separated by usage

## Business Context

### Domain
- **Industry**: Photography portfolio + lead generation
- **Target Users**: Prospective clients in Montana (Big Sky, Bozeman, Yellowstone), site owner (admin)
- **Core Business Logic**: Display high-quality galleries; manage categories/galleries/images; collect inquiries; edit marketing content inline
- **Compliance Requirements**: Handle PII (inquiries) with care; email delivery compliance; SEO best practices

### Key Features
- Galleries & Categories: CRUD, drag-and-drop ordering, cover images, mobile masonry + desktop justified layouts
- Image Upload & Optimization: Vercel Blob storage, sharp-based variants (thumbnail/medium/large/xlarge/original), WebP/AVIF, blur placeholders
- Authentication & Admin: Google OAuth via Supabase, protected routes via middleware, admin toolbar, inline editing

### Critical Paths
- Public browse: Home → Galleries → Category → Gallery → Lightbox
- Lead capture: Contact form submission → Email notification
- Admin workflows: Login → Manage categories/galleries/images → Edit page content inline

## Technical Constraints

### Performance Requirements
- **Response Time**: Good TTFB under Vercel; LCP optimized via hero image priority and blur placeholders
- **Throughput**: Low to moderate (portfolio site), CDN-backed images
- **Availability**: Vercel/Supabase SLAs; no single-region lock-in
- **Scalability**: Scales via Vercel CDN, serverless functions; DB scale via Supabase

### Security Requirements
- **Authentication**: Supabase Auth (Google OAuth)
- **Authorization**: Middleware-protected admin routes; RLS in DB (bypassed only in test seeding)
- **Data Protection**: Supabase-managed; avoid exposing PII; email notifications via Resend
- **Audit Requirements**: Request logs via Vercel/Supabase dashboards; CI logs in GitHub Actions

### Integration Points
- **External APIs**: Supabase (DB/Auth/REST), Vercel Blob (images), Resend (email)
- **Internal Services**: Next.js route handlers for CRUD
- **Webhooks**: None currently
- **Message Queues**: None

## Operational Context

### Deployment
- **Environments**: Dev (local), CI (GitHub Actions), Prod (Vercel)
- **CI/CD Pipeline**: Lint/test/build in CI; Playwright on PR; migration workflow documented; deploy to Vercel on push to main
- **Infrastructure**: Vercel serverless + CDN; Supabase Postgres; Vercel Blob storage
- **Monitoring**: Vercel analytics/logs; Lighthouse manual runs (docs/lighthouse-audit.md); Search Console docs

### Team Structure
- **Team Size**: Small (owner + AI pair programming)
- **Roles**: Full-stack dev, testing/QA, DevOps/CI via GitHub Actions
- **Communication**: Session tracked in `tasks/SESSION-LOG.md`; process rules in `.cursor/rules/*`
- **Decision Making**: User approval required per subtask; strict adherence to process

### Known Issues
- **Technical Debt**: Supabase types generation pending; some `@ts-ignore` in queries; manual migrations historically (now documented automation)
- **Performance Bottlenecks**: Large image processing may need tuning for serverless limits
- **Browser/Platform Limitations**: WebKit E2E edge cases (timing/navigation); robust selectors and waits added
- **External Dependencies**: Reliance on Supabase availability and Vercel Blob
- **Test Status**: 515/544 E2E tests passing (94.7%), 29 failures remain (mostly timing/selector issues)

## Agent-Specific Guidance

### Common Tasks
- Build UI components with Tailwind and Next/Image
- Add/modify API route handlers with Zod validation
- Update DB queries in `lib/db/queries.ts` and types in `lib/db/types.ts`
- Write/adjust Jest or Playwright tests; keep selectors robust; seed DB via `e2e/global-setup.ts`

### Gotchas and Pitfalls
- Never call server-only helpers (`next/headers`, Supabase server client) from client components
- Keep env var access correct: client needs `NEXT_PUBLIC_*`
- Respect RLS; use admin client only in test setup paths
- WebKit: prefer `domcontentloaded` + short waits, `.first()` to avoid strict mode violations

### Success Patterns
- Server components fetch data; pass to client components for interactivity
- Image pipeline: store original + optimized variants; use blur placeholders
- Testing: decouple unauth vs auth suites; use global seeding; handle empty states gracefully in tests

## Auto-Discovery Hints

### Framework Detection
- **Package Files**: `package.json` (Next.js, Playwright, Jest), `tsconfig.json`
- **Config Files**: `next.config.js`, `playwright.config.ts`, `jest.config.js`, `.eslintrc.*`
- **Directory Patterns**: `app/`, `components/`, `lib/`, `__tests__/`, `e2e/`, `tasks/`, `docs/`

### Tool Integration
- **Linting Config**: `.eslintrc.*`, Prettier via package scripts
- **Test Config**: `jest.config.js`, `jest.setup.js`, `playwright.config.ts`, `e2e/global-setup.ts`
- **Build Config**: `next.config.js`, `tailwind.config.ts`, `postcss.config.mjs`
- **CI/CD Config**: `.github/workflows/*.yml` (CI, Playwright, migrations)

---

## Usage Instructions

1. **Initial Setup**: Ensure this template is present as `PROJECT_CONTEXT.md` in the repository root
2. **Customize**: Sections above are populated from current project docs and should be maintained
3. **Maintain**: Update as the project evolves; especially after parent tasks complete
4. **Agent Integration**: Agents will read this for context and process rules
5. **Validation**: Run lint/tests/tsc and update `tasks/SESSION-LOG.md` before commits per process rules

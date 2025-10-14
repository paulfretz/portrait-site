# 🎯 DJ Coveno Portraits - AI Development Guide

**Last Updated:** October 10, 2025  
**Project:** Montana Portrait Photography Website  
**Framework:** Next.js 14+ with TypeScript, Tailwind CSS, Supabase

---

## 🚨 CRITICAL: Process Rules (READ FIRST)

### **Rule #0: UPDATE SESSION-LOG.md BEFORE EVERY COMMIT (NEVER SKIP)**
**This is the MOST violated rule - it is MANDATORY, not optional!**

- Update `tasks/SESSION-LOG.md` AFTER completing work, BEFORE running `git commit`
- Verify ALL 13 sections systematically (see Rule #4 for details)
- This happens BEFORE marking task [x], BEFORE committing
- If you skip this, you are breaking the entire workflow
- **NO EXCEPTIONS - This rule applies to EVERY single commit**

### **Rule #0.5: TEST-DRIVEN DEVELOPMENT (TDD) - ALL TESTS MUST PASS + COVERAGE**
**Before proceeding to the next task, ALL tests must pass AND coverage must be maintained!**

- After implementing ANY change, run the full test suite
- If tests fail:
  - Fix the tests if they're outdated
  - Fix the code if it's the issue (use industry-standard solutions)
  - **DO NOT proceed to next task until ALL tests pass**
- **Code Coverage Requirements:**
  - Run `npm run test:coverage` periodically (especially for new components/utilities)
  - **Critical components (user-facing, business logic):** Target 80%+ coverage
  - **Utility functions:** Target 80%+ coverage
  - **Server components / API routes:** E2E coverage may be sufficient
  - **If coverage drops significantly:** Add tests before proceeding
- This applies to: Unit tests, Integration tests, E2E tests, TypeScript, Linter, Coverage
- **"Even if tests or code fail" clause:**
  - If test fails due to outdated expectations → fix the test
  - If code fails due to poor implementation → fix the code using industry-standard solutions
  - If coverage is low on critical code → write tests before proceeding
  - NEVER skip tests or proceed with failing tests
  - NEVER use hacks or workarounds to make tests pass
  - Quality over speed - do it right the first time

### **Rule #1: One Sub-Task at a Time**
- **NEVER** start the next sub-task until you ask the user for permission
- After completing a sub-task: **STOP** and ask "May I proceed with Task X.X?"
- Wait for user to say "yes", "y", or similar before continuing
- **This is the most important rule - violating it breaks the entire workflow**

### **Rule #2: Git Branching Strategy**
- Each parent task gets its own feature branch: `task-X.0-short-description`
- Example: `task-10.0-testing-suite`
- When starting a new parent task:
  1. Create and checkout new branch from `main`
  2. Work on all subtasks in this branch
  3. Commit subtask completions as you go
- When parent task is complete:
  1. Run tests, clean up, make final commit
  2. Push branch to origin
  3. Create Pull Request (PR) to `main`
  4. Wait for user to review and merge PR
  5. Then mark parent task as `[x]`

### **Rule #3: Completion Protocol (PRE-COMMIT CHECKLIST)**
After finishing a sub-task, follow this EXACT sequence:

**🚨 PRE-COMMIT CHECKLIST (MANDATORY - DO NOT SKIP ANY STEP):**
1. ✅ **Run linter** (`npm run lint`) and fix any errors - **MUST PASS** before Step 2
2. ✅ **Run all tests** (`npm test`) and ensure they all pass - **MUST PASS** before Step 3
   - **TDD Rule #0.5**: If tests fail, STOP and fix them (or the code) before continuing
   - Fix tests if outdated, fix code using industry-standard solutions if broken
   - NEVER proceed with failing tests - Quality over speed!
3. ✅ **Run TypeScript** (`npx tsc --noEmit`) and fix any errors - **MUST PASS** before Step 4
4. ✅ **UPDATE SESSION-LOG.md** - Verify ALL 13 sections (see Rule #4) - **MANDATORY (Rule #0)**
5. ✅ **Mark task [x]** in task list file
6. ✅ **Update TODO list** using todo_write tool
7. ✅ **Stage changes** (`git add`)
8. ✅ **Commit** with descriptive conventional commit message
9. ✅ **STOP** and ask user: "May I proceed with Task X.X?"
10. ⏸️ **WAIT** for user approval before continuing

**Critical Violations:**
- **If you skip Step 4 (SESSION-LOG update), you are violating Rule #0!**
- **If you proceed with failing tests in Step 2, you are violating Rule #0.5 (TDD)!**

If all subtasks under a parent task are `[x]`:
1. Run full test suite (`npm test`)
2. Only if tests pass: stage changes (`git add .`)
3. Clean up temporary files
4. Commit with conventional commit format
5. Push feature branch to origin
6. Wait for user to merge PR before marking parent `[x]`

### **Rule #4: Session Log Maintenance (CRITICAL)**
**After EVERY sub-task, verify and update ALL 13 sections:**

1. **📋 Current Status** - Task number, progress %, last completed, next subtask
2. **🎯 PRD Context** - Project objective, tech stack, success criteria
3. **✅ Completed Tasks** - Add new subtask with description
4. **🔧 Technical Decisions** - Architecture choices, libraries, patterns
5. **🚨 Manual Actions Required** - Move completed to "Completed", add new ones
6. **📦 Key Files Created** - Add new files, organize by category
7. **🔥 Technical Debt** - Workarounds, "TODO later" items
8. **🎯 What's Working** - Update functionality lists
9. **🚀 Quick Start** - Current directory, test commands, process rules
10. **📊 Commit History** - Add commit when parent task completes
11. **🔄 Remaining Tasks** - Update progress counts
12. **💡 Known Issues** - Remove resolved, add new
13. **🎯 Context for Next Session** - Current task, what's done, what's next

**Validation Questions (ask yourself):**
- If context window reset RIGHT NOW, could someone continue seamlessly? **YES / NO**
- Are all sections dated to TODAY's work? **YES / NO**
- Is anything outdated or stale? **YES / NO**
- Does "Context for Next Session" match current reality? **YES / NO**

**If any answer is NO, update that section immediately!**

### **Rule #5: Manual Actions**
When user needs to manually configure something:
- Clearly call out with header: "🎯 What YOU Need to Do:" or "⚠️ Manual Action Required:"
- Provide exact steps and examples
- Mark as **BLOCKING** or **NON-BLOCKING**
- If BLOCKING and next task depends on it: **STOP and wait for confirmation**
- Track in SESSION-LOG.md "Manual Actions Required" section

### **Rule #6: No Assumptions**
- Don't assume user has completed manual actions unless they confirm
- Don't skip ahead to dependent tasks
- Don't mark tasks complete without implementing them
- Don't create files without user approval

---

## 📋 Project Context

### **Project Objective**
Build a professional, mobile-responsive portrait photography website for DJ Coveno Portraits, a Montana-based photographer. Portfolio showcase + business inquiry platform.

### **Key Success Criteria**
1. Visual Excellence - Full-screen gallery displays
2. SEO - First page Google for "wedding photographer [Montana city]"
3. Admin Simplicity - No coding knowledge required
4. Cost - <$10/month operational costs
5. Mobile-First - 60%+ mobile traffic
6. Performance - Lighthouse 90+, Core Web Vitals passing
7. Quality - 80%+ test coverage

### **Tech Stack**
- **Framework:** Next.js 14+ App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS (sage green #8B9D83)
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth + Google OAuth
- **Storage:** Vercel Blob
- **Email:** Resend
- **Testing:** Jest + React Testing Library + Playwright
- **Deployment:** Vercel

### **Design Philosophy**
- Minimal/Clean aesthetic
- Large whitespace
- Sage green accent (#8B9D83)
- Light font weights for headings
- Mobile-first responsive design

---

## 📁 Key Files & Locations

### **Process & Planning**
- `.cursor/rules/process-task-list.md` - How we work (THIS FILE IS LAW)
- `.cursor/rules/session-log-checklist.md` - 13-section verification checklist
- `tasks/0001-prd-portrait-photography-site.md` - Original PRD
- `tasks/tasks-0001-prd-portrait-photography-site.md` - Task checklist (mark [x] here)
- `tasks/SESSION-LOG.md` - Detailed progress log (UPDATE AFTER EVERY SUBTASK)
- `STATUS.md` - Quick status snapshot
- `CLAUDE.md` - This file (consolidated guide)

### **Code Structure**
```
portrait-site/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── galleries/               # Gallery pages
│   ├── about/                   # About page
│   ├── contact/                 # Contact page
│   ├── admin/                   # Admin dashboard
│   └── api/                     # API routes
├── components/                   # React components
│   ├── layout/                  # Header, Footer
│   ├── home/                    # Homepage components
│   ├── gallery/                 # Gallery components
│   ├── contact/                 # Contact form
│   ├── admin/                   # Admin components
│   └── ui/                      # Reusable UI components
├── lib/                         # Library code
│   ├── supabase/               # Supabase clients
│   ├── auth/                   # Authentication logic
│   ├── db/                     # Database types & queries
│   ├── utils/                  # Utility functions
│   ├── hooks/                  # Custom React hooks
│   └── seo/                    # SEO utilities
├── __tests__/                   # Unit & integration tests
├── e2e/                         # End-to-end tests
├── tasks/                       # Project documentation
└── public/                      # Static assets
```

### **Database Schema**
5 tables in Supabase:
1. `categories` - Portfolio categories (Weddings, Portraits, etc.)
2. `galleries` - Individual photo galleries
3. `images` - Gallery images with metadata
4. `inquiries` - Contact form submissions
5. `page_content` - Editable page content (homepage, about, contact)

See `docs/database-schema.md` for full schema details.

---

## 🎯 Current Status

**Current Branch:** `task-10.0-testing-suite`  
**Current Task:** Task 10.0 - Testing Suite (4/23 subtasks complete, 17%)  
**Last Completed:** Task 10.4 - GalleryGrid unit tests  
**Next Subtask:** Task 10.5 - Contact Form unit tests (AWAITING PERMISSION)

**Overall Progress:** 9 of 11 parent tasks complete (82%)

**Completed Parent Tasks:**
- ✅ Task 1.0 - Project Setup
- ✅ Task 2.0 - Authentication & Authorization
- ✅ Task 3.0 - Database Schema & API Layer
- ✅ Task 4.0 - Gallery & Category Management
- ✅ Task 5.0 - Image Upload & Optimization
- ✅ Task 6.0 - Frontend User Interface
- ✅ Task 7.0 - Admin Dashboard & Inline Editing
- ✅ Task 8.0 - Contact/Inquiry System
- ✅ Task 9.0 - SEO Optimization & Metadata

**In Progress:**
- 🔄 Task 10.0 - Testing Suite (4/23 complete)

**Remaining:**
- ⬜ Task 11.0 - Deployment & Production Configuration

---

## 🧪 Testing Commands

```bash
# Unit tests (Jest + React Testing Library)
npm test                          # Run all unit tests
npm test -- __tests__/path        # Run specific test file
npm run test:watch                # Watch mode
npm run test:coverage             # Coverage report

# E2E tests (Playwright)
npm run test:e2e                  # Run E2E tests
npm run test:e2e:ui               # Run with UI
npm run test:all                  # Run all tests

# Development
npm run dev                       # Start dev server
npm run build                     # Build for production
npm run lint                      # Run linter
```

---

## 🚨 Known Issues & Technical Debt

### **Issue #1: Hero Photo Management** (HIGH)
- No admin UI to manage homepage slideshow images
- Currently hardcoded Unsplash URLs
- Needs: Database table, API routes, admin component
- Status: Documented, deferred to separate branch

### **Issue #2: Image Quality** (CRITICAL)
- Uploaded images may appear blurry
- Dimensions might not be correct
- Potential issues: JPEG quality (85), wrong URL stored, no srcset
- Status: Documented, deferred to separate branch

### **Technical Debt:**
1. **Supabase Type Inference** - Using `@ts-ignore` workarounds in `lib/db/queries.ts`
   - Will fix in Task 10.22 with CLI-generated types
2. **Manual Migrations** - Currently manual via Supabase dashboard
   - Will automate in Task 10.22-10.23 (Supabase CLI + GitHub Actions)

---

## 🎯 What's Working Right Now

### **Authentication**
- ✅ Google OAuth sign-in at `/login`
- ✅ Protected routes with middleware
- ✅ Admin toolbar when logged in
- ✅ Login/logout flow complete

### **Database**
- ✅ 5 tables live in Supabase
- ✅ 7 categories seeded
- ✅ Row-Level Security active
- ✅ All migrations applied

### **APIs (REST)**
- ✅ Categories CRUD (5 endpoints)
- ✅ Galleries CRUD (6 endpoints)
- ✅ Images CRUD (3 endpoints)
- ✅ Inquiries CRUD (3 endpoints)
- ✅ Content management (3 endpoints)
- ✅ Privacy: client_name never exposed publicly

### **Admin Features**
- ✅ Category manager with drag-and-drop reordering
- ✅ Gallery manager with create/edit/delete
- ✅ Image uploader with optimization (sharp)
- ✅ Gallery editor with image management
- ✅ Inline content editing (InlineEditor, RichTextEditor)
- ✅ Edit mode toggle in admin toolbar
- ✅ Dashboard with stats and quick actions
- ✅ Inquiry management dashboard

### **Public Site**
- ✅ Homepage with hero slideshow
- ✅ Gallery browsing by category
- ✅ Individual gallery pages with lightbox
- ✅ About page with inline editing
- ✅ Contact page with form
- ✅ Responsive header and footer
- ✅ Mobile-first design

### **SEO & Performance**
- ✅ Dynamic page titles and meta descriptions
- ✅ Open Graph and Twitter Card tags
- ✅ Structured data (JSON-LD) for all pages
- ✅ Dynamic sitemap generation
- ✅ robots.txt configuration
- ✅ Canonical URLs on all pages
- ✅ PWA manifest
- ✅ Core Web Vitals optimizations
- ✅ Semantic HTML with proper heading hierarchy

### **Testing**
- ✅ Jest configured for unit tests
- ✅ React Testing Library set up
- ✅ Playwright configured for E2E tests
- ✅ Test utilities and mocks created
- ✅ GitHub Actions workflow for Playwright
- ✅ GalleryGrid component tests (22/22 passing)

---

## 🚀 Quick Start for New Context Window

### **If You're Starting Fresh:**

1. **Read this file first** (`CLAUDE.md`)
2. **Check current task** in `tasks/tasks-0001-prd-portrait-photography-site.md`
3. **Read SESSION-LOG.md** for detailed context
4. **Check current branch:** `git branch` (should be on `task-10.0-testing-suite`)
5. **Run dev server if needed:** `npm run dev`
6. **Follow Rule #1:** One sub-task at a time, ask permission before proceeding

### **Current Working Directory:**
```bash
/Users/paulfretz/personal-workspace/portrait-site
```

### **Environment:**
- Node.js 20+
- npm packages installed
- `.env.local` configured (Supabase, Vercel Blob, Resend)
- Database migrated and seeded

### **Next Action:**
**STOP and ask user:** "Task 10.4 is complete. May I proceed with Task 10.5 (Contact Form unit tests)?"

---

## 📚 Manual Actions Required

### **Completed:**
- ✅ Supabase project created
- ✅ Google OAuth configured
- ✅ Database migration run
- ✅ Admin email added to `.env.local`
- ✅ Vercel Blob token added
- ✅ Resend API key added

### **Pending (NON-BLOCKING):**
- 📋 Task 9.18 - Run Lighthouse audit (user will do later)
- 📋 Task 9.20 - Google Search Console setup (documentation only, pending deployment)

---

## 💡 Tips for Success

1. **Always follow Rule #1** - One sub-task at a time, ask permission
2. **Update SESSION-LOG.md after EVERY subtask** - All 13 sections
3. **Mark tasks [x] immediately** when complete
4. **Commit frequently** with descriptive messages
5. **Run tests before marking parent tasks complete**
6. **Don't skip ahead** - wait for user approval
7. **Document technical decisions** as you make them
8. **Track manual actions** in SESSION-LOG.md
9. **Use conventional commit format** (feat:, fix:, test:, docs:, etc.)
10. **Keep branches focused** - one parent task per branch

---

## 🔗 Important Links

- **PRD:** `tasks/0001-prd-portrait-photography-site.md`
- **Task List:** `tasks/tasks-0001-prd-portrait-photography-site.md`
- **Session Log:** `tasks/SESSION-LOG.md`
- **Process Rules:** `.cursor/rules/process-task-list.md`
- **Database Schema:** `docs/database-schema.md`
- **README:** `README.md`

---

## 🎯 Remember

**The #1 rule that must NEVER be violated:**

> **After completing a sub-task, STOP and ask the user for permission before starting the next one.**

This is not optional. This is the core of the workflow. Violating this breaks everything.

**Current Status:** Task 10.4 complete, awaiting permission to start 10.5.

---

**Built with ❤️ for Montana portrait photography**


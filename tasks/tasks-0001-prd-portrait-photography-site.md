# Task List: Montana Portrait Photography Site (DJ Coveno Portraits)

**Based on:** `0001-prd-portrait-photography-site.md`  
**Status:** Phase 1 - Parent Tasks Generated  
**Last Updated:** September 30, 2025

---

## Current State Assessment

- **Existing Codebase:** Greenfield project (empty repository)
- **Architecture Decision:** Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL) for cost optimization and ease of use
- **Authentication:** Supabase Auth with Google OAuth
- **Image Storage:** Vercel Blob Storage or Cloudflare R2
- **Hosting:** Vercel (free tier suitable for low traffic)
- **Design:** Minimal/Clean with sage green accent, sans-serif typography

---

## Relevant Files

### Core Configuration

- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration for images, environment, and build settings
- `tailwind.config.ts` - Tailwind CSS configuration with custom sage green accent and design tokens
- `.env.local` - Local environment variables (not committed)
- `.env.example` - Environment variable template for documentation

### Authentication & Supabase

- `lib/supabase/client.ts` - Supabase client initialization
- `lib/supabase/server.ts` - Server-side Supabase client for API routes
- `lib/auth/auth-context.tsx` - React context for authentication state
- `lib/auth/auth-provider.tsx` - Authentication provider component
- `middleware.ts` - Next.js middleware for protected routes
- `app/api/auth/callback/route.ts` - OAuth callback handler
- `app/api/auth/logout/route.ts` - Logout API route

### Database & API

- `supabase/migrations/001_initial_schema.sql` - Database schema (categories, galleries, images, inquiries, content)
- `lib/db/types.ts` - TypeScript types for database models
- `lib/db/queries.ts` - Database query functions
- `app/api/categories/route.ts` - Categories API endpoints
- `app/api/categories/[id]/route.ts` - Individual category operations
- `app/api/galleries/route.ts` - Galleries API endpoints
- `app/api/galleries/[id]/route.ts` - Individual gallery operations
- `app/api/images/upload/route.ts` - Image upload handler
- `app/api/inquiries/route.ts` - Inquiry submission and retrieval
- `app/api/content/route.ts` - Page content management

### Components - Public Site

- `components/layout/Header.tsx` - Site header with navigation
- `components/layout/Footer.tsx` - Site footer with contact info and social links
- `components/home/HeroSlideshow.tsx` - Full-screen homepage slideshow
- `components/gallery/GalleryGrid.tsx` - Gallery grid display
- `components/gallery/GalleryLightbox.tsx` - Lightbox/modal for full-size images
- `components/gallery/CategoryNav.tsx` - Category navigation
- `components/contact/ContactForm.tsx` - Contact/inquiry form
- `components/ui/Button.tsx` - Reusable button component
- `components/ui/Input.tsx` - Form input component
- `components/ui/Select.tsx` - Dropdown select component

### Components - Admin

- `components/admin/AdminToolbar.tsx` - Persistent admin toolbar when logged in
- `components/admin/InlineEditor.tsx` - Inline text editing component
- `components/admin/RichTextEditor.tsx` - Rich text editor for descriptions
- `components/admin/ImageUploader.tsx` - Multi-image upload component
- `components/admin/GalleryManager.tsx` - Gallery CRUD interface
- `components/admin/CategoryManager.tsx` - Category management
- `components/admin/InquiryDashboard.tsx` - Inquiry management dashboard
- `components/admin/SortableList.tsx` - Drag-and-drop reordering component

### Pages

- `app/page.tsx` - Homepage with hero slideshow
- `app/galleries/page.tsx` - All galleries overview
- `app/galleries/[category]/page.tsx` - Category-specific gallery listing
- `app/galleries/[category]/[slug]/page.tsx` - Individual gallery page
- `app/about/page.tsx` - About page with inline editing
- `app/contact/page.tsx` - Contact page
- `app/admin/page.tsx` - Admin dashboard
- `app/admin/galleries/page.tsx` - Gallery management page
- `app/admin/categories/page.tsx` - Category management page
- `app/admin/inquiries/page.tsx` - Inquiries dashboard
- `app/login/page.tsx` - Login page

### Utilities & Helpers

- `lib/utils/image-optimizer.ts` - Image optimization utilities
- `lib/utils/seo.ts` - SEO helper functions for meta tags and structured data
- `lib/utils/validation.ts` - Form validation schemas (Zod)
- `lib/utils/cn.ts` - Tailwind className utility
- `lib/hooks/useAuth.ts` - Authentication hook
- `lib/hooks/useInlineEdit.ts` - Inline editing hook
- `lib/hooks/useGalleries.ts` - Gallery data fetching hook

### SEO & Config

- `app/sitemap.ts` - Dynamic sitemap generation
- `app/robots.ts` - Robots.txt generation
- `public/manifest.json` - Web app manifest
- `lib/seo/structured-data.ts` - JSON-LD structured data generators

### Testing

- `jest.config.js` - Jest configuration
- `playwright.config.ts` - Playwright E2E test configuration
- `__tests__/components/GalleryGrid.test.tsx` - Gallery grid component tests
- `__tests__/components/ContactForm.test.tsx` - Contact form tests
- `__tests__/api/galleries.test.ts` - Gallery API tests
- `__tests__/auth/auth-flow.test.ts` - Authentication flow tests
- `e2e/gallery-management.spec.ts` - E2E gallery management tests
- `e2e/public-site.spec.ts` - E2E public site navigation tests
- `e2e/contact-form.spec.ts` - E2E contact form submission tests

### Notes

- Unit tests should be placed in `__tests__/` directory, mirroring the source structure
- E2E tests should be placed in `e2e/` directory
- Use `npm test` to run Jest unit tests
- Use `npm run test:e2e` to run Playwright E2E tests
- All API routes should have corresponding test files

---

## Tasks

- [x] 1.0 Project Setup & Infrastructure Configuration
  - [x] 1.1 Initialize Next.js 14+ project with TypeScript and App Router (`npx create-next-app@latest`)
  - [x] 1.2 Install core dependencies: Tailwind CSS, Supabase client, React Hook Form, Zod, date-fns
  - [x] 1.3 Install dev dependencies: Jest, React Testing Library, Playwright, TypeScript types
  - [x] 1.4 Configure Tailwind CSS with custom design tokens (sage green accent: #8B9D83, typography, spacing)
  - [x] 1.5 Set up project folder structure (lib/, components/, app/, **tests**/, e2e/)
  - [x] 1.6 Create `.env.local` and `.env.example` files with required environment variables
  - [x] 1.7 Configure Next.js for image optimization (next.config.js)
  - [x] 1.8 Set up ESLint and Prettier with project-specific rules
  - [x] 1.9 Initialize Git repository and create `.gitignore` (exclude .env.local, node_modules, .next)
  - [x] 1.10 Create initial README.md with project overview and setup instructions

- [x] 2.0 Authentication & Authorization System
  - [x] 2.1 Create Supabase project and obtain API keys
  - [x] 2.2 Configure Google OAuth provider in Supabase dashboard
  - [x] 2.3 Create `lib/supabase/client.ts` for browser-side Supabase client
  - [x] 2.4 Create `lib/supabase/server.ts` for server-side Supabase client (cookies-based)
  - [x] 2.5 Implement authentication context (`lib/auth/auth-context.tsx`) with user state management
  - [x] 2.6 Create authentication provider component (`lib/auth/auth-provider.tsx`)
  - [x] 2.7 Build login page (`app/login/page.tsx`) with Google OAuth button
  - [x] 2.8 Create OAuth callback handler (`app/api/auth/callback/route.ts`)
  - [x] 2.9 Implement logout API route (`app/api/auth/logout/route.ts`)
  - [x] 2.10 Create Next.js middleware (`middleware.ts`) to protect admin routes
  - [x] 2.11 Create `useAuth` hook (`lib/hooks/useAuth.ts`) for easy authentication access
  - [x] 2.12 Add visual admin indicator (e.g., small toolbar) that shows when user is logged in

- [x] 3.0 Database Schema & API Layer
  - [x] 3.1 Design PostgreSQL database schema (categories, galleries, images, inquiries, page_content tables)
  - [x] 3.2 Create Supabase migration file (`supabase/migrations/001_initial_schema.sql`)
  - [x] 3.3 Define relationships: categories → galleries (one-to-many), galleries → images (one-to-many)
  - [x] 3.4 Add row-level security (RLS) policies: public read access, authenticated write access
  - [x] 3.5 Create TypeScript types for database models (`lib/db/types.ts`)
  - [x] 3.5a Run database migration manually in Supabase dashboard (deferred CLI setup to Task 10.22)
  - [x] 3.6 Implement database query functions (`lib/db/queries.ts`) for common operations
  - [x] 3.7 Create API route for categories CRUD (`app/api/categories/route.ts`)
  - [x] 3.8 Create API route for individual category operations (`app/api/categories/[id]/route.ts`)
  - [x] 3.9 Create API route for galleries CRUD (`app/api/galleries/route.ts`)
  - [x] 3.10 Create API route for individual gallery operations (`app/api/galleries/[id]/route.ts`)
  - [x] 3.11 Create API route for page content management (`app/api/content/route.ts`)
  - [x] 3.12 Add authentication checks to all admin API routes
  - [x] 3.13 Implement error handling and validation for all API endpoints

- [x] 4.0 Gallery & Category Management System
  - [x] 4.1 Create category manager component (`components/admin/CategoryManager.tsx`)
  - [x] 4.2 Implement category creation form with name and description fields
  - [x] 4.3 Implement category edit functionality (inline or modal-based)
  - [x] 4.4 Implement category deletion with confirmation dialog
  - [x] 4.5 Create sortable/draggable category list component for reordering (`components/admin/SortableList.tsx`)
  - [x] 4.6 Create gallery manager component (`components/admin/GalleryManager.tsx`)
  - [x] 4.7 Implement gallery creation form with all required fields (title, description, date, location, client name)
  - [x] 4.8 Add category selection dropdown in gallery creation form
  - [x] 4.9 Implement gallery edit functionality (update any field)
  - [x] 4.10 Implement gallery deletion with confirmation dialog
  - [x] 4.11 Create photo reordering interface within gallery editor (drag-and-drop)
  - [x] 4.12 Add cover image selection interface (radio buttons or visual picker)
  - [x] 4.13 Build admin galleries page (`app/admin/galleries/page.tsx`) with list view
  - [x] 4.14 Build admin categories page (`app/admin/categories/page.tsx`)
  - [x] 4.15 Add search/filter functionality to gallery list in admin

- [x] 5.0 Image Upload & Optimization Pipeline
  - [x] 5.1 Choose and configure image storage solution (Vercel Blob or Cloudflare R2)
  - [x] 5.2 Create image uploader component (`components/admin/ImageUploader.tsx`) with drag-and-drop
  - [x] 5.3 Implement multi-file upload with progress indicators
  - [x] 5.4 Create image upload API route (`app/api/images/upload/route.ts`)
  - [x] 5.5 Implement image optimization: generate web-optimized versions (JPEG quality 85, WebP)
  - [x] 5.6 Generate responsive image sizes (thumbnail: 400px, medium: 1200px, large: 2400px, original)
  - [x] 5.7 Store image metadata in database (url, alt text, width, height, gallery_id)
  - [x] 5.8 Implement automatic alt text generation based on gallery title and location
  - [x] 5.9 Add manual alt text override option for accessibility
  - [x] 5.10 Configure Next.js Image component for optimized serving
  - [x] 5.11 Implement lazy loading for images with blur placeholder
  - [x] 5.12 Add image deletion functionality (remove from storage and database)
  - [x] 5.13 Validate file types and sizes (max 10MB per image, JPEG/PNG/WebP/HEIC only)

- [x] 6.0 Frontend User Interface (Public Site)
  - [x] 6.1 Create site layout with header and footer (`components/layout/Header.tsx`, `Footer.tsx`)
  - [x] 6.2 Design header with "DJ Coveno Portraits" typographic logo and navigation
  - [x] 6.3 Implement responsive navigation (desktop: horizontal menu, mobile: hamburger menu)
  - [x] 6.4 Design footer with contact info, social links (Instagram, Facebook), and copyright
  - [x] 6.5 Build homepage (`app/page.tsx`) with full-screen slideshow hero
  - [x] 6.6 Create hero slideshow component (`components/home/HeroSlideshow.tsx`) with automatic transitions
  - [x] 6.7 Implement slideshow controls (prev/next arrows, pause/play, keyboard navigation)
  - [x] 6.8 Build galleries overview page (`app/galleries/page.tsx`) showing all categories
  - [x] 6.9 Create category page (`app/galleries/[category]/page.tsx`) with category description and gallery grid
  - [x] 6.10 Build gallery grid component (`components/gallery/GalleryGrid.tsx`) with cover images
  - [x] 6.11 Create individual gallery page (`app/galleries/[category]/[slug]/page.tsx`)
  - [x] 6.12 Display gallery metadata (title, description, date, location) on gallery page
  - [x] 6.13 Implement photo grid layout for gallery photos (masonry or uniform grid)
  - [x] 6.14 Create lightbox component (`components/gallery/GalleryLightbox.tsx`) for full-size viewing
  - [x] 6.15 Implement lightbox features: prev/next navigation, keyboard support (arrows, ESC), swipe gestures
  - [x] 6.16 Build About page (`app/about/page.tsx`) with bio, experience, approach sections
  - [x] 6.17 Add profile photo display on About page
  - [x] 6.18 Build Contact page (`app/contact/page.tsx`) with contact form
  - [x] 6.19 Apply minimal/clean design: whitespace, neutral colors, sage green accent (#8B9D83)
  - [x] 6.20 Ensure all pages are mobile-responsive (test at 375px, 768px, 1024px, 1440px breakpoints)
  - [x] 6.21 Implement smooth page transitions and subtle animations (fade-ins, hover effects)
  - [x] 6.22 Add loading states for image galleries and data fetching
  - [x] 6.23 Ensure WCAG 2.1 AA accessibility: keyboard navigation, focus indicators, contrast ratios

- [x] 7.0 Admin Dashboard & Inline Editing
  - [x] 7.1 Create admin dashboard layout (`app/admin/page.tsx`) with navigation sidebar
  - [x] 7.2 Build admin toolbar component (`components/admin/AdminToolbar.tsx`) visible only when logged in
  - [x] 7.3 Add admin toolbar to main layout with "Edit Mode" toggle
  - [x] 7.4 Create inline editor component (`components/admin/InlineEditor.tsx`) for text content
  - [x] 7.5 Implement inline editing for homepage hero (headline, subheadline, CTA text)
  - [x] 7.6 Create rich text editor component (`components/admin/RichTextEditor.tsx`) with formatting toolbar
  - [x] 7.7 Implement inline editing for About page sections (bio, experience, approach)
  - [x] 7.8 Add profile photo upload functionality on About page (when logged in)
  - [x] 7.9 Implement inline editing for Contact page information (hours, email, phone, service area)
  - [x] 7.10 Add social media link editing interface (Instagram, Facebook, Pinterest URLs)
  - [x] 7.11 Create save mechanism for inline edits (auto-save or explicit "Save" button)
  - [x] 7.12 Add visual feedback for edit mode (borders, edit icons, hover states)
  - [x] 7.13 Implement undo/discard changes functionality for inline edits
  - [x] 7.14 Create admin dashboard summary: recent inquiries, gallery count, latest updates
  - [x] 7.15 Add quick actions to dashboard: "New Gallery", "View Inquiries", "Edit About"

- [x] 8.0 Contact/Inquiry System
  - [x] 8.1 Create contact form component (`components/contact/ContactForm.tsx`)
  - [x] 8.2 Implement form fields: name, email, phone, event type, event date, budget, message
  - [x] 8.3 Add event type dropdown with options: Wedding, Engagement, Portrait, Pet, Family, Senior, Proposal, Other
  - [x] 8.4 Add budget dropdown: <$1000, $1000-$2500, $2500-$5000, $5000+, Not Sure
  - [x] 8.5 Implement form validation with Zod schema (`lib/utils/validation.ts`)
  - [x] 8.6 Add honeypot field for basic spam protection
  - [x] 8.7 Create inquiry submission API route (`app/api/inquiries/route.ts`)
  - [x] 8.8 Implement rate limiting on inquiry endpoint (max 3 submissions per hour per IP)
  - [x] 8.9 Store inquiries in database with timestamp and status (default: "New")
  - [x] 8.10 Integrate email service (SendGrid or Resend) for notifications
  - [x] 8.11 Send email notification to owner when inquiry is submitted
  - [x] 8.12 Create inquiry dashboard component (`components/admin/InquiryDashboard.tsx`)
  - [x] 8.13 Build inquiries page (`app/admin/inquiries/page.tsx`) listing all submissions
  - [x] 8.14 Display inquiry details: date, client info, event type, budget, message, status
  - [x] 8.15 Implement status update functionality: New, Contacted, Booked, Archived
  - [x] 8.16 Add filtering/sorting to inquiry dashboard (by status, date, event type)
  - [x] 8.17 Add inquiry search functionality (by name or email)
  - [x] 8.18 Show success message after form submission on Contact page

- [ ] 9.0 SEO Optimization & Metadata
  - [x] 9.1 Create SEO utility functions (`lib/utils/seo.ts`) for meta tag generation
  - [x] 9.2 Implement dynamic page title generation (format: "Page Title | DJ Coveno Portraits")
  - [x] 9.3 Create meta description generator with Montana location keywords
  - [x] 9.4 Add Open Graph meta tags for social sharing (image, title, description)
  - [x] 9.5 Add Twitter Card meta tags
  - [x] 9.6 Create structured data generators (`lib/seo/structured-data.ts`) for JSON-LD
  - [x] 9.7 Implement Organization/Person schema with photographer details
  - [x] 9.8 Add ImageObject schema to gallery pages with location data
  - [x] 9.9 Implement Breadcrumb schema for gallery navigation
  - [x] 9.10 Create dynamic sitemap (`app/sitemap.ts`) including all galleries and categories
  - [x] 9.11 Generate robots.txt (`app/robots.ts`) allowing all crawlers
  - [x] 9.12 Add canonical URLs to all pages to prevent duplicate content
  - [x] 9.13 Optimize for Montana location keywords in meta tags: Big Sky, Bozeman, Yellowstone, Montana
  - [x] 9.14 Optimize for service keywords: wedding photographer, engagement photos, portrait photographer, etc.
  - [x] 9.15 Add location information to gallery pages for local SEO boost
  - [x] 9.16 Implement semantic HTML with proper heading hierarchy (h1, h2, h3)
  - [x] 9.17 Optimize Core Web Vitals: lazy loading, code splitting, image optimization
  - [ ] 9.18 Run Lighthouse audit and address performance, SEO, and accessibility issues
  - [x] 9.19 Create `public/manifest.json` for PWA support
  - [x] 9.20 Set up Google Search Console integration documentation

- [ ] 10.0 Testing Suite (Unit, Integration, E2E)
  - [ ] 10.1 Configure Jest for unit testing (`jest.config.js`)
  - [ ] 10.2 Configure React Testing Library for component tests
  - [ ] 10.3 Configure Playwright for E2E tests (`playwright.config.ts`)
  - [ ] 10.4 Write unit tests for gallery grid component (`__tests__/components/GalleryGrid.test.tsx`)
  - [ ] 10.5 Write unit tests for contact form component (`__tests__/components/ContactForm.test.tsx`)
  - [ ] 10.6 Write unit tests for lightbox component (`__tests__/components/GalleryLightbox.test.tsx`)
  - [ ] 10.7 Write unit tests for inline editor component (`__tests__/components/InlineEditor.test.tsx`)
  - [ ] 10.8 Write integration tests for categories API (`__tests__/api/categories.test.ts`)
  - [ ] 10.9 Write integration tests for galleries API (`__tests__/api/galleries.test.ts`)
  - [ ] 10.10 Write integration tests for inquiries API (`__tests__/api/inquiries.test.ts`)
  - [ ] 10.11 Write unit tests for authentication flow (`__tests__/auth/auth-flow.test.ts`)
  - [ ] 10.12 Write unit tests for image optimization utilities (`__tests__/utils/image-optimizer.test.ts`)
  - [ ] 10.13 Write unit tests for validation schemas (`__tests__/utils/validation.test.ts`)
  - [ ] 10.14 Write E2E test for public site navigation (`e2e/public-site.spec.ts`)
  - [ ] 10.15 Write E2E test for gallery browsing and lightbox (`e2e/gallery-viewing.spec.ts`)
  - [ ] 10.16 Write E2E test for contact form submission (`e2e/contact-form.spec.ts`)
  - [ ] 10.17 Write E2E test for admin login flow (`e2e/admin-auth.spec.ts`)
  - [ ] 10.18 Write E2E test for gallery management (create, edit, delete) (`e2e/gallery-management.spec.ts`)
  - [ ] 10.19 Write E2E test for inline editing (`e2e/inline-editing.spec.ts`)
  - [ ] 10.20 Achieve 80%+ code coverage on critical paths
  - [ ] 10.21 Add test scripts to package.json: `npm test`, `npm run test:e2e`, `npm run test:coverage`
  - [ ] 10.22 Set up Supabase CLI for local development
  - [ ] 10.22a Install Supabase CLI and initialize project
  - [ ] 10.22b Link CLI to remote Supabase project
  - [ ] 10.22c Set up local Supabase with Docker
  - [ ] 10.22d Test migrations locally before pushing to remote
  - [ ] 10.23 Set up GitHub Actions CI/CD pipeline
  - [ ] 10.23a Configure workflow to run tests on pull requests
  - [ ] 10.23b Configure workflow to run database migrations on deployment
  - [ ] 10.23c Set up staging environment for testing migrations before production
  - [ ] 10.23d Add Supabase credentials to GitHub Secrets

- [ ] 11.0 Deployment & Production Configuration
  - [ ] 11.1 Create production environment variables in Vercel dashboard
  - [ ] 11.2 Configure Supabase production project (separate from development)
  - [ ] 11.3 Set up image storage for production (Vercel Blob or Cloudflare R2)
  - [ ] 11.4 Configure email service for production (SendGrid or Resend with production API key)
  - [ ] 11.5 Deploy to Vercel: connect GitHub repository and configure build settings
  - [ ] 11.6 Set up custom domain in Vercel: djcovenoportraits.com
  - [ ] 11.7 Configure DNS records for custom domain (A/CNAME records)
  - [ ] 11.8 Enable SSL/HTTPS for custom domain
  - [ ] 11.9 Set up database backups (Supabase automated daily backups)
  - [ ] 11.10 Configure error monitoring (Vercel Analytics or Sentry)
  - [ ] 11.11 Set up Google Analytics 4 tracking
  - [ ] 11.12 Test production deployment: verify all features work correctly
  - [ ] 11.13 Run Lighthouse audit on production site
  - [ ] 11.14 Submit sitemap to Google Search Console
  - [ ] 11.15 Submit sitemap to Bing Webmaster Tools
  - [ ] 11.16 Create deployment documentation: environment setup, DNS configuration, etc.
  - [ ] 11.17 Create user guide for owner: how to add galleries, edit content, manage inquiries
  - [ ] 11.18 Verify Core Web Vitals pass on production
  - [ ] 11.19 Test mobile responsiveness on real devices
  - [ ] 11.20 Perform final accessibility audit with screen reader

---

**Status:** ✅ Phase 2 Complete - All sub-tasks generated

**Estimated Timeline:** 4-6 weeks for full implementation (assuming 20-30 hours/week)

**Priority Order:**

1. Complete tasks 1.0-3.0 first (foundation)
2. Then 4.0-5.0 (core functionality)
3. Then 6.0 (public site)
4. Then 7.0-8.0 (admin features)
5. Then 9.0 (SEO)
6. Then 10.0 (testing)
7. Finally 11.0 (deployment)

**Notes:**

- Some tasks can be done in parallel (e.g., public UI and admin UI)
- Testing should be written alongside feature development, not left until the end
- SEO optimization should be considered throughout development, not just in task 9.0

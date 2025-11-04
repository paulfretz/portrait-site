# DJ Coveno Portraits

A modern, SEO-optimized portrait photography website for Montana-based photographer DJ Coveno. Built with Next.js, TypeScript, and Tailwind CSS, featuring a minimal/clean design with sage green accents.

## 🎯 Project Overview

This full-featured photography portfolio site serves as both a showcase and business inquiry platform, optimized for Montana regions (Big Sky, Bozeman, Yellowstone). The site includes comprehensive admin capabilities for managing galleries, categories, and all content through inline editing.

**Target Domain:** [djcovenoportraits.com](https://djcovenoportraits.com)

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure admin access via Supabase Auth
- 🖼️ **Gallery Management** - Full CRUD operations for galleries and categories
- 📸 **Image Optimization** - Automatic compression, responsive sizes, WebP/AVIF formats
- ✏️ **Inline Editing** - Edit any text content directly on the page when logged in
- 📱 **Mobile-First Design** - Fully responsive, optimized for all devices
- 🎨 **Minimal/Clean Aesthetic** - Large whitespace, sage green accent (#8B9D83)
- 📧 **Contact/Inquiry System** - Form with email notifications and admin dashboard
- 🔍 **SEO Optimized** - Montana-focused keywords, structured data, sitemaps
- ⚡ **Performance** - Target Lighthouse score 90+, Core Web Vitals compliant
- 🧪 **Comprehensive Testing** - Unit, integration, and E2E tests

## 🛠️ Tech Stack

**Framework & Language:**
- [Next.js 14+](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [React 18](https://react.dev/) - UI library

**Styling:**
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- Custom design tokens (sage green accent, typography, spacing)
- Inter font family from Google Fonts

**Backend & Database:**
- [Supabase](https://supabase.com/) - PostgreSQL database, authentication, storage
- Supabase Auth with Google OAuth
- Row-level security (RLS) policies

**Forms & Validation:**
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation

**Testing:**
- [Jest](https://jestjs.io/) - Unit testing
- [React Testing Library](https://testing-library.com/) - Component testing
- [Playwright](https://playwright.dev/) - E2E testing

**Image Storage & Optimization:**
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) - High-performance image storage with CDN
- [Sharp](https://sharp.pixelplumbing.com/) - Server-side image processing and optimization
- Multi-format support: AVIF, WebP, JPEG with automatic format selection
- DPR-aware image serving for high-DPI displays (retina, 2x, 3x screens)

**Email:**
- SendGrid or Resend for inquiry notifications

**Deployment:**
- [Vercel](https://vercel.com/) - Hosting and deployment

## 📋 Prerequisites

- Node.js 20+ and npm
- Git
- Supabase accounts:
  - **Production project** (for development and production)
  - **Test project** (for CI/CD E2E tests - recommended)
- Google OAuth credentials (for admin login)
- SendGrid or Resend account (for email notifications)
- Docker Desktop (optional, for local Supabase development)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd portrait-site
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase Projects

This project uses **two Supabase projects** for proper isolation:

#### **Production Project** (for development and production):
- **Project:** `nmgptiywaefuvvatlcah`
- **Purpose:** Real data, development, production deployment
- **URL:** https://nmgptiywaefuvvatlcah.supabase.co

#### **Test Project** (for CI/CD):
- **Project:** `viqvpxipqmkswpflpqfx`
- **Purpose:** E2E tests in GitHub Actions
- **URL:** https://viqvpxipqmkswpflpqfx.supabase.co

**Why two projects?**
- Prevents E2E tests from interfering with real data
- Allows safe, repeatable testing in CI/CD
- Industry best practice for test isolation

### 4. Set Up Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables (use **production** project):

```env
# Supabase Configuration (PRODUCTION PROJECT)
NEXT_PUBLIC_SUPABASE_URL=https://nmgptiywaefuvvatlcah.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Service (Resend)
RESEND_API_KEY=re_your-resend-api-key-here
NOTIFICATION_EMAIL=your-email@example.com

# Image Storage
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token

# Admin User Email (must be accessible in browser for auth checks)
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

### 4. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database migrations in `supabase/migrations/`
3. Configure Google OAuth provider in Supabase Authentication settings
4. Copy your project URL and keys to `.env.local`

### 5. Set Up Vercel Blob Storage

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one
2. Go to [Vercel Blob Dashboard](https://vercel.com/dashboard/stores)
3. Create a new Blob Store
4. Copy the `BLOB_READ_WRITE_TOKEN` to your `.env.local`

**Storage Limits & Upload Configuration:**

This project supports uploads up to **50MB and 8000px** for professional photography:

- **Vercel Blob Limits:**
  - Free Tier: 500GB storage, 100GB bandwidth/month
  - Upload API: Supports up to **500MB** per file on all plans
  - **No dashboard configuration needed** for 50MB uploads

- **Next.js Configuration:**  
  - Body parser limit: **50MB** (configured in `next.config.js` ✅)
  - This is the primary upload size control

- **Serverless Function Considerations:**
  - **Hobby plan:** 10s timeout, 1024MB memory (may timeout on large uploads)
  - **Pro plan:** 60s timeout, 3008MB memory (recommended for production)
  - If uploads timeout: upgrade plan or optimize image processing

**Note:** Vercel Blob is used for storing high-resolution portfolio images with automatic CDN distribution. See [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob) for details.

## 🖼️ Image Quality & Optimization

This site implements professional-grade image optimization to ensure crisp, high-quality photos on all devices, including high-DPI displays.

### Image Variants & Formats

Each uploaded image generates multiple optimized variants:

- **Thumbnail** (400px) - For admin previews and small displays
- **Medium** (1200px) - For gallery grids on desktop
- **Large** (2400px) - For gallery cover images and featured displays
- **XLarge** (4000px @ 95% JPEG quality) - For professional-quality full-screen viewing
- **Original** - Stored at full resolution (up to 8000px) for future use

**Format Priority:** AVIF → WebP → JPEG (browser automatically selects best supported format)

### DPR-Aware Image Serving

The site automatically serves high-resolution images for high-DPI displays (retina, 2x, 3x screens):

- **Gallery Grid Images:** Use precise `sizes` attributes matching rendered CSS dimensions
- **Lightbox Images:** Use `sizes="100vw"` with multi-format srcsets (AVIF/WebP/JPEG)
- **Browser Selection:** Automatically selects appropriate variant based on device pixel ratio (DPR)
- **Crispness Verification:** E2E tests verify `naturalWidth ≥ clientWidth × devicePixelRatio` for quality assurance

### Lightbox Behavior

The lightbox (full-screen image viewer) includes:

- **Viewport-Fit Scaling:** Images scale to fit viewport with 12px border (never overflow)
- **High-Resolution Sources:** Serves xlarge (4000px) or original variants for maximum quality
- **Multi-Format Srcsets:** AVIF → WebP → JPEG fallback chain for optimal compression
- **Accessibility:** Full keyboard navigation (arrows, Escape), focus trapping, ARIA roles, screen reader support
- **Mobile Optimizations:** Swipe gestures, 48px tap targets, edge-positioned navigation buttons

### Gallery Layouts

**Mobile (≤767px):**
- **Masonry Layout:** 2-column grid with 4px gaps
- Dynamic heights maintain natural aspect ratios
- Images fit within columns without upscaling

**Desktop (≥768px):**
- **Justified Layout:** Flickr-style rows with equal-height images
- 8px gaps between images
- Rows scale to fill available width

### Performance Optimizations

- **Lazy Loading:** Images load as they enter viewport (except first image)
- **Blur Placeholders:** 20px base64 data URLs for progressive loading
- **Format Selection:** Browser automatically selects best format (AVIF > WebP > JPEG)
- **Responsive Images:** Multiple sizes prevent unnecessary large downloads on mobile
- **CDN Distribution:** Vercel Blob provides global CDN for fast image delivery

### Technical Implementation

- **Image Processing:** Sharp generates all variants during upload
- **URL Generation:** `lib/utils/image-urls.ts` handles variant URL construction
- **Component:** `OptimizedImage` wrapper ensures consistent optimization across site
- **Lightbox:** Uses native `<img>` with `srcset` for full DPR control (Task 0003)
- **E2E Verification:** Comprehensive tests verify crispness, viewport constraints, and navigation

For detailed technical documentation, see `tasks/0003-prd-image-crispness-and-lightbox.md`.

### 7. Set Up Resend for Email Notifications

1. Create a free account at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy the API key to your `.env.local` as `RESEND_API_KEY`
5. Set `NOTIFICATION_EMAIL` to your email address (where you want to receive inquiry notifications)

**Note:** Resend free tier includes 100 emails/day and 3,000 emails/month, which is perfect for a portfolio site.

**Domain Setup (Optional but Recommended):**
- For production, verify your domain in Resend to send from `inquiries@djcovenoportraits.com`
- For development, you can use Resend's test domain

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run Jest unit tests
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:coverage` - Generate test coverage report

## 📁 Project Structure

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
│   ├── 0001-prd-portrait-photography-site.md
│   └── tasks-0001-prd-portrait-photography-site.md
└── public/                      # Static assets
```

## 🎨 Design System

**Colors:**
- Primary accent: Sage green (#8B9D83)
- Neutral palette: Blacks, whites, grays
- Design style: Minimal/Clean with large whitespace

**Typography:**
- Font: Inter (Google Fonts)
- Weights: 300-700
- Light font weights for headings

**Breakpoints:**
- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px
- Large: 1440px

## 🧪 Testing

Run all tests:

```bash
npm test                  # Unit tests
npm run test:e2e          # E2E tests
npm run test:coverage     # Coverage report
```

Target: 80%+ code coverage on critical paths.

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables in Vercel
4. Deploy automatically on push to main branch

### Custom Domain Setup

1. Add `djcovenoportraits.com` in Vercel project settings
2. Configure DNS records (A/CNAME) with your domain provider
3. SSL/HTTPS enabled automatically by Vercel

## 📝 Documentation

- **PRD:** See `tasks/0001-prd-portrait-photography-site.md`
- **Task List:** See `tasks/tasks-0001-prd-portrait-photography-site.md`
- **API Documentation:** (Coming soon)

## 🤝 Contributing

This is a private project for DJ Coveno Portraits. For questions or support, contact the development team.

## 🧪 Testing

The project includes comprehensive test coverage with unit, integration, and E2E tests.

### Running Tests

```bash
# Run all unit/integration tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode (interactive)
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

### Test Structure

- **Unit Tests** (`__tests__/components/`) - React component testing
- **Integration Tests** (`__tests__/api/`) - API route testing
- **E2E Tests** (`e2e/`) - Full application flow testing with Playwright

### E2E Test Authentication

Some E2E tests require admin authentication. The test suite includes:
- **Auth setup** (`e2e/auth.setup.ts`) - Creates mock admin session
- **Authenticated tests** - Use saved session state for admin features
- **Public tests** - No authentication required

See `e2e/README.md` for detailed testing documentation.

### Current Test Coverage

- ✅ 319 unit/integration tests
- ✅ 260+ E2E tests across 3 browsers (Chromium, Firefox, WebKit)
- ✅ Total: 579+ tests passing

## 📄 License

Private and confidential. All rights reserved.

---

**Built with ❤️ for Montana portrait photography**

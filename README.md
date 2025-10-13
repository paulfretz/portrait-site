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

**Image Storage:**
- Vercel Blob Storage or Cloudflare R2

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

**Note:** Vercel Blob is used for storing high-resolution portfolio images with automatic CDN distribution.

### 6. Set Up Resend for Email Notifications

1. Create a free account at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Copy the API key to your `.env.local` as `RESEND_API_KEY`
5. Set `NOTIFICATION_EMAIL` to your email address (where you want to receive inquiry notifications)

**Note:** Resend free tier includes 100 emails/day and 3,000 emails/month, which is perfect for a portfolio site.

**Domain Setup (Optional but Recommended):**
- For production, verify your domain in Resend to send from `inquiries@djcovenoportraits.com`
- For development, you can use Resend's test domain

### 7. Run Development Server

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

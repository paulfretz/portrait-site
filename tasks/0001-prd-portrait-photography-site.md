# Product Requirements Document: Montana Portrait Photography Site

## Introduction/Overview

This PRD outlines the requirements for a full-featured portrait photography website for a Montana-based photographer. The site will serve as both a portfolio showcase and business inquiry platform, optimized for Montana regions (Big Sky, Bozeman, Yellowstone, etc.) with strong SEO presence. The site must be cost-effective to operate, mobile-friendly, and feature an admin portal for the owner to manage all content including galleries, categories, and page content through inline editing.

**Problem Statement:** The photographer needs a professional, low-maintenance website that showcases their portfolio, attracts clients through organic search, and provides an easy way to manage content without technical knowledge, all while keeping hosting and storage costs minimal.

**Solution:** A modern, mobile-responsive photography portfolio site with full-screen gallery displays, comprehensive admin capabilities, Google authentication, and aggressive SEO optimization for Montana-based photography services.

> **Status Update (Nov 2025):** Core site requirements have been delivered. Remaining launch-readiness items (performance audits, deployment hardening, owner documentation) are deferred to **PRD 0004 – Environment & Release Hardening**.

## Goals

1. Create a visually stunning, mobile-responsive portfolio site that prioritizes photo presentation
2. Implement comprehensive admin functionality for content management without coding knowledge
3. Achieve high Google search rankings for Montana-based photography services (weddings, engagements, portraits, etc.)
4. Minimize operational costs (hosting, storage, maintenance) while maintaining performance
5. Provide seamless inquiry/contact experience for potential clients
6. Support multiple photography categories and gallery organization
7. Ensure code quality through comprehensive test coverage (Unit, Integration, E2E)

## User Stories

### Visitor/Client Stories

- As a potential client, I want to view stunning full-screen galleries on my phone so that I can appreciate the photographer's work while browsing casually
- As a bride planning a wedding, I want to search "wedding photographer Bozeman" and find this site on the first page of Google
- As a visitor, I want to easily navigate between different types of photography (weddings, engagements, families) so I can find relevant work
- As an interested client, I want to submit an inquiry with my event details and budget so the photographer can respond appropriately
- As a mobile user, I want the site to load quickly even with many high-quality photos

### Owner/Admin Stories

- As the photographer, I want to sign in with my Google account so I can access admin features securely without remembering passwords
- As the owner, I want to create a new gallery by uploading photos, adding a title, description, date, location, and setting a cover image
- As the owner, I want to edit my About page content inline (bio, experience, approach sections) without leaving the page
- As the admin, I want to organize galleries into categories (Weddings, Engagements, Portraits, etc.) so visitors can browse by type
- As the owner, I want to view all client inquiries in a dashboard and receive email notifications so I never miss a lead
- As the admin, I want to edit any text on the site inline so I can update content quickly
- As the owner, I want to store client names privately with galleries for my records without displaying them publicly
- As the admin, I want to delete old galleries or categories when they're no longer relevant

## Functional Requirements

### 1. Authentication & Authorization

1.1. The system must provide Google OAuth authentication for the site owner  
1.2. The system must restrict admin features (gallery management, content editing) to authenticated users only  
1.3. The system must maintain admin session state across page navigations  
1.4. The system must provide a logout function that clears the authentication session  
1.5. The system must display visual indicators (e.g., edit buttons, admin toolbar) when the owner is logged in

### 2. Gallery Management

2.1. The system must allow the admin to create, edit, and delete gallery categories (e.g., Weddings, Engagements, Portraits, Pets, Families, Seniors, Proposals)  
2.2. The system must allow the admin to create galleries within categories with the following fields:

- Title (required)
- Description (optional, rich text)
- Upload multiple photos (required, minimum 1)
- Date (required)
- Location (required, text field for city/venue)
- Client name (required, private - not displayed publicly)
- Featured/cover image selection (required, selected from uploaded photos)  
  2.3. The system must allow the admin to edit existing galleries (update any field, add/remove photos)  
  2.4. The system must allow the admin to delete galleries with a confirmation prompt  
  2.5. The system must allow the admin to reorder photos within a gallery (drag-and-drop or similar)  
  2.6. The system must allow the admin to reorder categories to control their display order  
  2.7. All galleries must be public by default (no visibility controls required)  
  2.8. The system must display galleries in a grid view within their categories on the frontend

### 3. Image Management

3.1. The system must accept common image formats (JPEG, PNG, WebP, HEIC)  
3.2. The system must automatically generate web-optimized versions of uploaded images (compressed, responsive sizes)  
3.3. The system must retain original high-resolution images in storage  
3.4. The system must implement progressive/lazy loading for images to optimize page load times  
3.5. The system must generate appropriate srcset attributes for responsive images  
3.6. The system must optimize images for mobile viewing (smaller file sizes for mobile viewports)  
3.7. The system must provide appropriate alt text fields for accessibility (auto-generated with option to customize)

### 4. Contact & Inquiry System

4.1. The system must provide a contact form with the following fields:

- Name (required)
- Email (required, validated)
- Phone (required)
- Event Type (required, dropdown: Wedding, Engagement, Portrait, Pet, Family, Senior, Proposal, Other)
- Event Date (optional, date picker)
- Budget (optional, dropdown: <$1000, $1000-$2500, $2500-$5000, $5000+, Not Sure)
- Message (required, textarea)  
  4.2. The system must validate all required fields before submission  
  4.3. The system must send an email notification to the owner when an inquiry is submitted  
  4.4. The system must store all inquiries in an admin dashboard for review  
  4.5. The system must display inquiry date, client info, and status in the admin dashboard  
  4.6. The system must allow the admin to mark inquiries as "New", "Contacted", "Booked", or "Archived"  
  4.7. The system must provide basic spam protection (e.g., honeypot field, rate limiting)

### 5. Content Management & Inline Editing

5.1. The system must provide inline editing capability for all text content when the admin is logged in  
5.2. The system must allow the admin to edit the About page with multiple sections:

- Photographer bio (rich text)
- Experience/background section (rich text)
- Photography approach/philosophy (rich text)
- Profile photos (upload and display multiple)
- Social media links (Instagram, Facebook, Pinterest, etc.)  
  5.3. The system must allow the admin to edit the Contact page information (business hours, email, phone, service area)  
  5.4. The system must allow the admin to edit the homepage hero section (headline, subheadline, call-to-action text)  
  5.5. The system must save edited content immediately or with a clear "Save" action  
  5.6. The system must provide a visual indication that content is being edited (e.g., bordered box, edit icon)  
  5.7. The system must support rich text editing (bold, italic, lists, links) for appropriate fields

### 6. SEO Optimization

6.1. The system must generate semantic HTML with proper heading hierarchy (h1, h2, h3)  
6.2. The system must generate unique, descriptive page titles and meta descriptions for all pages  
6.3. The system must include location-based keywords in meta tags (Montana, Big Sky, Bozeman, Yellowstone, etc.)  
6.4. The system must generate proper Open Graph and Twitter Card meta tags for social sharing  
6.5. The system must create an XML sitemap that updates automatically when content changes  
6.6. The system must generate a robots.txt file to guide search engine crawlers  
6.7. The system must implement structured data (JSON-LD) for:

- Organization/Person schema (photographer business)
- ImageObject schema for gallery photos
- Breadcrumb schema for navigation  
  6.8. The system must generate SEO-friendly URLs (e.g., `/galleries/weddings/smith-wedding-big-sky`)  
  6.9. The system must include location information in gallery pages to boost local SEO  
  6.10. The system must optimize for service-based keywords: "wedding photographer [location]", "engagement photos [location]", "portrait photographer [location]", "pet photography [location]", "family photographer [location]", "senior photos [location]", "proposal photographer [location]"  
  6.11. The system must achieve Core Web Vitals targets (LCP < 2.5s, FID < 100ms, CLS < 0.1)  
  6.12. The system must implement proper canonical URLs to prevent duplicate content issues

### 7. Frontend User Experience

7.1. The system must implement a full-screen gallery/slideshow on the homepage featuring recent or featured work  
7.2. The system must be fully responsive and optimized for mobile devices (portrait and landscape)  
7.3. The system must implement smooth transitions and professional animations (subtle, not distracting)  
7.4. The system must provide multiple design style options for the owner to choose from:

- Option A: Minimal/Clean (focus on photos, minimal UI, lots of whitespace)
- Option B: Modern/Bold (strong typography, geometric layouts, accent colors)
- Option C: Classic/Elegant (serif fonts, traditional portfolio style, muted colors)  
  7.5. The system must implement intuitive navigation with clear category/gallery hierarchy  
  7.6. The system must include a persistent header with logo and main navigation  
  7.7. The system must include a footer with contact info, social links, and copyright  
  7.8. The system must implement a lightbox/modal for viewing gallery photos in full size  
  7.9. The system must support keyboard navigation (arrow keys in galleries, escape to close)  
  7.10. The system must be accessible (WCAG 2.1 AA compliance: proper contrast, alt text, keyboard navigation)

### 8. Performance & Cost Optimization

8.1. The system must be architected to minimize hosting and storage costs (target: <$10/month)  
8.2. The system must implement aggressive caching strategies for static content  
8.3. The system must use a cost-effective image storage solution (e.g., cloud storage with CDN)  
8.4. The system must lazy-load images to reduce initial page load time  
8.5. The system must implement code splitting to reduce JavaScript bundle size  
8.6. The system must use serverless functions or edge computing where appropriate to minimize server costs  
8.7. The system must monitor and optimize database queries (if using a database)  
8.8. The system must achieve a Lighthouse performance score of 90+ on mobile and desktop

## Non-Goals (Out of Scope)

1. **Client Portals:** Clients will not have login accounts or private galleries (all galleries are public)
2. **E-commerce/Booking:** No online payment, booking calendar, or pricing pages (inquiries only)
3. **Blog/CMS:** No blog functionality or complex content management beyond specified pages
4. **Multi-user Admin:** Only the single owner will have admin access (no team members or staff)
5. **Real-time Chat:** No live chat or instant messaging features
6. **Video Content:** Site is photo-focused; video galleries are not required
7. **Print Store:** No photo printing or product sales functionality
8. **Advanced Analytics Dashboard:** Basic analytics (e.g., Google Analytics) is sufficient; no custom dashboard
9. **Multi-language Support:** English only (Montana market)
10. **Custom Domain Email:** Email notifications will use third-party service; no email hosting required

## Design Considerations

### Design Style Options

The PRD includes three design style options for the owner to review before development:

**Option A: Minimal/Clean**

- Large whitespace between elements
- Photos are the hero; minimal UI chrome
- Sans-serif fonts (e.g., Inter, Helvetica, Roboto)
- Neutral color palette (blacks, whites, grays with one subtle accent)
- Grid-based layouts
- Reference examples: Apple product pages, minimalist portfolios

**Option B: Modern/Bold**

- Strong typography with large headings
- Geometric layouts with overlapping elements
- Modern sans-serif with high contrast weights (e.g., Montserrat, Poppins)
- Bold accent colors alongside neutrals
- Asymmetric layouts with visual interest
- Reference examples: Awwwards-winning portfolios, modern agency sites

**Option C: Classic/Elegant**

- Serif fonts for headings (e.g., Playfair Display, Cormorant)
- Traditional centered layouts
- Muted, sophisticated color palette (creams, taupes, soft blacks)
- Subtle decorative elements (borders, dividers)
- Timeless, magazine-inspired design
- Reference examples: Traditional wedding photographer sites, editorial layouts

### Mobile-First Approach

- All designs must be developed mobile-first, then enhanced for tablet and desktop
- Touch targets must be minimum 44x44px for mobile usability
- Navigation should collapse to hamburger menu on mobile
- Galleries should support swipe gestures on touch devices

### Accessibility

- Minimum contrast ratio of 4.5:1 for normal text, 3:1 for large text
- All interactive elements keyboard accessible
- Focus indicators visible and clear
- Screen reader friendly (proper ARIA labels, semantic HTML)

## Technical Considerations

### Recommended Architecture (Cost-Optimized)

Given the low-traffic requirement and cost constraints, consider:

**Static Site Generation (SSG) with Serverless Functions:**

- Framework: Next.js with static export or Astro
- Hosting: Vercel free tier or Netlify free tier (~$0-5/month)
- Database: Supabase free tier or Firebase free tier
- Image Storage: Cloudflare R2 (cheaper than S3) or Vercel Blob storage
- Authentication: Firebase Auth or Supabase Auth with Google OAuth
- Email: SendGrid free tier (100 emails/day) or Resend
- Estimated cost: $0-10/month depending on traffic and storage

**Alternative Approaches:**

- Jamstack: Eleventy/Hugo + Netlify CMS + Cloudinary
- Full serverless: AWS Amplify or Firebase Hosting
- Headless CMS: Sanity.io or Strapi with SSG frontend

### Technology Stack Recommendations

- **Frontend:** React (Next.js) or Vue (Nuxt) for inline editing capabilities
- **Styling:** Tailwind CSS for rapid development and small bundle size
- **Image Optimization:** next/image, sharp, or cloudinary
- **Forms:** React Hook Form + validation library (Zod or Yup)
- **Authentication:** Firebase Auth or NextAuth.js
- **Database:** Supabase (Postgres) or Firebase Firestore for flexibility
- **Testing:** Jest + React Testing Library (unit), Playwright (E2E)

### SEO Technical Requirements

- Server-side rendering (SSR) or static site generation (SSG) for crawlability
- Dynamic meta tag generation based on page content
- Automatic sitemap generation on build/deploy
- Schema.org structured data injection
- Google Search Console integration setup
- Bing Webmaster Tools integration setup

### Security Considerations

- Admin routes must be protected with authentication middleware
- API endpoints must validate authentication tokens
- Form submissions must include CSRF protection
- Environment variables for sensitive data (API keys, secrets)
- Rate limiting on contact form to prevent spam
- Input sanitization on all user-submitted content

## Success Metrics

### SEO Performance

- Appear on first page (top 10) of Google results for "wedding photographer [Montana city]" within 6 months
- Appear in Google local pack for "photographer near me" searches in target areas
- Achieve Domain Authority of 20+ within 12 months
- Index 100% of pages in Google Search Console

### User Engagement

- Average session duration > 2 minutes (visitors browsing galleries)
- Bounce rate < 60% on gallery pages
- Mobile traffic comprises 60%+ of visitors (photography is visual/mobile)
- Contact form conversion rate > 2% of gallery page visitors

### Performance Metrics

- Lighthouse performance score 90+ (mobile and desktop)
- Page load time (LCP) < 2.5 seconds on 4G mobile
- Image load time < 1 second for web-optimized versions
- Core Web Vitals pass on all pages

### Business Metrics

- Receive minimum 5 qualified inquiries per month within 3 months of launch
- Reduce time spent on site maintenance to < 30 minutes per week
- Maintain hosting + storage costs under $10/month
- Zero downtime in first 6 months

### Code Quality

- Test coverage > 80% for critical paths
- All E2E user flows covered by automated tests
- Zero critical or high-severity security vulnerabilities
- Lighthouse accessibility score 90+

## Open Questions

1. **Design Selection:** ✅ **RESOLVED** - Option A: Minimal/Clean selected. The site will feature large whitespace, photos as the hero, clean sans-serif typography, neutral color palette with one subtle accent color, and simple grid layouts.

2. **Branding Assets:** ✅ **RESOLVED** - No existing logo. Use "DJ Coveno Portraits" in clean sans-serif typography. Accent color: soft sage green to complement Montana landscapes.

3. **Initial Content:** ✅ **RESOLVED** - 5-20 existing galleries. Build easy upload process in admin for manual gallery creation.

4. **Social Media Integration:** Beyond links, should we display Instagram feed or social proof on the site?

5. **Analytics & Tracking:** Should we include Google Analytics 4, Plausible, or another analytics tool? Any specific conversion tracking needs?

6. **Domain & Email:** ✅ **RESOLVED** - Custom domain: djcovenoportraits.com. Will need DNS configuration documentation for deployment.

7. **Launch Timeline:** What is the target launch date? Are there any seasonal considerations (e.g., wedding season)?

8. **Backup & Recovery:** What backup strategy is preferred for galleries and content? Automated daily backups?

9. **Content Moderation:** Should the contact form have manual review before sending to prevent spam, or is email filtering sufficient?

10. **Gallery Limits:** Are there any anticipated limits on the number of photos per gallery or total galleries? This affects storage cost estimation.

---

**Document Version:** 1.2  
**Created:** September 30, 2025  
**Last Updated:** September 30, 2025  
**Status:** ✅ Ready for Implementation - All Critical Questions Resolved

**Key Decisions:**

- Design: Minimal/Clean with sage green accent
- Branding: DJ Coveno Portraits (typographic logo)
- Domain: djcovenoportraits.com
- Content: 5-20 galleries, manual upload via admin

# Lighthouse Audit Guide

This document provides instructions for running a Lighthouse audit and interpreting results for the DJ Coveno Portraits website.

## How to Run Lighthouse

### Option 1: Chrome DevTools (Recommended)
1. Open the site in Chrome: `http://localhost:3000`
2. Open DevTools (F12 or Cmd+Option+I)
3. Click the "Lighthouse" tab
4. Select categories: Performance, Accessibility, Best Practices, SEO
5. Select "Desktop" or "Mobile"
6. Click "Analyze page load"

### Option 2: Chrome Extension
1. Install "Lighthouse" extension from Chrome Web Store
2. Navigate to your site
3. Click the Lighthouse icon
4. Click "Generate report"

### Option 3: CLI (for CI/CD)
```bash
npm install -g @lhci/cli
npm run build
npm run start # Start production server
lhci autorun --collect.url=http://localhost:3000
```

## Target Scores (from PRD)

- **Performance:** 90+ (Core Web Vitals passing)
- **Accessibility:** 90+ (WCAG 2.1 AA compliance)
- **Best Practices:** 90+
- **SEO:** 95+ (comprehensive optimization)

## What We've Optimized (Task 9.0)

### Performance (LCP, FID, CLS)
- ✅ Image optimization (8 versions: AVIF, WebP, JPEG)
- ✅ Lazy loading with Next.js Image
- ✅ Priority loading for above-the-fold images
- ✅ Preconnect to external domains
- ✅ Font optimization (display: swap)
- ✅ Compression enabled
- ✅ 30-day image cache
- ✅ Code splitting (Next.js automatic)

### SEO
- ✅ Dynamic page titles
- ✅ Meta descriptions with keywords
- ✅ Canonical URLs on all pages
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD) on all pages
- ✅ Dynamic sitemap.xml
- ✅ robots.txt
- ✅ Semantic HTML (proper h1→h2→h3 hierarchy)
- ✅ Montana location keywords
- ✅ Service keywords (wedding photographer, etc.)

### Accessibility
- ✅ Alt text on all images (from database)
- ✅ Semantic HTML elements
- ✅ Proper heading hierarchy
- ✅ ARIA labels where needed
- ✅ Keyboard navigation (lightbox, forms)
- ✅ Focus states on interactive elements
- ✅ Color contrast (sage green #8B9D83 on white)
- ✅ Responsive design

### Best Practices
- ✅ HTTPS (Vercel default)
- ✅ No mixed content
- ✅ Secure cookies (httpOnly)
- ✅ CSP headers for images
- ✅ No console errors
- ✅ Modern image formats

## Common Issues & Fixes

### If Performance < 90:
1. **Check image sizes** - Ensure using responsive sizes
2. **Check bundle size** - Review webpack bundle analyzer
3. **Check third-party scripts** - Minimize external dependencies
4. **Check server response time** - Optimize database queries

### If Accessibility < 90:
1. **Check color contrast** - Verify all text is readable
2. **Check form labels** - Ensure all inputs have labels
3. **Check ARIA** - Add missing aria-labels
4. **Check keyboard nav** - Test all interactive elements

### If SEO < 95:
1. **Check meta tags** - Verify all pages have title/description
2. **Check structured data** - Validate JSON-LD syntax
3. **Check mobile-friendly** - Test responsive design
4. **Check robots.txt** - Ensure not blocking important pages

## Pages to Audit

Test each page type:
1. Homepage: `http://localhost:3000`
2. About: `http://localhost:3000/about`
3. Contact: `http://localhost:3000/contact`
4. Galleries: `http://localhost:3000/galleries`
5. Category: `http://localhost:3000/galleries/weddings`
6. Gallery: `http://localhost:3000/galleries/weddings/[gallery-slug]`

## Expected Results (Based on Implementation)

### Performance: 85-95
- **Likely score:** 90+
- **Potential issues:** 
  - Large hero images (already optimized with WebP/AVIF)
  - Google Fonts loading (already has preconnect + display:swap)

### Accessibility: 95-100
- **Likely score:** 95+
- **Potential issues:** 
  - Minimal, comprehensive implementation

### Best Practices: 95-100
- **Likely score:** 95+
- **Potential issues:** 
  - None expected

### SEO: 95-100
- **Likely score:** 98+
- **Potential issues:** 
  - None expected, comprehensive implementation

## Next Steps After Audit

1. **If scores meet targets (90+):** 
   - ✅ Mark Task 9.18 complete
   - ✅ Commit Task 9.0
   - ✅ Move to Task 10.0 (Testing Suite)

2. **If scores below targets:**
   - Document specific issues
   - Create fix tasks
   - Re-run audit after fixes

## Lighthouse Report Storage

Save reports to: `docs/lighthouse-reports/`
- `lighthouse-report-homepage-YYYY-MM-DD.html`
- `lighthouse-report-gallery-YYYY-MM-DD.html`
- etc.

## Automated Lighthouse CI (Future - Task 10.23)

Will be configured in GitHub Actions to run on every PR and deployment:
```yaml
- name: Run Lighthouse CI
  run: |
    npm run build
    npm run start &
    lhci autorun
```

---

**Status:** Ready for manual Lighthouse audit
**Last Updated:** October 10, 2025


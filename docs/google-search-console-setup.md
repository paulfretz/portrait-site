# Google Search Console Setup Guide

This guide walks you through setting up Google Search Console for the DJ Coveno Portraits website to monitor search performance, index status, and SEO health.

## Why Google Search Console?

Google Search Console (GSC) provides critical insights:
- **Search Performance:** Track which keywords bring visitors to your site
- **Index Coverage:** Monitor which pages Google has indexed
- **Mobile Usability:** Ensure mobile-friendliness
- **Core Web Vitals:** Real-world performance data from actual users
- **Security Issues:** Alerts for malware or hacked content
- **Manual Actions:** Notifications if Google penalizes your site

## Prerequisites

- ✅ Site deployed to production (Vercel)
- ✅ Custom domain configured (djcovenoportraits.com or djcoveno.com)
- ✅ Google account (can use same account as Google OAuth)

## Setup Steps

### 1. Add Property to Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click "Add Property"
3. Choose **"Domain"** property type (recommended)
   - Enter: `djcovenoportraits.com` (or your domain)
   - This covers all subdomains and protocols (http, https, www, non-www)

**Alternative:** Choose "URL prefix" if you only want https://djcovenoportraits.com

### 2. Verify Domain Ownership

Google will provide a TXT record to add to your DNS. This proves you own the domain.

**If using Vercel:**
1. Copy the TXT record from Google Search Console
   - Example: `google-site-verification=abc123xyz789...`
2. Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
3. Add DNS TXT record:
   - **Type:** TXT
   - **Name:** @ (or root domain)
   - **Value:** Paste the verification string
   - **TTL:** 3600 (1 hour) or automatic
4. Wait 5-60 minutes for DNS propagation
5. Return to Google Search Console and click "Verify"

**Alternative Verification Methods:**
- HTML file upload (upload verification file to `/public`)
- HTML meta tag (add to `<head>` in layout.tsx)
- Google Analytics (if already installed)

### 3. Submit Sitemap

Once verified:

1. In Google Search Console, go to **"Sitemaps"** in left sidebar
2. Click "Add a new sitemap"
3. Enter: `sitemap.xml`
4. Click "Submit"

Google will start crawling and indexing your pages based on the sitemap.

**Your sitemap includes:**
- Homepage
- About page
- Contact page
- Galleries overview
- All category pages
- All gallery pages (dynamically generated)

### 4. Request Indexing for Key Pages (Optional but Recommended)

To speed up initial indexing:

1. Go to **"URL Inspection"** in left sidebar
2. Enter each key URL:
   - `https://djcovenoportraits.com/`
   - `https://djcovenoportraits.com/galleries`
   - `https://djcovenoportraits.com/about`
   - `https://djcovenoportraits.com/contact`
   - `https://djcovenoportraits.com/galleries/weddings` (for each category)
3. Click "Request Indexing"
4. Wait 24-48 hours for indexing

### 5. Configure Settings

**Users and Permissions:**
- Add team members if needed
- Set permission levels (Owner, Full, Restricted)

**Email Notifications:**
- Enable alerts for:
  - Critical issues
  - Manual actions
  - Security issues
  - Core Web Vitals issues

**Enhanced Results:**
- Review and enable rich results monitoring
- Check for structured data errors

## What to Monitor (Weekly/Monthly)

### Week 1-4 (Initial Launch):
- **Index Coverage:** Ensure all pages are being indexed
- **Crawl Errors:** Fix any 404s or server errors
- **Mobile Usability:** Verify all pages are mobile-friendly
- **Core Web Vitals:** Check LCP, FID, CLS metrics

### Ongoing (Monthly):
- **Search Performance:**
  - Top queries (track "wedding photographer Big Sky", "Bozeman engagement photos", etc.)
  - Click-through rate (CTR) - aim for 3-5%
  - Average position - aim for top 10 (position 1-10)
  - Pages receiving clicks
- **Coverage:**
  - Valid pages count (should match your sitemap count)
  - Excluded pages (verify nothing important is excluded)
- **Enhancements:**
  - Breadcrumbs status
  - Image search performance
  - Structured data issues

### Key Metrics to Track:

**Target Metrics (from PRD):**
- First page (top 10) for "wedding photographer [Montana city]" within 6 months
- Local pack appearance for "photographer near me"
- 100% of pages indexed
- No critical issues

## Common Issues & Solutions

### Issue: "Submitted URL not found (404)"
**Solution:** Check that the URL exists and is accessible. Verify sitemap is correct.

### Issue: "Crawled - currently not indexed"
**Solution:** 
- Add more internal links to these pages
- Improve content quality
- Check for duplicate content
- Request indexing manually

### Issue: "Page with redirect"
**Solution:** Update sitemap to include final URL, not redirect URL

### Issue: "Server error (5xx)"
**Solution:** Check Vercel deployment logs for errors

### Issue: "Structured data errors"
**Solution:** 
- Use [Rich Results Test](https://search.google.com/test/rich-results)
- Validate JSON-LD syntax
- Check schema implementation in `lib/seo/structured-data.ts`

## Integration with Bing Webmaster Tools (Optional)

Bing Webmaster Tools provides similar functionality:

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Verify ownership (similar to Google)
4. Import settings from Google Search Console (easiest method)
5. Submit sitemap: `sitemap.xml`

**Benefits:**
- Bing search visibility (10-15% of search market)
- Yahoo search visibility (Bing powers Yahoo)
- DuckDuckGo visibility (uses Bing index)

## Structured Data Testing

Use these tools to validate schema markup:

1. **Rich Results Test:** https://search.google.com/test/rich-results
   - Test any gallery URL
   - Should show ImageGallery schema with images

2. **Schema Markup Validator:** https://validator.schema.org/
   - Paste any page URL
   - Validates JSON-LD syntax

3. **Search Console Enhancement Reports:**
   - Breadcrumbs
   - Images
   - Organization

## Timeline Expectations

- **Day 1:** Verification and sitemap submission
- **Week 1:** Initial crawling begins, 20-30% of pages indexed
- **Week 2-4:** Full site indexed (100% of pages)
- **Month 2-3:** Start appearing in search results
- **Month 3-6:** Ranking improvements, potential first-page results
- **Month 6+:** Established presence, local pack appearances

## Monitoring Checklist

**Weekly:**
- [ ] Check for new critical issues
- [ ] Review crawl errors
- [ ] Monitor Core Web Vitals
- [ ] Check index coverage status

**Monthly:**
- [ ] Review top performing queries
- [ ] Analyze CTR trends
- [ ] Check average position changes
- [ ] Review structured data status
- [ ] Verify all new galleries are indexed

**Quarterly:**
- [ ] Compare traffic trends
- [ ] Evaluate keyword rankings
- [ ] Assess local search performance
- [ ] Review and optimize underperforming pages

## Documentation & Resources

- **Google Search Console Help:** https://support.google.com/webmasters
- **SEO Starter Guide:** https://developers.google.com/search/docs/beginner/seo-starter-guide
- **Structured Data Guide:** https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- **Core Web Vitals:** https://web.dev/vitals/

---

**Status:** Ready for production deployment and Search Console setup
**Next Steps:** 
1. Deploy to production (Task 11.0)
2. Configure custom domain
3. Follow this guide to set up Google Search Console
4. Monitor for first 4 weeks closely

**Last Updated:** October 10, 2025


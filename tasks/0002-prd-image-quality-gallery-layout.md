# PRD: Image Quality & Gallery Layout Overhaul

**PRD ID:** 0002  
**Feature Name:** Image Quality & Gallery Layout Overhaul  
**Created:** October 14, 2025  
**Priority:** High (Pre-Production Launch)  
**Status:** Draft

---

## 1. Introduction/Overview

This PRD defines a comprehensive overhaul of the image quality, upload capabilities, and gallery layout systems for the Montana Portrait Photography site. The current implementation prioritizes performance over visual fidelity, which is insufficient for a professional photography portfolio. This feature will ensure images are displayed at professional quality with responsive, photography-focused layouts that showcase the work beautifully on all devices.

**Problem Statement:**  
The current site displays images at lower resolutions with generic grid layouts that don't do justice to professional photography work. Images appear pixelated on high-resolution displays, upload size limits prevent uploading full-resolution photos, and the gallery layouts don't adapt intelligently to different screen sizes.

> **Status Update (Nov 2025):** Core gallery and lightbox improvements have shipped. Remaining follow-up items (Lighthouse audits, device QA, storage maintenance automation) are deferred to **PRD 0004 – Environment & Release Hardening**.

**Goal:**  
Transform the site into a true photography portfolio with crisp, high-resolution images and intelligent, content-aware gallery layouts that prioritize visual impact while maintaining excellent SEO and performance.

---

## 2. Goals

1. **Image Quality:** Support upload and display of professional-grade photos up to 8000px and 50MB
2. **Mobile Experience:** Implement masonry-style 2-column gallery layout with minimal whitespace
3. **Desktop Experience:** Create justified row-based gallery layout with consistent row heights
4. **Performance:** Maintain fast load times through progressive loading and optimization
5. **SEO:** Preserve and enhance SEO performance despite larger images
6. **Hero Quality:** Upgrade homepage hero slideshow to use high-res photographer's own images
7. **User Experience:** Create an easy-to-navigate, visually stunning portfolio

---

## 3. User Stories

### **As a site visitor:**
- I want to see crisp, professional-quality images so that I can appreciate the photographer's work
- I want galleries to load quickly on my phone without sacrificing quality
- I want to browse photos in a clean, distraction-free layout
- I want images to fit naturally on my screen without awkward cropping

### **As the photographer (admin):**
- I want to upload my full-resolution photos (up to 50MB) without compression artifacts
- I want my photos to look as good on the website as they do in my portfolio
- I want galleries to automatically arrange photos beautifully without manual layout work
- I want the hero slideshow to showcase my best work at full quality

### **As a potential client:**
- I want to quickly find the photographer's work through search engines
- I want to browse galleries on my phone with an intuitive layout
- I want to see image details clearly when I click to zoom

---

## 4. Functional Requirements

### **4.1 Image Upload & Processing**

**4.1.1** The system MUST accept image uploads up to 50MB in size (increase from current ~10MB limit)

**4.1.2** The system MUST support images up to 8000px in width or height

**4.1.3** The system MUST accept JPEG, PNG, and WebP formats

**4.1.4** The system MUST generate the following optimized variants for each uploaded image:
- **Thumbnail:** 400px (JPEG quality 85, WebP quality 80)
- **Medium:** 1200px (JPEG quality 90, WebP quality 85)
- **Large:** 2400px (JPEG quality 95, WebP quality 90)
- **XLarge:** 4000px (JPEG quality 95, WebP quality 90) [NEW]
- **Original:** Preserve original dimensions (JPEG quality 95, WebP quality 90)

**4.1.5** The system MUST preserve aspect ratios for all variants

**4.1.6** The system MUST show upload progress for large files

**4.1.7** The system MUST validate file size and dimensions before processing

**4.1.8** The system MUST provide clear error messages if uploads fail (file too large, unsupported format, etc.)

### **4.2 Mobile Gallery Layout (2-Column Masonry)**

**4.2.1** On screens ≤768px, galleries MUST display in a 2-column masonry layout

**4.2.2** The masonry layout MUST allow variable image heights (no forced cropping)

**4.2.3** Images MUST fit within their column width (calculate height based on aspect ratio)

**4.2.4** The gap between images MUST be 4px

**4.2.5** The layout MUST be edge-to-edge (no horizontal padding)

**4.2.6** Images MUST lazy load as the user scrolls

**4.2.7** The layout MUST reflow gracefully when the device is rotated

**4.2.8** Tapping an image MUST open the lightbox with full-resolution version

### **4.3 Desktop Gallery Layout (Justified Rows)**

**4.3.1** On screens >768px, galleries MUST display in a justified row layout

**4.3.2** All images in a row MUST have the same height

**4.3.3** Row heights MUST be variable based on content (calculate optimal height to fill row width)

**4.3.4** The system MUST dynamically calculate image widths to fill each row completely

**4.3.5** The last row MAY be partial if there aren't enough images to fill it

**4.3.6** The gap between images MUST be 8px (slightly larger than mobile for breathing room)

**4.3.7** Images MUST lazy load as the user scrolls

**4.3.8** Clicking an image MUST open the lightbox with full-resolution version

**4.3.9** The layout MUST support responsive breakpoints (tablet, desktop, large desktop)

### **4.4 Image Display Quality**

**4.4.1** The system MUST serve WebP format to browsers that support it (with JPEG fallback)

**4.4.2** The system MUST use `srcset` to provide appropriate image sizes for different screen densities

**4.4.3** Images in the lightbox MUST display at the highest available resolution (original or xlarge)

**4.4.4** Gallery thumbnails MUST use progressive loading (blur-up effect)

**4.4.5** Hero slideshow images MUST be at least 2400px wide

**4.4.6** Images MUST have proper `alt` attributes for SEO and accessibility

**4.4.7** The system MUST preload the hero slideshow images for immediate display

### **4.5 Homepage Hero Slideshow**

**4.5.1** The hero slideshow MUST support photographer's own high-resolution images (replacing Unsplash placeholders)

**4.5.2** Hero images MUST be optimized for fast loading (WebP + blur placeholder)

**4.5.3** The admin MUST be able to upload and manage hero images through the admin interface

**4.5.4** Hero images MUST have a minimum resolution of 2400px width

**4.5.5** The slideshow MUST cycle through images with smooth transitions

**4.5.6** Hero images MUST be stored separately from gallery images (dedicated hero image management)

### **4.6 Performance Optimization**

**4.6.1** The system MUST use progressive loading for all images (load low-res blur placeholder first)

**4.6.2** Images outside the viewport MUST be lazy-loaded using IntersectionObserver

**4.6.3** The system MUST prioritize loading images in the first viewport

**4.6.4** The system MUST cache optimized image variants on the CDN

**4.6.5** The system MUST compress images without visible quality loss

**4.6.6** Gallery pages MUST maintain a Lighthouse Performance score of 80+

**4.6.7** Image processing MUST happen asynchronously (don't block the upload UI)

### **4.7 SEO Enhancements**

**4.7.1** All images MUST have descriptive `alt` attributes

**4.7.2** Gallery pages MUST include structured data for `ImageObject` with high-res URLs

**4.7.3** Image filenames MUST be SEO-friendly (e.g., `montana-wedding-sunset-2024.jpg`)

**4.7.4** The sitemap MUST include image sitemaps with high-resolution URLs

**4.7.5** Gallery pages MUST load fast enough to avoid SEO penalties (<3s LCP)

**4.7.6** Images MUST have proper width/height attributes to prevent layout shift (CLS)

### **4.8 Admin Interface Updates**

**4.8.1** The image uploader MUST show a progress bar for large file uploads

**4.8.2** The admin MUST be able to see a preview of uploaded images before saving

**4.8.3** The admin MUST be able to set a hero image flag when uploading

**4.8.4** The gallery editor MUST display thumbnails (not full-res) for performance

**4.8.5** The admin MUST be able to reorder hero images via drag-and-drop

**4.8.6** The admin MUST see file size and dimension info for each uploaded image

---

## 5. Non-Goals (Out of Scope)

1. **RAW Format Support:** Will not support RAW image formats (HEIC, CR2, NEF, etc.) - photographer must export to JPEG first
2. **Image Editing:** No built-in cropping, filters, or editing tools (use external tools before upload)
3. **Automatic Cropping:** No forced aspect ratios or intelligent cropping (preserve original aspect ratios)
4. **Video Support:** No video upload or playback (images only)
5. **Social Media Integration:** No automatic posting to Instagram/Facebook
6. **Watermarking:** No automatic watermark application (add watermarks before upload if desired)
7. **Batch Upload:** Single file upload only (no drag-and-drop multiple files) - can be added later
8. **Client Galleries:** No password-protected client-only galleries (future feature)

---

## 6. Design Considerations

### **Mobile Layout (2-Column Masonry):**
```
┌────────────────────┐
│ ┌────┐    ┌────┐  │
│ │ 1  │    │ 2  │  │
│ │    │    └────┘  │
│ └────┘            │
│ ┌────┐    ┌────┐  │
│ │ 3  │    │ 4  │  │
│ └────┘    │    │  │
│           │    │  │
│ ┌────┐    └────┘  │
│ │ 5  │            │
│ │    │    ┌────┐  │
│ └────┘    │ 6  │  │
└───────────└────┘──┘
```
- 4px gap between images
- Variable heights based on aspect ratio
- No horizontal padding (edge-to-edge)

### **Desktop Layout (Justified Rows):**
```
┌──────────────────────────────────────────┐
│ ┌──────────┐ ┌──────┐ ┌────────────────┐ │
│ │    1     │ │  2   │ │       3        │ │ ← Same height
│ └──────────┘ └──────┘ └────────────────┘ │
│                                            │
│ ┌────────────────┐ ┌──────────┐ ┌──────┐ │
│ │       4        │ │    5     │ │  6   │ │ ← Same height
│ └────────────────┘ └──────────┘ └──────┘ │
│                                            │
│ ┌──────┐ ┌────────────────┐ ┌──────────┐ │
│ │  7   │ │       8        │ │    9     │ │ ← Same height
│ └──────┘ └────────────────┘ └──────────┘ │
└──────────────────────────────────────────┘
```
- 8px gap between images
- Row heights vary based on content
- Images scaled to fill row width

### **Image Quality Hierarchy:**
- **Thumbnail (400px):** Gallery grids, admin thumbnails
- **Medium (1200px):** Mobile lightbox, tablet displays
- **Large (2400px):** Desktop lightbox, hero slideshow
- **XLarge (4000px):** High-DPI displays, print-quality viewing
- **Original:** Available for download or maximum zoom

---

## 7. Technical Considerations

### **Image Processing:**
- Use `sharp` library (already implemented) with updated quality settings
- Add `xlarge` size variant generation
- Increase Vercel Blob upload limits (configure in Vercel dashboard)
- Update `lib/utils/image-optimizer.ts` with new size/quality configs

### **Gallery Layout Libraries:**
- **Mobile Masonry:** Consider `react-masonry-css` or custom CSS Grid masonry
- **Desktop Justified:** Consider `justified-layout` library (Flickr's algorithm) or custom implementation

### **Performance:**
- Implement progressive JPEG encoding
- Use `loading="lazy"` and `IntersectionObserver` (already implemented)
- Add blur placeholder data URLs using `sharp` or `plaiceholder`
- Prioritize `fetchPriority="high"` for hero images

### **Storage:**
- Verify Vercel Blob storage limits (currently 500GB free tier)
- Estimate storage usage: ~30MB avg × 5 variants × 100 images = ~15GB
- CDN caching should reduce bandwidth costs

### **Database:**
- Add `hero_image` boolean flag to `images` table
- Add `display_order` field for hero slideshow
- Consider adding `file_size` and `dimensions` fields for admin display

### **SEO:**
- Update structured data to include `contentUrl` with high-res URLs
- Generate image sitemap with `<image:loc>` tags
- Ensure `alt` attributes are populated from image metadata

---

## 8. Success Metrics

1. **Visual Quality:**
   - Images appear crisp on 4K displays (no visible pixelation)
   - Lightbox images load at full resolution
   - Hero slideshow showcases photographer's work at professional quality

2. **User Engagement:**
   - Reduced bounce rate on gallery pages (<40%)
   - Increased time on gallery pages (>2 minutes)
   - More lightbox opens per session (>5 clicks)

3. **Performance:**
   - Lighthouse Performance score ≥80
   - Largest Contentful Paint (LCP) <2.5s
   - Cumulative Layout Shift (CLS) <0.1
   - First Input Delay (FID) <100ms

4. **SEO:**
   - Improved Google Images indexing (all gallery images discoverable)
   - Maintained or improved Core Web Vitals scores
   - No SEO penalties for load time

5. **Admin Experience:**
   - Upload success rate >95% for files <50MB
   - Image processing time <30s for 50MB files
   - No upload UI blocking (async processing)

6. **Technical:**
   - All tests passing (unit, integration, E2E)
   - No TypeScript errors or linter warnings
   - Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

---

## 9. Open Questions

1. **Hero Image Count:** How many hero images should the slideshow support? (e.g., 3-10?)
2. **Image Metadata:** Should we extract and store EXIF data (camera, lens, settings)?
3. **Download Option:** Should visitors be able to download high-res images, or is lightbox viewing sufficient?
4. **Gallery Sorting:** How should images be ordered in galleries? (upload date, manual order, EXIF date?)
5. **Responsive Breakpoints:** Should we add a 3-column layout for tablets (768px-1024px)?
6. **Legacy Images:** What should happen to existing lower-res images? Re-upload or keep?
7. **Image Titles:** Should images have editable titles/captions separate from alt text?

---

## 10. Implementation Tasks (High-Level)

This PRD will generate a detailed task list, but high-level phases include:

### **Phase 1: Image Upload & Processing**
- Update upload size limits (Next.js, Vercel Blob)
- Add `xlarge` variant generation
- Increase JPEG/WebP quality settings
- Implement upload progress UI

### **Phase 2: Mobile Gallery Layout**
- Implement 2-column masonry layout
- Add 4px gap styling
- Test on various mobile devices
- Ensure lazy loading works

### **Phase 3: Desktop Gallery Layout**
- Implement justified row layout algorithm
- Calculate row heights dynamically
- Add 8px gap styling
- Test responsive breakpoints

### **Phase 4: Image Display Quality**
- Add blur placeholder generation
- Implement progressive loading
- Update `srcset` configurations
- Optimize WebP delivery

### **Phase 5: Hero Slideshow Upgrade**
- Add hero image management UI
- Replace Unsplash placeholders
- Implement drag-and-drop reordering
- Add hero-specific optimizations

### **Phase 6: SEO & Performance**
- Update structured data
- Generate image sitemap
- Run Lighthouse audits
- Optimize Core Web Vitals

### **Phase 7: Testing & Polish**
- Write unit tests for new components
- Add E2E tests for gallery layouts
- Cross-browser testing
- Mobile device testing
- Automate nightly GitHub workflow to detect and clean up orphaned storage blobs

---

## 11. Dependencies

- `sharp` (already installed) - image processing
- `react-masonry-css` or CSS Grid masonry - mobile layout
- `justified-layout` (optional) - desktop layout algorithm
- Vercel Blob configuration updates - storage limits
- Next.js Image configuration updates - size/quality settings

---

## 12. Timeline Estimate

- **Phase 1-2:** 2-3 days (image processing + mobile layout)
- **Phase 3-4:** 2-3 days (desktop layout + display quality)
- **Phase 5:** 1-2 days (hero slideshow)
- **Phase 6:** 1 day (SEO + performance)
- **Phase 7:** 1-2 days (testing + polish)

**Total Estimate:** 7-11 days (assuming full-time development)

---

## 13. Acceptance Criteria

This feature will be considered **complete** when:

1. ✅ Images up to 50MB and 8000px can be uploaded successfully
2. ✅ Gallery pages display in 2-column masonry layout on mobile
3. ✅ Gallery pages display in justified row layout on desktop
4. ✅ Images appear crisp on 4K displays with no pixelation
5. ✅ Hero slideshow uses photographer's high-res images
6. ✅ Lighthouse Performance score ≥80 on all gallery pages
7. ✅ All images have proper `alt` attributes and structured data
8. ✅ Upload progress is visible for large files
9. ✅ All existing tests pass + new tests written
10. ✅ Site is approved by photographer for visual quality
11. ✅ Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
12. ✅ Mobile testing complete on iOS and Android devices

---

**Next Steps:**
1. Review and approve this PRD
2. Generate detailed task list from PRD
3. Create feature branch: `task-0002-image-quality-gallery-layout`
4. Begin implementation (Phase 1)


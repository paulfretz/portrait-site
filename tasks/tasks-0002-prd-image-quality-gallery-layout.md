# Task List: PRD 0002 - Image Quality & Gallery Layout Overhaul

**Generated from:** `0002-prd-image-quality-gallery-layout.md`  
**Priority:** HIGH (Pre-Production Launch)  
**Status:** Not Started  
**Branch:** `task-0002-image-quality-gallery-layout`

---

## Task Overview

Transform the site into a professional photography portfolio with high-resolution images (up to 50MB/8000px), intelligent responsive layouts (masonry mobile, justified desktop), and enhanced visual quality throughout.

**Key Deliverables:**
- 50MB upload support with 5 optimized variants (including new xlarge 4000px)
- Mobile: 2-column masonry layout with 4px gaps
- Desktop: Justified row layout with variable heights, 8px gaps
- Hero slideshow with photographer's high-res images
- Progressive loading with blur placeholders
- Enhanced SEO with image sitemaps

---

## Progress Tracking

**Overall Progress:** 0 of 50 subtasks complete (0%)

### Phase Breakdown:
- **Phase 1 (Upload & Processing):** 0/10 subtasks
- **Phase 2 (Mobile Layout):** 0/8 subtasks
- **Phase 3 (Desktop Layout):** 0/8 subtasks
- **Phase 4 (Display Quality):** 0/7 subtasks
- **Phase 5 (Hero Slideshow):** 0/8 subtasks
- **Phase 6 (SEO & Performance):** 0/5 subtasks
- **Phase 7 (Testing & Polish):** 0/4 subtasks

---

## Parent Task

- [ ] **Task 0002.0** - Image Quality & Gallery Layout Overhaul

---

## Phase 1: Image Upload & Processing (10 subtasks)

- [x] 0002.1 Update Next.js body size limit to 50MB (`next.config.js`)
- [x] 0002.2 Update Vercel Blob upload configuration (check storage limits, configure in dashboard if needed)
- [x] 0002.3 Add file size validation to upload API (reject >50MB with clear error message)
- [x] 0002.4 Add image dimension validation (max 8000px width/height)
- [x] 0002.5 Update `lib/utils/image-optimizer.ts` to add `xlarge` variant (4000px)
- [x] 0002.6 Increase JPEG quality settings (thumbnail: 85, medium: 90, large: 95, xlarge: 95, original: 95)
- [x] 0002.7 Increase WebP quality settings (thumbnail: 80, medium: 85, large: 90, xlarge: 90, original: 90)
- [x] 0002.8 Update `generateOptimizedSizes()` function to include xlarge in size array
- [x] 0002.9 Add upload progress bar component for large files (`components/admin/UploadProgressBar.tsx`)
- [x] 0002.10 Integrate progress bar into `ImageUploader.tsx` (show percentage, file size, estimated time)
- [x] 0002.10a Update cover image URLs to use high-resolution variants (large/xlarge instead of thumbnail) - **CRITICAL for photography quality**

---

## Phase 2: Mobile Gallery Layout (8 subtasks)

- [x] 0002.11 Install `react-masonry-css` or implement custom CSS Grid masonry
- [x] 0002.12 Create `MasonryGalleryGrid` component for mobile layout
- [x] 0002.13 Implement 2-column configuration for screens ≤768px
- [x] 0002.14 Set 4px gap between images (no horizontal padding, edge-to-edge)
- [x] 0002.15 Calculate image heights dynamically based on aspect ratios
- [x] 0002.16 Ensure images fit within column width without cropping
- [x] 0002.17 Implement lazy loading with IntersectionObserver (verify existing implementation works)
- [x] 0002.18 Test masonry reflow on device rotation and window resize

---

## Phase 3: Desktop Gallery Layout (8 subtasks)

- [x] 0002.19 Research and choose justified layout approach (custom algorithm vs `justified-layout` library)
- [x] 0002.20 Implement `JustifiedGalleryGrid` component for desktop layout
- [x] 0002.21 Create row height calculation algorithm (distribute images to fill row width)
- [x] 0002.22 Implement image width scaling to fill rows completely
- [x] 0002.23 Set 8px gap between images for desktop
- [x] 0002.24 Handle partial last rows (left-align remaining images)
- [x] 0002.25 Add responsive breakpoints (tablet: 768px, desktop: 1024px, large: 1440px)
- [x] 0002.26 Create unified `ResponsiveGalleryGrid` component that switches between masonry and justified layouts

---

## Phase 4: Image Display Quality (7 subtasks)

- [x] 0002.27 Generate blur placeholder data URLs using `sharp` or `plaiceholder` library
- [x] 0002.28 Store blur placeholders in database (`images` table - add `blur_data_url` column)
- [x] 0002.29 Update `OptimizedImage` component to show blur placeholder before full image loads
- [x] 0002.30 Implement fade-in animation when full image loads
- [x] 0002.31 Update Next.js Image `srcset` to include xlarge variant
- [x] 0002.32 Ensure WebP format is served to supporting browsers (JPEG fallback)
- [x] 0002.33 Use `large` or `xlarge` variant in lightbox based on screen size/density

---

## Phase 5: Hero Slideshow Upgrade (8 subtasks)

- [x] 0002.34 Add `is_hero_image` boolean column to `images` table migration
- [x] 0002.35 Add `hero_display_order` integer column for slideshow ordering
- [x] 0002.36 Update `lib/db/types.ts` to include new hero image fields
- [x] 0002.37 Create `getHeroImages()` query function in `lib/db/queries.ts`
- [x] 0002.38 Create hero image management section in admin dashboard (`components/admin/HeroImageManager.tsx`)
- [x] 0002.39 Add "Set as Hero Image" toggle in `GalleryEditor` or `ImageUploader`
- [x] 0002.40 Implement drag-and-drop reordering for hero images (use `@dnd-kit`)
- [x] 0002.41 Update `HeroSlideshow.tsx` to fetch and display photographer's hero images (replace Unsplash placeholders)

---

## Phase 6: SEO & Performance (5 subtasks)

- [x] 0002.42 Update structured data in `lib/seo/structured-data.ts` to include `contentUrl` with high-res image URLs
- [x] 0002.43 Generate image sitemap (`app/image-sitemap.xml/route.ts` or update `app/sitemap.ts`)
- [ ] 0002.44 Ensure all images have descriptive `alt` attributes (check in GalleryGrid, PhotoGrid, etc.)
- [ ] 0002.45 Add `fetchPriority="high"` to hero slideshow images for preloading
- [ ] 0002.46 Run Lighthouse audit and optimize for LCP <2.5s, CLS <0.1, Performance ≥80

---

## Phase 7: Testing & Polish (4 subtasks)

- [ ] 0002.47 Write unit tests for image optimizer with new xlarge variant and quality settings
- [ ] 0002.48 Write component tests for `MasonryGalleryGrid` and `JustifiedGalleryGrid`
- [ ] 0002.49 Write E2E tests for mobile/desktop gallery layouts and hero slideshow
- [ ] 0002.50 Cross-browser testing (Chrome, Firefox, Safari, Edge) and mobile device testing (iOS/Android)

---

## Completion Checklist

Before marking this task complete and creating a PR, verify:

1. [ ] All 50 subtasks marked as complete
2. [ ] `npm run lint` passes with no errors
3. [ ] `npm run test` passes (all unit/integration tests)
4. [ ] `npm run test:e2e` passes (all E2E tests across 3 browsers)
5. [ ] `npm run build` succeeds with no TypeScript errors
6. [ ] `tasks/SESSION-LOG.md` updated with all changes, decisions, and completed tasks
7. [ ] Images up to 50MB/8000px can be uploaded successfully
8. [ ] Mobile gallery displays in 2-column masonry layout
9. [ ] Desktop gallery displays in justified row layout
10. [ ] Images appear crisp on 4K displays (no pixelation)
11. [ ] Hero slideshow uses photographer's high-res images
12. [ ] Lighthouse Performance score ≥80 on gallery pages
13. [ ] All images have proper `alt` attributes
14. [ ] Cross-browser compatibility verified
15. [ ] Mobile device testing complete (iOS/Android)

---

## Notes

### Technical Decisions to Make:
- [ ] Choose masonry library: `react-masonry-css` vs custom CSS Grid
- [ ] Choose justified layout: custom algorithm vs `justified-layout` library
- [ ] Choose blur placeholder: `sharp` built-in vs `plaiceholder` library
- [ ] Decide on hero image count limit (e.g., max 10?)

### Dependencies:
- `react-masonry-css` (if chosen for masonry)
- `justified-layout` (if chosen for desktop layout)
- `plaiceholder` (if chosen for blur placeholders)

### Migration Required:
```sql
-- Add to new migration file
ALTER TABLE images 
ADD COLUMN blur_data_url TEXT,
ADD COLUMN is_hero_image BOOLEAN DEFAULT FALSE,
ADD COLUMN hero_display_order INTEGER;

CREATE INDEX idx_images_hero ON images(is_hero_image, hero_display_order) 
WHERE is_hero_image = TRUE;
```

### Vercel Configuration:
- Check Blob storage usage (currently ~15GB estimated for 100 high-res images)
- Verify serverless function timeout (may need to increase for large uploads)
- Configure CDN caching headers for optimized images

---

## Open Questions (From PRD)

1. **Hero Image Count:** How many hero images should the slideshow support? (e.g., 3-10?)
   - **Decision:** _____
   
2. **Image Metadata:** Should we extract and store EXIF data (camera, lens, settings)?
   - **Decision:** _____
   
3. **Download Option:** Should visitors be able to download high-res images?
   - **Decision:** _____
   
4. **Gallery Sorting:** How should images be ordered? (upload date, manual order, EXIF date?)
   - **Decision:** Currently manual via drag-and-drop, keep this?
   
5. **Responsive Breakpoints:** Should we add a 3-column layout for tablets (768px-1024px)?
   - **Decision:** _____
   
6. **Legacy Images:** What should happen to existing lower-res images? Re-upload or keep?
   - **Decision:** _____
   
7. **Image Titles:** Should images have editable titles/captions separate from alt text?
   - **Decision:** _____

---

## Estimated Timeline

- **Phase 1:** 2-3 days
- **Phase 2:** 2-3 days
- **Phase 3:** 2-3 days
- **Phase 4:** 1-2 days
- **Phase 5:** 1-2 days
- **Phase 6:** 1 day
- **Phase 7:** 1-2 days

**Total:** 10-16 days (realistic estimate with testing)

---

## Success Criteria

✅ Task complete when:
1. All 50 subtasks marked complete
2. All tests passing (645+ tests)
3. Lighthouse Performance ≥80
4. Images crisp on 4K displays
5. Both mobile and desktop layouts working perfectly
6. Hero slideshow using photographer's images
7. Cross-browser and mobile device testing complete
8. Photographer approves visual quality
9. PR created and ready for merge


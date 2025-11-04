## Relevant Files

- `components/gallery/PhotoGrid.tsx` - Renders gallery grid; needs precise sizes/srcset for masonry/justified.
- `components/gallery/OptimizedImage.tsx` - Wrapper around Next/Image; central place to choose DPR-aware candidates and formats.
- `components/gallery/GalleryLightbox.tsx` - Lightbox rendering/controls; needs viewport-fit scaling with 12px border and navigation.
- `lib/utils/image-optimizer.ts` - Variant definitions (thumbnail/medium/large/xlarge/original) and quality; confirm long edges and usage.
- `e2e/gallery-viewing.spec.ts` - E2E tests for gallery/lightbox flows; add crispness/verifications.
- `e2e/gallery-layouts.spec.ts` - E2E tests for layout behaviors; verify masonry/justified tile sizing effects on crispness.
- `__tests__/components/PhotoGrid.test.tsx` - Component tests; may need minor selector/prop updates.

### Notes

- Unit tests typically live near code; E2E in `e2e/`.
- Use Jest for component tests and Playwright for E2E. 

## Tasks

- [x] 1.0 Define grid image sizing strategy
  - [x] 1.1 Measure real rendered tile widths across breakpoints (masonry 2-col mobile, justified desktop)
  - [x] 1.2 Set `sizes` attribute in `PhotoGrid`/`OptimizedImage` to match measured widths
  - [x] 1.3 Ensure width candidates map to existing variants (e.g., ~800/1200/1600/2400)
  - [x] 1.4 Prefer ≥2x DPR selection; allow 1.75x fallback for tiny tiles
  - [x] 1.5 Verify no CSS upscaling (naturalWidth ≥ clientWidth × DPR)

- [x] 2.0 Implement DPR-aware selection in `OptimizedImage`
  - [x] 2.1 Add helper to build AVIF/WebP/JPEG srcsets per variant with width descriptors
  - [x] 2.2 Pass accurate `sizes` from grid; ensure Next/Image gets `blurDataURL` only when supported
  - [x] 2.3 Guard DOM props leakage in tests (avoid passing non-Next props to plain `img`)
  - [x] 2.4 Add unit tests for srcset/sizes construction

- [x] 3.0 Implement lightbox viewport-fit scaling and navigation polish
  - [x] 3.1 Compute max display rect = viewport minus 12px border; preserve AR, no overflow
  - [x] 3.2 Ensure arrows (click/keyboard) and ESC close work on desktop and mobile
  - [x] 3.3 Add swipe support or larger tap targets on mobile
  - [x] 3.4 Manage focus trapping and aria roles for accessibility

- [x] 4.0 Provide high-res multi-format srcsets (AVIF/WebP/JPEG) for lightbox
  - [x] 4.1 Serve xlarge (~4000px) or original when smaller; include 1x/2x width candidates
  - [x] 4.2 Order sources AVIF → WebP → JPEG; fallback safe
  - [x] 4.3 Use `sizes="100vw"` in lightbox and verify DPR selection on retina

- [x] 5.0 Enhance E2E to verify crispness and no overflow
  - [x] 5.1 Add check: naturalWidth ≥ clientWidth × devicePixelRatio (sample N tiles)
  - [x] 5.2 Verify lightbox image never exceeds viewport; border present
  - [x] 5.3 Verify arrows/keyboard navigation and swipe on mobile viewport
  - [x] 5.4 Run across Chromium/Firefox/WebKit with existing retry patterns

- [x] 6.0 Documentation and session logging
  - [x] 6.1 Update `README.md` image quality section (lightbox/grid behavior)
  - [x] 6.2 Update `tasks/SESSION-LOG.md` with changes and QA results
  - [x] 6.3 Note any perf impacts and mitigations (lazy, prefetch, formats)

---

## ✅ PRD 0003 COMPLETE!

**Total:** 18/18 subtasks complete across 6 parent tasks (1.0, 2.0, 3.0, 4.0, 5.0, 6.0)

**Key Achievements:**
- ✅ DPR-aware image serving for crisp images on high-DPI displays
- ✅ Lightbox with viewport-fit scaling, 12px border, no overflow
- ✅ Full accessibility: focus trapping, ARIA roles, keyboard navigation, swipe gestures
- ✅ Multi-format srcsets (AVIF → WebP → JPEG) with proper fallback
- ✅ Comprehensive E2E verification (crispness, viewport constraints, mobile navigation)
- ✅ Complete documentation (README.md + SESSION-LOG.md updates)

**Ready for merge to main!**

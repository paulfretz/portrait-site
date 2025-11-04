# PRD: Image Crispness (Grid) and Full-Viewport Lightbox

Last Updated: October 30, 2025  
Status: Draft (Continuation of Task 0002 – same branch `task-0002-image-quality-gallery-layout`)

## 1) Introduction / Overview
Images currently appear low-resolution/soft in galleries and when opened. This PRD defines requirements to ensure crisp image rendering in the grid and a full-viewport lightbox that fills the device (with subtle borders), never overflows, and supports clear navigation.

Goal: Deliver professional-grade image clarity and presentation across devices, prioritizing quality over size.

## 2) Goals
1. Grid images render crisp on mobile and desktop (no softness/blurriness).
2. Lightbox view fills viewport with a minimal border (portrait: vertical; landscape: horizontal), no overflow.
3. High-DPI support (2x/3x) for modern displays.
4. Maintain acceptable performance (defer cost mainly to lightbox; grid optimized but crisp).
5. Preserve SEO and accessibility (alt text, semantics).

## 3) User Stories
- As a visitor, I want gallery thumbnails to look sharp so I can evaluate the photographer’s quality.
- As a visitor, I want the opened photo to fill my screen without cropping off edges, with arrows to navigate.
- As a visitor on a retina device, I want images to remain crisp at 2x/3x density.
- As the site owner, I want image quality to reflect professional standards without noticeably slow UX.

## 4) Functional Requirements
1. Grid Crispness
   1. Generate and serve grid-appropriate sizes that map to real rendered CSS sizes (per breakpoint and column count) with 2x density variants.
   2. Ensure `sizes` and `srcset` guide the browser to select ≥1.5–2.0 DPR variants.
   3. Prefer `large` (~2400px long edge) for larger grid tiles; allow smaller rendered tiles to use `medium`, but ensure DPR ≥2 when device pixel ratio ≥2.
   4. Remove any CSS scaling that stretches images beyond their intrinsic px.

2. Lightbox Fidelity
   1. Fit image within viewport preserving aspect ratio; add subtle 8–16px border (portrait: vertical space; landscape: horizontal) so edges never touch window.
   2. Provide next/prev arrows and keyboard nav (←/→, ESC to close); ensure clear hit targets on mobile.
   3. Serve high-resolution source for lightbox: prefer `xlarge` (~4000px) where available; if original smaller use original.
   4. Provide DPR-aware `srcset` for lightbox to ensure crispness on retina.

3. Performance & UX
   1. Grid: lazy-load offscreen images; keep blur-up placeholders; no loading spinners overlaying images.
   2. Lightbox: prefetch next/prev sources on idle where feasible.
   3. Avoid CLS; maintain smooth transitions.

4. Accessibility & SEO
   1. Retain meaningful `alt` text.
   2. Ensure focus management in lightbox and proper roles/ARIA.
   3. No regression to structured data or sitemaps.

## 5) Non-Goals (Out of Scope)
- Changing upload limits or storage provider (already set: 50MB, Vercel Blob).
- Replacing the lightbox component with a 3rd-party library (refactor-in-place unless blocked).
- Non-photography pages.

## 6) Design Considerations (Optional)
- Grid
  - Mobile masonry (2 cols, 4px gaps); Desktop justified rows. Ensure computed tile width × DPR ≤ served intrinsic width.
- Lightbox
  - Backdrop: 90–95% black; close X in top-right; arrows centered vertically; swipe on mobile.
  - Subtle border: 8–16px safe area; never overflow viewport.

## 7) Technical Considerations (Optional)
- Image Variants
  - Existing: thumbnail/medium/large/xlarge/original via sharp.
  - Confirm large ≈ 2400px, xlarge ≈ 4000px long edge; JPEG Q95, WebP/AVIF quality as set in Task 0002.
- Next/Image
  - Ensure `sizes` reflects CSS reality for masonry/justified layouts; example mobile `sizes`: `(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw` (adjust per actual layout widths).
  - For lightbox: `sizes="100vw"` and srcset that includes xlarge/original where applicable.
- PhotoGrid / OptimizedImage
  - Prevent passing non-DOM props to native `img` in tests; ensure Next/Image receives `priority`, `fetchPriority`, `blurDataURL` only when using Next/Image.
- Lightbox Scaling Logic
  - Compute max display height/width = viewport minus border; scale to fit while preserving AR.
  - Preload adjacent images for smoother nav.

## 8) Success Metrics
- Visual QA: Manual inspection on MacBook Pro (2x DPR), iPhone (3x DPR), Android (3x DPR), and standard 1x display: images are crisp in grid and lightbox.
- E2E additions: tests confirm image element natural size ≥ rendered size × DPR for sampled tiles.
- No measurable increase in CLS; first interaction in grid remains responsive.

## 9) Open Questions
1. Minimum acceptable px density for grid tiles (target 1.75x vs strict 2x)?
   - Decision: Target 2x DPR where available; allow 1.75x fallback for very small tiles to avoid bandwidth spikes.
2. Border size preference for lightbox (8px, 12px, 16px)? Default to 12px.
   - Decision: 12px on all sides (consistent across devices, not cramped).
3. Keep AVIF alongside WebP/JPEG for lightbox or prefer JPEG/WebP only?
   - Decision: Keep AVIF + WebP + JPEG; order srcset as AVIF, WebP, JPEG; browser selects optimal.

---

## Implementation Plan (High-Level – will become tasks)
1. Grid
   - Audit actual rendered tile widths per breakpoint (masonry/justified) → set `sizes` precisely.
   - Ensure `srcset` includes 1x/2x width candidates mapping to existing variants.
   - Validate CSS to avoid upscaling; update `OptimizedImage` to prefer higher DPR picks.
2. Lightbox
   - Enforce viewport-fit with border; add robust scaling calc.
   - Feed `xlarge`/original sources with DPR-aware srcset; prefetch neighbor images.
   - Verify keyboard, arrows, swipe affordances.
3. Tests & Verification
   - Add E2E checks for crispness heuristics (naturalWidth/Height vs clientWidth/Height × DPR).
   - Cross-device manual QA matrix.

## Deliverables
- Code updates in `components/gallery/PhotoGrid.tsx`, `OptimizedImage.tsx`, `GalleryLightbox.tsx` (and helpers) to meet requirements.
- Adjusted `sizes/srcset` logic and lightbox scaling.
- Tests: E2E additions; update existing selectors only if needed.
- Session Log updates; documentation note in `README.md` if public behavior changes.

## Dependencies
- Existing image variants pipeline (sharp) from Task 0002 must remain intact.
- No changes required to DB schema.

## Timeline / Risk
- Est. 4–6 hours including QA across devices.
- Risks: DPR mismatch in complex layouts; need careful `sizes` tuning; potential bandwidth increase in lightbox (accepted by user).

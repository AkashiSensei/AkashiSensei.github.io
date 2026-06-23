# ACTIVE_TASK

Status: COMPLETED on 2026-06-23

## Goal

Repair visual regressions introduced during recent display/layout changes while preserving the current frosted-glass design direction.

## Issue Reference

- User request on 2026-06-23: start a new task for fixing display effects that were damaged during previous modifications.
- Specific affected screens/components:
  - `/course-projects` full listing cards should size the top image gallery from each entry's first-image aspect ratio, matching `/projects`; fixed/bounded ratios remain appropriate for resume highlights.
  - Click-to-preview large image browsers should always contain the full image inside the available dialog area instead of stretching to full width and clipping vertically.
  - Large image preview dialog outer margins should adapt to viewport shape: wide screens keep more left/right margin and minimal top/bottom margin; tall screens keep more top/bottom margin and minimal left/right margin.
  - The `road-accident-risk` image labeled "目标变量分布分析" has correct metadata (`1010 x 858`), so remaining overflow is caused by preview layout constraints rather than image dimensions.
  - Detail-page image walls should place images in source order by assigning each next image to the currently shortest column, not by CSS column flow that visually fills one column before the next.
  - Resume project highlight images should remain auto-cycling only; they must not expose manual click/keyboard/touch switching or intercept page scrolling gestures.
  - CardSwap hover pause should only respond to real hover pointers and must not treat touch gestures as carousel interaction; non-scrollable galleries should not use overscroll suppression.
- Remote freshness check: `main` was checked against `origin/main` after `git fetch origin main`; result `0 0`, current with upstream at task start.

## Implementation Details

- Kept this as a focused visual regression repair task, not a redesign.
- Preserved the active design constraints from SPEC:
  - Current frosted-glass visual system remains the active style.
  - Improved the existing layout system in place.
  - Did not reintroduce abandoned design variants, style switching, or `metal-fx`.
  - Kept mobile, standard landscape, tall/narrow workspace, and wide desktop behavior in scope.
- Updated reusable project/course gallery behavior so full listing cards can use natural first-image aspect ratios while resume highlights retain fixed/bounded ratios.
- Reworked large image preview sizing so dialog frames adapt to viewport shape and preview images render inside definite boxes with reliable `object-contain` behavior.
- Removed high-brightness overlays from large preview main image areas so letterbox/background regions match the surrounding dialog background.
- Replaced CSS-column detail image walls with a reusable shortest-column masonry layout that preserves source-order progression.
- Made resume project highlight media non-interactive while preserving automatic rotation and hover pause for true hover pointers only.

## Test Plan

- Static checks completed:
  - `npx tsc -b`
  - `npm run lint`
  - `npx vite build`
- Manual/user visual review:
  - User confirmed the large-image overflow issue was resolved before final cleanup.
- Regression focus:
  - No route contracts, theme switching, locale switching, content data ownership, or GitHub Pages `base: '/'` changes were introduced.

## Focusing Files

- `src/components/ProjectImageGallery.tsx`
- `src/components/ProjectHighlights.tsx`
- `src/components/CardSwap.tsx`
- `src/components/SmallToolImageGallery.tsx`
- `src/components/DetailImageMasonry.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/ProjectGrid.tsx`
- `src/index.css`
- `src/pages/ProjectDetailPage.tsx`
- `src/pages/KnowledgeDetailPage.tsx`
- `src/pages/SmallToolDetailPage.tsx`

## Technical Context

- This is a React + TypeScript + Vite static frontend deployed as a GitHub Pages user site.
- Vite `base` must remain `/`.
- Styling uses Tailwind CSS and project-owned shadcn/ui/Radix-based components.
- The root homepage (`/`) is friend-facing and lightweight; `/resume` is interviewer-facing and richer.
- Current design work should tune typography, spacing, card/list composition, navigation ergonomics, image treatment, section rhythm, and responsive behavior without changing the site style family.
- Agent workflow constraint: default verification should use non-interactive checks; visual/browser verification requires explicit user request.

## Task Checklist

- [x] Receive the concrete list of broken display effects from the user.
- [x] Map each issue to the affected route, viewport profile, theme, locale, and likely component/CSS owner.
- [x] Identify the smallest source changes needed for each visual regression.
- [x] Implement targeted fixes without unrelated redesign or source-of-truth content churn.
- [x] Run relevant typecheck/lint verification.
- [x] Report changed files, verification result, and any visual review notes still requiring user confirmation.

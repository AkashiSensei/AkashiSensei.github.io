# ACTIVE_TASK

Status: COMPLETED on 2026-06-24

## Goal

Fix the mobile resume project-card swap bug by giving the changing project text area a stable display height during card transitions.

## Issue Reference

- User-reported mobile bug: during project card switching, the text description disappears briefly and different project copy lengths make the page height flicker.
- No external issue link provided.

## Implementation Details

- Scope the fix to the resume project highlight carousel/text area, not the generic project listing cards or detail pages.
- The likely target is the active project copy panel in `ProjectFeatureRow` inside `src/components/ProjectHighlights.tsx`.
- Current behavior: the copy panel has fixed heights only at `md` and larger breakpoints, while mobile uses natural content height. Because the panel is keyed by `project.id` and uses the `project-feature-copy-swap` animation, each project swap can unmount/remount text with different mobile heights.
- Add a mobile-only stable height for the project text display area by measuring every showcased project's rendered copy block in the current locale/viewport, then using the tallest block as the active panel height.
- Keep the solution responsive and conservative:
  - Mobile below `768px` should reserve exactly enough height for the longest current highlighted project copy without causing overlap or requiring inner scrolling.
  - `md` and larger existing fixed-height behavior should stay visually unchanged unless implementation cleanup requires a tiny alignment adjustment.
  - The text area should remain readable and clipped intentionally if needed, with no horizontal overflow.
  - Preserve current data-driven content, i18n keys, CardSwap behavior, theme support, and animation preference behavior.
- Prefer Tailwind utility changes in `ProjectHighlights.tsx`; add CSS in `src/index.css` only if a named responsive class is cleaner than dense utility values.

## Test Plan

- Run `npm run build` after implementation to verify TypeScript and Vite production build.
- Run `npm run lint` if the code change touches logic or introduces new class composition.
- Manual user check on mobile/narrow viewport:
  - Open `/resume` on a phone-width viewport.
  - Wait for automatic project card switching.
  - Confirm the text description no longer disappears in a jarring way.
  - Confirm page height does not jump/flicker when switching between projects with different title/summary/bullet lengths.
  - Confirm Chinese and English text remain readable at narrow widths.

## Focusing Files

- `src/components/ProjectHighlights.tsx`
- `src/index.css`
- `src/components/CardSwap.tsx`
- `src/content/locales/zh/projects.json`
- `src/content/locales/en/projects.json`

## Technical Context

- SPEC mobile requirement: mobile quality is first-class; all page designs must work down to `320px` before desktop polish is considered complete.
- SPEC responsive rule: below `768px` is canonical narrow/mobile behavior; `md` and above may use wider card-grid behavior.
- SPEC design direction: improve the current frosted-glass visual system in place rather than introducing a new style family.
- SPEC verification constraint: unless explicitly requested, do not start a dev server or inspect the site in a browser; default verification should use build/typecheck/lint.
- ROADMAP context: the project highlight carousel was added as a GSAP CardSwap stack, and recent display regression fixes touched resume project carousel behavior. This fix should be narrow and regression-oriented.

## Task Checklist

- [x] Inspect the mobile copy panel height behavior in `ProjectHighlights.tsx` and identify the smallest stable-height change.
- [x] Add a mobile-only measured height for the project text display area while preserving existing `md+` heights.
- [x] Ensure title, repo links, tags, summary, visible points, and detail link fit cleanly within the reserved area on mobile.
- [x] Avoid changing project data, translations, routing, CardSwap timing, or desktop layout unless required by the fix.
- [x] Run non-browser verification (`npm run build`; lint if warranted).
- [x] Report the exact files changed and any manual mobile checks still needed from the user.

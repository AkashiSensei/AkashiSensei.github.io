# ACTIVE_TASK

Status: COMPLETED on 2026-06-15

## Goal

Perform a site-wide layout and spacing pass that improves overall page rhythm, responsive composition, and content density while preserving the current frosted-glass visual system.

## Issue Reference

- None. User-requested planning task.

## Implementation Details

- Scope the work as an overall composition pass, not detail-only polish:
  - Rebalance global shell padding, maximum widths, top/bottom breathing room, and navigation offset across the main viewport profiles.
  - Improve the root homepage as a lightweight friend-facing entry, keeping it calm and readable instead of expanding it into a showcase.
  - Improve `/resume` section rhythm, hero sizing, section gaps, and highlight-module cadence so the page feels intentional on mobile, standard landscape, standard portrait/tall workspace, and wide desktop.
  - Review shared highlight/list/grid components only where their spacing or density affects the whole-page layout.
  - Keep typography compact and restrained; reserve display scale for true hero moments.
- Preserve existing product boundaries:
  - Do not introduce a new visual style family, style switcher, design registry, or special effect direction.
  - Do not duplicate structured content or move entity data into React source.
  - Do not change route contracts, theme behavior, locale behavior, or GitHub Pages `base: '/'`.
  - Do not add browser automation or visual screenshots unless explicitly requested by the user.
- Trade-off / challenge:
  - The request is intentionally broad, so implementation should avoid drifting into unrelated micro-polish. Treat the pass as layout-system cleanup with a few representative pages/components, then stop when the global rhythm is coherent.
  - This is a reasonable time for the task because recent archived work added/resized several visible sections; a unifying layout pass can reduce accumulated spacing decisions.

## Test Plan

- Static checks:
  - Run the existing build/typecheck path from project scripts.
  - Run lint if an existing lint script is available and practical.
- Manual review checklist for the user or an explicitly authorized browser pass:
  - Mobile: 320px-767px, no horizontal overflow, stable bottom navigation, readable single-column rhythm.
  - Standard portrait/tall workspace: natural scrolling; no forced landscape-like section composition.
  - Standard landscape: balanced hero and highlight cadence; controlled line lengths.
  - Wide desktop: richer use of horizontal room without over-stretched text.
  - Light/dark and Chinese/English spot checks for text fit and contrast.

## Focusing Files

- `src/components/Layout.tsx`
- `src/index.css`
- `src/pages/HomePage.tsx`
- `src/pages/ResumePage.tsx`
- `src/components/Navbar.tsx`

## Technical Context

- Current active style: improve the existing frosted-glass visual system in place; do not introduce a new style family.
- Design work should focus on layout system, typography, spacing, card/list composition, navigation ergonomics, image treatment, section rhythm, and responsive behavior.
- Required viewport profiles: mobile, standard portrait/tall workspace, standard landscape, and wide desktop.
- Mobile quality must work down to 320px before desktop polish is considered complete.
- Card-grid narrow-to-wide behavior should treat `md` / 768px as the canonical threshold; avoid using `sm` / 640px as the wide-card threshold.
- Text should use the centralized `text-tone-1` through `text-tone-5` scale for ordinary foreground hierarchy when editing components.
- Agent workflow constraint: unless the user explicitly asks for local preview or browser verification, use non-interactive checks rather than starting a dev server or inspecting the site in a browser.

## Task Checklist

- [x] Audit current shell, homepage, resume, navbar, and shared highlight spacing against the viewport profiles.
- [x] Define a small set of layout rhythm targets for page padding, section gaps, hero sizing, and card/grid density.
- [x] Adjust `Layout` and global CSS tokens/classes so shell spacing is centralized where practical.
- [x] Tune homepage vertical composition and CTA grouping without adding showcase content.
- [x] Tune resume hero/section cadence and highlight-module spacing without changing content data.
- [x] Review navbar spacing/offset interactions with page shell on mobile, compact tablet, and desktop.
- [x] Run build/typecheck and lint if available.
- [x] Summarize changed layout rules and any remaining visual-review risks.


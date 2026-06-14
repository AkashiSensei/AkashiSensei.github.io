# ACTIVE_TASK

## Goal

Track and implement small visual / presentation polish items on the existing site design, while keeping the current frosted-glass visual system intact.

## Issue Reference

- No external issue or PR reference yet.
- User request: start a new task for ongoing miscellaneous display-effect optimization; concrete items will be discussed incrementally.

## Implementation Details

- Treat this as a focused polish queue, not a redesign.
- Preserve the current design direction: improve the existing frosted-glass system in place rather than adding new style variants, style switching, or heavy special effects.
- Capture each incoming polish item here before implementation when it materially changes scope, target files, or verification needs.
- Current polish item: remove default light / glow effects from navbar surfaces and frosted-glass cards; show the light treatment only on hover or keyboard focus.
- Prefer small, reversible changes to typography, spacing, contrast, card/list composition, image treatment, section rhythm, hover/focus behavior, and responsive behavior.
- Do not duplicate structured content in React components. If a polish item needs copy or content changes, keep them in the existing data / i18n structures.
- Maintain theme and locale behavior across Chinese, English, Italian, and Japanese surfaces.
- Respect the agent workflow constraint: unless the user explicitly asks, do not start a dev server or inspect the site in a browser.

## Test Plan

- Run the smallest relevant non-interactive check after code changes, usually `npm run build`.
- If a change touches TypeScript contracts or shared data structures, include the project's type/build validation.
- For visual-only changes, provide manual review notes covering mobile, standard landscape, standard portrait / tall workspace, and wide desktop profiles.
- Browser screenshot / responsive verification is user-owned unless explicitly delegated.

## Focusing Files

- `src/index.css`
- `src/pages/HomePage.tsx`
- `src/pages/ResumePage.tsx`
- `src/components/GlassPanel.tsx`
- `src/components/SpotlightCard.tsx`
- `src/components/SpotlightCard.css`

## Technical Context

- Static React + TypeScript + Vite site deployed as a GitHub Pages user site; Vite `base` must remain `/`.
- Styling foundation is Tailwind CSS with owned shadcn/ui-style components on Radix primitives.
- Current active design direction: frosted-glass visual system only; improve it in place.
- Avoid generic AI-design fingerprints: purple/blue glow defaults, decorative gradient blobs, excessive glass cards, symmetrical three-card rows, indistinct pill-heavy UI, and one-viewport-only compositions.
- Mobile quality is first-class; designs must work down to 320px.
- Responsive profiles to preserve: mobile, standard portrait / tall workspace, standard landscape, and wide desktop at 1600px+.
- Normal foreground text should use the centralized `text-tone-1` through `text-tone-5` contrast scale rather than ad hoc foreground opacity.
- Runtime images referenced by UI/content should use WebP when assets are added or replaced, with bright screenshots marked for dark-mode brightness handling.

## Task Checklist

- [x] Confirm context root and current branch freshness.
- [x] Read SPEC and ROADMAP constraints for the current design direction.
- [x] Reconstruct this active task as the tracking cache for display polish.
- [x] Collect concrete polish items from the user and append / refine implementation notes as needed.
- [x] Identify exact affected files for each polish item before coding.
- [x] Implement approved polish changes in small batches.
- [x] Run relevant build/type/lint checks after implementation.
- [x] Summarize changed surfaces and manual visual review targets for the user.

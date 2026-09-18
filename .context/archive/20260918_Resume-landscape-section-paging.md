# ACTIVE_TASK

Status: COMPLETED on 2026-09-18

## Goal

Make `/resume` PageUp/PageDown snap exactly one desktop-landscape full-screen section, matching homepage FPV stepping, while leaving native paging in plain/portrait/mobile.

## Issue Reference

- None. User-requested planning task.

## Implementation Details

- Scope is keyboard paging on the visual `/resume` only. Do not change wheel/trackpad, Space/Home/End, FPV homepage keys, or CSS section heights.
- Activate only when visual resume is mounted (`ResumePage`, not `ResumePlainExperience`) **and** the same media query as the 100svh layout matches: `(min-width: 768px) and (orientation: landscape)`. If the query does not match, do not `preventDefault`.
- Snap targets are the existing full-screen blocks: `.resume-hero-section` and `.resume-rhythm-section`. Find the adjacent section from current `scrollY` with a small “already at this page” epsilon so repeated PageDown does not stick.
- After the last section, PageDown may reach page end so `SiteFooter` stays reachable; PageUp from the footer returns to the last section.
- Mirror homepage key hygiene: capture-phase `keydown`, ignore editable targets and open dialogs/menus, cancel an in-flight animation on wheel/touch. Do **not** copy FPV’s 2000ms timeline tween; resume pages are static sections, so use a short ease (~300–500ms) and jump instantly under `prefers-reduced-motion`.
- Do not add CSS `scroll-snap`; it would change mouse/trackpad scrolling, which is out of scope.
- Do not extract FPV timeline helpers. A small resume-local hook/module is enough; share only a tiny editable-target check if it stays simpler than duplicating.

## Test Plan

- Static: `npm run build` / typecheck / lint as available. No browser automation unless the user asks.
- Manual (user):
  - Landscape desktop, full and static modes: PageDown/PageUp land on the next/previous 100svh section; last PageDown can still reveal the footer.
  - Plain mode: native PageUp/PageDown, no custom snap.
  - Portrait/tall ≥768px and mobile: native paging, keys not intercepted.
  - Contact dialog / focused input: keys do not steal paging.
  - Resize/rotate between landscape and portrait: behavior follows the live media query.

Verification completed:

- `npx tsc -b` and `npm run lint` passed.
- User reviewed the implementation and accepted remaining trade-offs (in-flight skip, wheel cancel, no agent browser pass). Overlay detection was explained and left as-is.

## Focusing Files

- `src/pages/ResumePage.tsx`
- `src/hooks/use-resume-landscape-section-paging.ts`
- `src/components/ResumePlainExperience.tsx` (must stay unmodified for paging)
- `src/components/HomeFpvExperience.tsx` (reference only)
- `src/index.css` (landscape `100svh` contract; no layout change expected)

## Technical Context

- Visual `/resume` landscape: `.resume-rhythm-section` / `.resume-hero-section` are `height: 100svh` under `(min-width: 768px) and (orientation: landscape)`.
- Plain `/resume` mounts `ResumePlainExperience` inside `plain-home-main`; no full-screen sections.
- Homepage analog lives in `HomeFpvExperience` key handler (`PageUp`/`PageDown` → adjacent screen time). Plain home never mounts that handler.
- Agent workflow: no local preview/browser inspection unless the user explicitly asks; prefer build/type/lint.

## Task Checklist

- [x] Add a resume-local landscape section-paging hook and wire it only in visual `ResumePage`.
- [x] Gate on the landscape 100svh media query; leave plain/portrait/mobile on native paging.
- [x] Snap to adjacent hero/rhythm sections; allow footer as the terminal PageDown target.
- [x] Ignore editable targets and open dialogs; cancel tween on wheel/touch; honor reduced motion.
- [x] Run build/typecheck/lint; do not start a browser pass unless requested.

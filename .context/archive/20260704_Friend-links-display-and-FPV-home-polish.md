# ACTIVE_TASK

Status: COMPLETED on 2026-07-04

## Goal

补充新的友链，并重构友链展示/数据处理，使短 quote 和较长“想说的话”都能在 FPV 首页与朴素首页中稳定展示。

## Issue Reference

- No external issue link provided.
- User request on 2026-07-02: “补充新的友链，并增加显示方式和处理方式，适应更长的想说的话等。”
- Remote freshness checked: `main` tracking `origin/main`; after `git fetch`, `git rev-list --left-right --count main...origin/main` returned `0 0`, so the relevant branch was current at task start.
- Existing unrelated worktree changes observed and preserved outside this task scope: generated GitHub stats JSON modification plus homepage FPV video assets under `public/assets/homepage-fpv/`.

## Completed Outcome

- Added new friend links for Tony, 末苏, 森林里上蹿下跳的蘑菇, and Hathoric with public WebP avatars.
- Updated zh/en friend-link copy, including concise English translations for short “想说的话” content.
- Tuned FPV friend capsules so nickname / ID stays single-line, quote previews use a fixed display-length cap, and full quotes are available on hover/focus.
- Reworked desktop friend capsule width calculation to use the larger of nickname / ID width and quote-preview width, then clamp by max width.
- Reworked friend capsule wrapping so desktop uses a wide but bounded area and mobile can use the available phone width.
- Added desktop HUD-safe inline space so friend capsules do not collide with the left page selector or right time/frame display.
- Stabilized mobile friend capsule geometry, avatar alignment, and truncation behavior after several visual iterations.
- Adjusted mobile first-screen text rows so tag/maxim/line-stack content uses the phone’s available width instead of fixed rem limits.
- Preserved plain display mode behavior and fixed the plain-to-full mode switch regression where homepage foreground copy could disappear.
- Kept the current frosted-glass / FPV visual language and avoided unrelated route or IA changes.

## Implementation Details

- Friend-link content remains locale-driven through `fpv.page06.links`, with runtime validation before rendering.
- FPV capsules now compute per-link CSS custom properties for desktop and mobile copy widths.
- The quote preview is capped by `FRIEND_QUOTE_MAX_DISPLAY_UNITS`; display width is calculated separately so short IDs do not force premature quote ellipsis.
- Desktop friend layout reserves a HUD-safe inline region using CSS custom properties around `.fpv-page-06-friends`.
- Mobile friend layout uses compact fixed-height capsules with content-width-driven wrapping and screen-width caps.
- Hover/focus handling shows the existing greeting plus a basic full-quote tooltip on desktop.
- WebP friend avatars are stored under `public/assets/friend-links/`.

## Verification

- `./node_modules/.bin/tsc -b`
- `npm run lint`
- `./node_modules/.bin/vite build`
- The Vite build continued to report the existing large chunk warning only.
- Visual review was performed iteratively by the user through screenshots for mobile and desktop capsule spacing and truncation behavior.

## Focusing Files

- `src/content/locales/zh/home.json`
- `src/content/locales/en/home.json`
- `src/components/home-fpv/screens/Page06.tsx`
- `src/components/HomeFpvExperience.tsx`
- `src/pages/HomePage.tsx`
- `src/index.css`
- `public/assets/friend-links/hathoric.webp`
- `public/assets/friend-links/mosu.webp`
- `public/assets/friend-links/mushroom-forest.webp`
- `public/assets/friend-links/tony.webp`

## Technical Context

- SPEC: root `/` is friend-facing, clean, lightweight, public-safe, and should keep concise intro/contact/profile/resume affordances without becoming the full resume page.
- SPEC: content should be data-driven and separated from UI chrome strings; entries need stable ids where they are maintained as structured content.
- SPEC: mobile quality is first-class down to 320px; layouts must avoid horizontal overflow and incoherent text overlap.
- SPEC: current frosted-glass visual system remains active; improve it in place rather than introducing a new style family.
- SPEC: root homepage FPV media is route-scoped, must respect animation/reduced-motion preferences, and plain display mode must remain compatible with theme, locale, navigation, contact dialog, and static GitHub Pages deployment.

## Task Checklist

- [x] Confirm or receive the new friend-link entries, including avatars/assets and long-message copy.
- [x] Decide final data shape for friend links with stable ids and optional long-message fields.
- [x] Update zh/en friend-link content and any required avatar assets.
- [x] Refactor friend-link rendering helpers so FPV uses validated records and stable width calculation.
- [x] Update FPV friend-link UI for compact summaries plus long-message access.
- [x] Preserve plain homepage friend-link readability and mode switching behavior.
- [x] Tune CSS for mobile, tall/narrow desktop, standard desktop, dark/light themes, and overflow safety.
- [x] Run typecheck/build and targeted validation.
- [x] Hand off concise manual review notes for visual checks.

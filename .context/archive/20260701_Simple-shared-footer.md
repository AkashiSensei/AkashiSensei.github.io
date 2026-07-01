# ACTIVE_TASK

Status: COMPLETED on 2026-07-01

## Goal
Add a shared, restrained, elegant, high-end, simple, mobile-safe footer across the public site.

## Issue Reference
User request on 2026-06-30: “为我们的网站添加规范、朴素、典雅、高端、简单、跨页面共享的，适配移动端的 footer。”

Remote freshness checked before planning: `main` tracking `origin/main`; `git fetch origin` succeeded; `main...origin/main` was `0 0`, so the branch was current before implementation.

## Implementation Details
- Implemented the footer as part of the shared site shell instead of repeating markup in individual pages.
- Added a `SiteFooter` component rendered from `Layout`, since current public pages already use `Layout`.
- Kept the footer quiet and editorial: compact typography, modest spacing, pure-color footer background, no decorative blobs, no nested cards, and no dense sitemap.
- Used the existing visual token approach while giving the footer its own pure-color background and theme-aware foreground/rule variables.
- Added route-aware breadcrumbs at the top of the footer, with `Akashi` as the breadcrumb root and localized labels for section/detail pages.
- Added stable public navigation links, GitHub/profile contact affordances, and current site setting summaries below the footer divider.
- Added footer setting summaries for color theme, display effects, and language; aligned the separator glyphs and moved the block above copyright.
- Preserved mobile behavior with single-column layout, enough bottom padding for the fixed mobile navbar, and no horizontal overflow-oriented structure.
- Kept copy in `common.json` instead of hardcoding user-facing footer text.
- Preserved homepage FPV, low-animation, and plain display modes; the footer does not mount expensive visual effects.
- Updated the color theme control from a two-state click toggle to a menu matching the display-effects menu, restoring explicit access to `system`, `light`, and `dark` theme modes.

## Test Plan
- Run the project’s non-interactive verification command, preferably `npm run build`; use typecheck/lint as available from `package.json`.
- Inspect generated TypeScript errors for i18n key or component import issues.
- Manual user check after implementation: mobile 320px/390px, standard desktop, tall/narrow desktop; verify footer spacing, text wrapping, dark/light theme, locale switch, and bottom navbar clearance.
- Do not start a dev server or browser verification unless explicitly requested.

## Verification
- [x] `npm run lint`
- [x] `npm run build`

## Focusing Files
- `src/components/Layout.tsx`
- `src/components/SiteFooter.tsx`
- `src/components/Navbar.tsx`
- `src/content/locales/zh/common.json`
- `src/content/locales/en/common.json`
- `src/index.css`

## Technical Context
- Stack: React + TypeScript + Vite + Tailwind + shadcn/ui/Radix where useful.
- GitHub Pages user site: Vite `base` remains `/`; routes stay root-relative.
- Active visual system: improve the existing frosted-glass style in place; do not introduce a new style family or style switcher.
- Mobile quality is mandatory down to 320px; bottom fixed navigation exists on mobile and must not obscure footer content.
- Normal foreground text should use centralized tone variables rather than ad hoc opacity values.
- UI copy should stay in locale files; Chinese is source of truth, English is AI-drafted and human-reviewed before publish.
- Agent workflow: default verification is build/typecheck/lint; no dev server/browser unless explicitly requested.

## Task Checklist
- [x] Audit `Layout`, existing page main padding, and mobile fixed navbar spacing.
- [x] Design a compact `SiteFooter` information architecture with public-safe links/copy.
- [x] Add localized footer copy in `common.json` for Chinese and English.
- [x] Implement `SiteFooter` and render it from `Layout`.
- [x] Tune responsive footer styling for mobile, standard desktop, tall/narrow desktop, and wide desktop.
- [x] Add route-aware footer breadcrumbs.
- [x] Add current setting summaries for theme, display effects, and language.
- [x] Restore explicit menu selection for `system`, `light`, and `dark` theme modes.
- [x] Verify with non-interactive build/typecheck/lint.
- [x] Summarize implementation and any visual checks left for the user.

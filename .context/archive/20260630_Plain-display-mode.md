# ACTIVE_TASK

Status: COMPLETED on 2026-06-30

## Goal

Add a user-selectable plain display mode for the root homepage (`/`) that avoids the costly FPV scene while preserving the friend-facing entry experience, then extend the plain-mode treatment across resume/module/detail pages so the low-distraction experience remains complete and navigable.

## Issue Reference

No external issue. User request on 2026-06-29: provide a new "plain" display mode.

Remote freshness checked before planning: `main` tracks `origin/main`; after `git fetch origin`, both refs are current at `a4b7161` with `0	0` ahead/behind commits.

## Implementation Details

- Extended the display preference from `full | static` to `full | static | plain`: `full` keeps the complete FPV/atmosphere effects, `static` keeps the current low-animation atmosphere, and `plain` renders lightweight document-style pages.
- Kept this separate from the previously paused global design-style switch. The mode does not introduce a design variant registry or alternate site-wide theme.
- Added persistent user preference for the display mode using the existing localStorage/context pattern.
- Exposed a compact icon control in the navigation/menu surface with translated title/ARIA labels.
- In plain mode, `/` does not mount `HomeFpvExperience`; it avoids loading FPV videos, camera track, Three.js/CSS3D scene, and scroll-scrub listeners.
- Built `HomePlainExperience` using existing home i18n copy and public-safe CTAs: online resume, contact dialog, GitHub/profile link, concise intro, simple friend-link cards, markdown-like bullets, section dividers, and centralized text rhythm.
- Added `ResumePlainExperience` and plain-mode module/index/detail surfaces for projects, course projects, knowledge, tools, and workbench.
- Preserved key content in plain mode: project/course/tool/knowledge images, auto-cycling galleries, large image previews, repo links, repo tags, GitHub stars/commits, tags, and detail links.
- Tuned plain-mode project/course/knowledge/tool/workbench listing pages to use low-distraction two-column masonry on desktop and single-column layouts on mobile.
- Implemented plain-mode workbench software icon bars, resume project masonry ordering, staggered project image rotation, mobile-safe repo metadata wrapping, and stronger light-mode tag borders.
- Preserved theme, locale, contact dialog, routing, reduced-motion behavior, GitHub Pages root hosting assumptions, and current frosted-glass mode behavior.
- Reduced-motion consideration: if the user has no stored preference and `prefers-reduced-motion: reduce` is active, the app still defaults to `static` so the visual experience remains recognizable while avoiding high-cost motion.

## Test Plan

- Type/build check: run the repository's non-interactive verification command, expected to include `npm run build`.
- Targeted static checks:
  - Verify the plain mode branch does not render/mount `HomeFpvExperience`.
  - Verify mode preference persists and recovers from invalid localStorage values.
  - Verify translated labels exist for Chinese and English.
  - Verify plain resume/module/detail pages preserve images, repo metadata, tags, and links.
  - Verify mobile plain-mode repo metadata wraps without horizontal page overflow.
- Manual/user visual review after implementation:
  - Toggle between cinematic and plain modes on `/`.
  - Check mobile width, standard desktop landscape, and tall/narrow desktop.
  - Confirm `/resume` and module routes remain usable in both display modes.

Verification completed:

- `npx tsc -b --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed earlier in the task. GitHub stats network fetches failed in the sandbox, but the existing fallback/previous-snapshot behavior kept the build green.
- `curl -I http://localhost:5173/` returned `HTTP/1.1 200 OK` earlier in the task.
- Automated browser verification was attempted through Playwright earlier, but Playwright browser binaries / system Chrome were unavailable in the tool environment.
- Later visual refinements were verified with repeated `npm run lint` and `npx tsc -b --pretty false`; per user instruction, no dev server or browser verification was started unless explicitly requested.

## Focusing Files

- `src/pages/HomePage.tsx`
- `src/components/HomeFpvExperience.tsx`
- `src/components/HomePlainExperience.tsx`
- `src/components/ResumePlainExperience.tsx`
- `src/components/PlainDetailPage.tsx`
- `src/components/PlainIndexPage.tsx`
- `src/components/PlainProjectIndexPage.tsx`
- `src/components/PlainKnowledgeIndexPage.tsx`
- `src/components/PlainToolIndexPage.tsx`
- `src/components/PlainWorkbenchIndexPage.tsx`
- `src/components/PlainWorkbenchSoftwareBar.tsx`
- `src/components/animation-provider.tsx` and `src/components/Navbar.tsx`
- `src/content/locales/{zh,en}/home.json`, `src/content/locales/{zh,en}/common.json`, `src/content/locales/{zh,en}/resume.json`, and `src/index.css`

## Technical Context

- SPEC: root homepage is a clean, lightweight, friend-facing entry point with concise intro, online-resume CTA, public contact entry, and GitHub/profile link.
- SPEC: FPV video scroll timeline is route-scoped to `/` and must respect animation preference, reduced motion, mobile/unsupported-browser fallbacks, and static deployment.
- SPEC: current frosted-glass visual system remains the active site style; do not reintroduce user-facing global style switching or a design-variant registry in this phase.
- SPEC: theme and locale support remain first-class; visual changes must not break route contracts or i18n ownership.
- SPEC: agents should use build/type/lint/script verification by default and should not start a dev server or browser verification unless explicitly requested.

## Task Checklist

- [x] Confirm final product semantics: display mode, not global style switching.
- [x] Add a typed persistent display-mode state with validation and reduced-motion-aware default.
- [x] Add a navbar/menu control for toggling cinematic/static/plain mode with icon-only UI and translated accessibility strings.
- [x] Implement `HomePlainExperience` with low-cost layout, existing public-safe copy, resume/contact/GitHub actions, and responsive styling.
- [x] Route `HomePage` to render plain or FPV experience based on the selected display mode.
- [x] Ensure plain home mode skips FPV videos, camera JSON fetch, Three/CSSD scene creation, and scroll timeline listeners.
- [x] Add/update Chinese and English i18n keys for display-mode labels and plain-mode copy.
- [x] Add plain resume rendering with complete projects, course projects, interests, workbench, knowledge, and tools sections.
- [x] Add plain module/index/detail routes for projects, course projects, knowledge, tools, and workbench.
- [x] Preserve images, repo metadata, repo tags, star/commit counts, semantic tags, and detail links in plain mode.
- [x] Tune plain-mode typography, bullets, section dividers, max widths, title/subtitle spacing, supplemental copy spacing, and light-mode tag contrast.
- [x] Make plain-mode desktop listings use two-column masonry where appropriate and mobile listings use one column without horizontal overflow.
- [x] Fix plain-mode galleries and mobile repo metadata ordering/wrapping.
- [x] Run non-interactive verification and summarize any remaining manual visual checks.

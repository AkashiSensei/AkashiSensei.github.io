# ACTIVE_TASK

Status: COMPLETED on 2026-06-03

## Goal

Redesign the site information architecture and migrate routing to React Router so `/` becomes a clean friend-facing homepage and the existing resume-like homepage experience moves to `/resume`.

## Issue Reference

No external issue. User request on 2026-06-02.

## Implementation Details

- Keep the project on the GitHub Pages user-site routing model (`base: "/"`); do not introduce project-site prefixes.
- Preserve existing module routes and behavior: `/projects`, `/course-projects`, `/workbench`, `/tools`.
- Add a dedicated `/resume` route for the current interviewer-facing electronic resume / showcase flow.
- Rework root `/` into a simpler homepage for friends and casual visitors. It should avoid the current full module highlight stack, while keeping a concise intro, Akashi subtitle, online-resume CTA, public contact button, and GitHub activity link.
- Move the softer visitor-facing copy ("感谢您的访问..." / under-construction note) from `/resume` to `/`; keep `/resume` focused on career/showcase content.
- Rename the resume "方向" section heading to "兴趣" in displayed copy while keeping existing data/module structure.
- Module page top-left arrows should behave as real browser/app back buttons, returning to the page that opened the module; direct module visits fall back to `/resume`.
- Keep public-contact/privacy constraints: no downloadable private resume files or privacy-heavy attachments.
- Migrate from the current custom pathname switch to React Router as part of this task.
- Use React Router for route declarations, navigation links, route matching, fallback/404 handling, and future detail/nested route readiness.
- Keep GitHub Pages direct-route refresh support working after the migration.
- Navigation should make the distinction between Home and Resume clear without crowding the mobile nav.
- Copy should be split cleanly across existing i18n namespaces or a new namespace if the resume page needs distinct wording.

## Test Plan

- Unit/static: run TypeScript build and lint if available.
- Manual routing: verify `/`, `/resume`, `/projects`, `/course-projects`, `/workbench`, and `/tools` render the intended pages through React Router.
- Manual GitHub Pages fallback: verify direct navigation/refresh behavior still works for client routes.
- Manual fallback: verify an unknown route shows an intentional 404/fallback rather than silently rendering the homepage.
- Responsive UI: inspect narrow mobile widths down to 320px and desktop layout; no nav overflow or clipped controls.
- Content/i18n: verify Chinese and English copy for the new homepage/resume nav labels and page titles.
- Interaction: verify module-page back arrows return to `/` when entered from the homepage and to `/resume` when entered from the resume page.
- Layout polish: verify homepage paragraph rhythm distinguishes paragraph gaps, explicit line breaks, and automatic wraps.

## Focusing Files

- `src/App.tsx`
- `src/main.tsx`
- `src/lib/navigation.ts`
- `src/components/AppLink.tsx`
- `src/components/BackButton.tsx`
- `src/components/GitHubMark.tsx`
- `package.json`
- `src/pages/HomePage.tsx`
- `src/pages/ResumePage.tsx`
- `src/components/Navbar.tsx`
- `src/content/locales/zh/home.json` / `src/content/locales/en/home.json` / `src/content/locales/*/nav.json`
- `src/content/locales/zh/directions.json` / `src/content/locales/en/directions.json`

## Technical Context

- Context root: `.context/`.
- Remote freshness checked before planning: current branch `main`, upstream `origin/main`, state `0/0` after `git fetch origin`.
- SPEC: GitHub Pages user site at `https://akashisensei.github.io/`; Vite `base` must remain `/`.
- SPEC: root homepage is now friend-facing and simple; `/resume` is the interviewer-facing electronic resume / career showcase.
- SPEC: routing should use React Router for route declarations, route matching, navigation, fallback/404 handling, and future nested/detail routes.
- SPEC: existing module routes stay stable: `/projects`, `/course-projects`, `/workbench`, `/tools`.
- The old custom navigation/pathname layer (`src/lib/navigation.ts`) has been removed; `App.tsx` now uses React Router routes.
- Current implementation uses `BackButton` on module pages for history-aware back behavior, with `/resume` as fallback for direct visits.
- Current homepage copy is intentionally friend-facing: concise welcome, Akashi subtitle, online-resume CTA, contact, GitHub activity, and visitor-facing under-construction note.

## Task Checklist

- [x] Add React Router dependency and wire the app through a browser router compatible with the existing GitHub Pages user-site setup.
- [x] Replace the custom `usePathname` / `navigate` route switch with declarative React Router routes.
- [x] Split the current `HomePage` experience into a new `ResumePage` while preserving the highlight/showcase flow.
- [x] Rebuild `HomePage` as a simpler friend-facing first screen with concise intro and an online-resume CTA.
- [x] Add `/resume` route handling, page title metadata, and an intentional unknown-route fallback.
- [x] Update navbar links and labels so Home and Resume are both discoverable while existing module routes remain unchanged.
- [x] Update i18n copy for the new homepage/resume distinction in Chinese and English; add IT/JA placeholders or translations only if the current locale structure requires it.
- [x] Verify all relevant routes, mobile navigation, direct refresh behavior, build, and lint.
- [x] Move the Akashi subtitle and visitor-facing under-construction note to the root homepage.
- [x] Add contact and GitHub activity buttons to the root homepage.
- [x] Tune homepage paragraph rhythm so paragraph gaps, explicit line breaks, and automatic wrapping have distinct spacing.
- [x] Rename the displayed resume section heading from "方向" to "兴趣" / "Interests".
- [x] Replace fixed module-page back links with history-aware back buttons and verify `/` → module → `/` plus `/resume` → module → `/resume`.

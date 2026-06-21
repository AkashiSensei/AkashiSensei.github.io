# Background Effects Tuning

Status: COMPLETED on 2026-06-22

## Goal

Reset the site/page background away from the previous plain-color treatment while preserving the existing frosted-glass visual system.

## Issue Reference

- No external issue link or ID provided.
- Task initiated on 2026-06-19.
- Git freshness checked before planning: local `main` was current with `origin/main` (`main...origin/main` = `0 0`) after `git fetch origin`.

## Implementation Details

- Integrated React Bits `LightRays` as the reusable site-level top background effect using the jsrepo-provided component and `ogl`.
- Integrated React Bits `LiquidEther` for the resume page's later sections using `three`, lazy loading, and route-scoped rendering.
- Centralized top light-ray parallax speed as `LIGHT_RAYS_PARALLAX_SPEED` so future speed changes apply across pages from one constant.
- Kept `LightRaysBackground` mounted across route changes to avoid WebGL canvas teardown/recreation flicker during navigation.
- Restricted Liquid Ether to the resume route; non-resume pages now keep the shared top LightRays treatment only.
- Tuned LightRays for dark and light modes, including subdued black rays for light mode and white rays for dark mode.
- Tuned Liquid Ether for light/dark palettes, scroll-position color progression, brightness, saturation, opacity, fade-in timing, and resume-section transition behavior.
- Added smooth fade choreography: LightRays fades from the first scroll through the project boundary, while Liquid Ether fades in over a longer interval.
- Preserved and refined desktop-landscape resume pagination and related layout fixes, including project card stack drop-distance control and small-tools vertical centering.
- Preserved theme support, locale behavior, React Router paths, GitHub Pages user-site base (`/`), and existing data/content separation.

## Test Plan

- [x] Run `npm run lint`.
- [x] Run `./node_modules/.bin/tsc -b`.
- [x] Run `./node_modules/.bin/vite build` during implementation after WebGL background integration.
- [x] Keep manual visual review user-owned unless explicitly delegated.

## Focusing Files

- `src/App.tsx` - owns global background rendering, route behavior, parallax, fade timing, theme-aware parameters, and lazy Liquid Ether loading.
- `src/index.css` - owns site background layers, light/dark background variables, LightRays opacity classes, Liquid Ether filters, and resume layout rhythm.
- `src/components/LightRays.jsx` / `src/components/LightRays.css` - jsrepo-provided React Bits LightRays component.
- `src/components/LiquidEther.jsx` / `src/components/LiquidEther.css` - jsrepo-provided React Bits Liquid Ether component.
- `src/components/CardSwap.tsx` and `src/components/ProjectHighlights.tsx` - project-card stack drop-distance tuning.
- `src/components/SmallToolHighlights.tsx` - desktop-paginated small-tools centering.
- `package.json`, `package-lock.json`, `tsconfig.app.json`, `jsrepo.config.ts` - dependency and JS component integration support.

## Technical Context

- Project stack: React + TypeScript + Vite + React Router + Tailwind CSS + shadcn/ui.
- Deployment is GitHub Pages user site; Vite `base` remains `/`.
- The design direction remains content-first frosted glass with restrained motion and theme-aware backgrounds.
- WebGL effects are route-scoped/lazy where possible to reduce runtime cost.

## Task Checklist

- [x] Receive concrete background requirements from the user.
- [x] Clarify scope across homepage, resume page, module sections, and non-resume routes through iterative visual review.
- [x] Inspect existing background-related CSS and assets.
- [x] Revert early experimental per-section background bands while preserving the desktop-landscape pagination/layout fix.
- [x] Add the React Bits `LightRays` background component using `ogl`.
- [x] Run the official `npx jsrepo@latest add https://reactbits.dev/r/LightRays-JS-CSS` import flow and switch the app to the jsrepo-provided `LightRays.jsx`.
- [x] Add the React Bits `LiquidEther` background component using `three`.
- [x] Tune dark and light mode palettes, opacity, brightness, saturation, and scroll-position color progression.
- [x] Split LightRays and Liquid Ether fade timing into separate, smoother transition functions.
- [x] Limit Liquid Ether to the resume route and keep LightRays shared across pages.
- [x] Keep LightRays mounted across route transitions to reduce WebGL flicker.
- [x] Centralize LightRays parallax speed in one constant.
- [x] Tune project card stack drop distance to avoid overflow into adjacent paginated sections.
- [x] Center the small-tools resume section in desktop paginated layouts.
- [x] Run non-interactive verification commands.
- [x] Summarize changes and visual review boundaries for the user.

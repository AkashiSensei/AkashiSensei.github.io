# ACTIVE_TASK

Status: COMPLETED on 2026-06-23

## Goal

Add a persistent menu-bar animation toggle that can disable high-cost background animations while preserving the current frosted-glass visual system.

## Issue Reference

No external issue. User request on 2026-06-23: add a menu animation switch because the current background animation appears to cause high power consumption; blur/glass cards are acceptable.

Remote freshness checked before planning: `main` vs `origin/main` after `git fetch`, result `0 0` (current and not behind/diverged).

## Implementation Details

- Added a site-level animation preference with two states for now: full/static.
- Persisted the preference in `localStorage` under a project-owned key, and exposed it through a small provider/hook so future animation levels can replace the boolean surface without hunting through components.
- Added a compact icon control to the existing Navbar action clusters:
  - mobile compact bar
  - compact desktop cluster
  - full desktop cluster
  - mobile/dropdown behavior remains stable
- Provided localized accessible labels in the existing `common` namespace.
- When animation is off, the expensive background effects no longer continue their animation loops:
  - `LightRays` keeps the original shader/canvas, renders a fixed frame, disables mouse follow, and stops RAF.
  - `LiquidEther` keeps the original canvas/WebGL state, freezes the current rendered frame, and stops RAF/fluid simulation.
- Preserved the current frosted-glass cards, blur surfaces, theme, locale, routing, and static background treatment.
- Kept the scope to a performance/user-preference control inside the current frosted-glass style; no design/style switching was introduced.
- Updated the mobile action ordering to match the desktop action order: contact, language, theme, animation, page menu.

Trade-off/challenge:

This was the right time to add the control because the power issue is user-visible and the background effects are centralized. The scope stayed deliberately small: binary control now, with a structured `full | static` preference that can become animation levels later without rewriting navigation and background ownership.

## Test Plan

- Run TypeScript/build verification with the repo's existing non-interactive command.
- If a lint/typecheck script exists separately, run it as well.
- Manual browser check is user-owned by project rule unless explicitly delegated:
  - menu button appears on mobile and desktop nav surfaces
  - toggling off freezes animated background motion and lowers GPU/CPU activity
  - toggling on restores current background animation
  - preference persists after reload
  - theme and language buttons still work

Verification completed:

- `npm run lint`
- `./node_modules/.bin/tsc -b`
- `./node_modules/.bin/vite build`

## Focusing Files

- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/animation-provider.tsx`
- `src/components/LightRays.jsx`
- `src/components/LiquidEther.jsx`
- `src/main.tsx`
- `src/content/locales/{zh,en}/common.json`

## Technical Context

- Current background effects are centralized in `src/App.tsx`:
  - `LightRaysBackground` mounts `LightRays` and manages scroll/resize opacity/parallax.
  - `LiquidEtherBackground` is resume-scoped and lazy-loads `LiquidEther`.
- Current menu/action controls live in `src/components/Navbar.tsx`, using lucide icons, localized `common.a11y` labels, and multiple responsive nav clusters.
- SPEC requires the current frosted-glass visual system to remain active; do not reintroduce design variants or style switching.
- SPEC requires theme and locale support to remain first-class.
- Agent workflow: do not start a dev server or browser verification unless explicitly requested; use build/typecheck/lint by default.

## Task Checklist

- [x] Inspect package scripts and confirm verification commands.
- [x] Add animation preference provider/hook with persistent on/off state.
- [x] Wrap the app with the provider.
- [x] Gate `LightRaysBackground` and `LiquidEtherBackground` rendering/loops behind the preference.
- [x] Add Navbar animation toggle buttons to all relevant responsive action clusters.
- [x] Add Chinese and English accessible labels/copy in `common.json`.
- [x] Run non-interactive verification.
- [x] Report exact files changed and any verification results.

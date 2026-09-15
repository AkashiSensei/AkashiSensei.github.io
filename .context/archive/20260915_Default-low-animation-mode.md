# ACTIVE_TASK

Status: COMPLETED on 2026-09-15

## Goal

Make low-animation (`static`) mode the website default for visitors who have not saved a display preference, while preserving explicit saved choices.

## Issue Reference

No external issue. User request on 2026-09-15: make the website default to low-animation mode instead of full effects.

Remote freshness checked before planning: `main` tracks `origin/main`; after `git fetch --prune origin`, both refs point to `70aa072` with `0 0` ahead/behind commits.

## Implementation Details

- Change the animation preference fallback for visitors with no valid stored mode from `full` to `static`.
- Keep the existing precedence rules:
  1. A valid persisted `full`, `static`, or `plain` choice wins.
  2. `prefers-reduced-motion: reduce` resolves to `static` when no valid choice is stored.
  3. All other first visits resolve to the new `static` default.
- Align the context/provider fallback state with the new default so consumers outside a mounted provider do not imply full effects.
- Preserve the storage key and accepted values; do not overwrite, migrate, or clear existing user preferences.
- Preserve the current menu options and labels. Users can still opt into full effects or plain mode.
- Keep the scope limited to default-selection semantics. No animation implementation, visual styling, routing, or display-mode UI redesign is needed.

Trade-off/challenge:

This is an appropriate small change because the display-mode model and persistence already exist. Respecting saved choices means returning visitors who previously chose `full` will remain in full mode; changing every existing visitor to static would be a preference migration rather than a new default and would contradict the current persistence contract.

## Test Plan

- Run `npm run lint`.
- Run `npm run build` (TypeScript plus Vite build); tolerate only the repository's documented GitHub-stats network fallback, not compilation or bundling failures.
- Targeted static review of initialization order:
  - no stored value + normal motion preference => `static`
  - no stored value + reduced-motion preference => `static`
  - stored `full` / `static` / `plain` => stored value remains authoritative
  - invalid stored value => `static`
- Manual browser verification remains user-owned unless explicitly delegated, per project policy. Suggested checks: clear the display-mode storage key and reload, then verify low-animation is selected; choose full effects, reload, and verify the choice persists.

Verification completed:

- `npm run lint` passed.
- `npm run build` passed (`tsc -b` and Vite production build).
- The build-time GitHub stats fetch could not reach GitHub in the sandbox, but the existing keep/fallback behavior completed successfully; the generated stats timestamp-only changes were removed from the task diff.
- Static initialization review confirmed valid stored modes still win, while missing or invalid storage now falls through to `static`.

## Focusing Files

- `src/components/animation-provider.tsx`
- `src/main.tsx`
- `src/App.tsx`
- `src/components/Navbar.tsx`

## Technical Context

- `AnimationMode` is already structured as `"full" | "static" | "plain"` and stored under `akashisensei-animation-mode`.
- Initialization currently restores a valid stored value first, then maps `prefers-reduced-motion: reduce` to `static`, then returns the provider's default mode.
- `static` retains the current atmosphere while disabling high-cost motion; `plain` is a separate lightweight page presentation and is not the requested default.
- SPEC requires persistent user control, stopped/frozen high-cost effects in static mode, and preservation of theme, locale, routing, frosted-glass surfaces, and valid saved choices.
- Project policy forbids starting a development server or browser verification unless the user explicitly requests it.

## Task Checklist

- [x] Change the default/fallback animation mode from `full` to `static`.
- [x] Align the provider's initial context state with the new default.
- [x] Verify valid stored preferences still take precedence and invalid/missing values resolve correctly.
- [x] Run lint and production build checks.
- [x] Report changed files, verification results, and the preserved-preference behavior.

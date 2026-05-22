# ACTIVE_TASK

## Goal

Configure GitHub Actions / GitHub Pages deployment so `https://akashisensei.github.io/` serves the Vite React site without a blank screen.

## Issue Reference

- User report on 2026-05-22: the repository appears to have an Action, but opening the corresponding GitHub Pages URL results in a white/blank page.
- No GitHub issue link provided.

## Implementation Details

- Treat the site as a GitHub Pages **user site**, not a project site:
  - production URL: `https://akashisensei.github.io/`
  - Vite `base` must remain `/`
  - asset URLs should be root-relative (`/assets/...`) after build
- Add or repair the GitHub Actions workflow for Pages deployment:
  - install dependencies with `npm ci`
  - run `npm run build`
  - upload `dist/` as the Pages artifact
  - deploy with the official Pages deploy action
  - include required `permissions` and `environment` settings for GitHub Pages
- Ensure SPA fallback behavior is preserved for direct route refreshes:
  - keep or generate a `404.html` compatible with the built app
  - verify direct paths such as `/projects` and `/tools` do not permanently blank
- Validate that the actual deployed artifact contains the Vite output and not the repo root, an empty folder, or a stale artifact.
- If the production blank page is caused by runtime JavaScript errors rather than deployment, inspect browser console/build output and fix the smallest app-side issue needed.

## Test Plan

- Local static build:
  - `npm run build`
  - inspect `dist/index.html` for root asset paths
- Local preview:
  - `npm run preview`
  - open the app locally and verify the homepage renders
  - manually test direct routes if routing is present
- Deployment verification:
  - commit/push workflow changes after approval
  - check the GitHub Actions Pages workflow result
  - open `https://akashisensei.github.io/`
  - confirm CSS/JS assets load with HTTP 200 and the page is not blank

## Focusing Files

- `.github/workflows/deploy-pages.yml`
- `.github/workflows/pr-build.yml`
- `package.json`
- `vite.config.ts`
- `public/404.html`
- `dist/index.html`

## Technical Context

- SPEC requires a pure static React + TypeScript + Vite frontend deployed to GitHub Pages via GitHub Actions.
- This is a GitHub Pages **user site**: repository `AkashiSensei/AkashiSensei.github.io`, production URL `https://akashisensei.github.io/`.
- Vite `base` is fixed to `/`; project-site prefixes such as `/AkashiSensei.github.io/` are explicitly forbidden.
- Current local `vite.config.ts` already sets `base: "/"`.
- Current working copy has no `.github/workflows` directory, so workflow creation or restoration is likely required in this parallel checkout.

## Task Checklist

- [x] Inspect the real repository workflow state and current Pages settings if available locally or via GitHub.
- [x] Add or repair the Pages workflow using official `configure-pages`, `upload-pages-artifact`, and `deploy-pages` actions.
- [x] Run local build and confirm `dist/` contains the correct static artifact.
- [x] Verify local preview renders without a blank page.
- [x] Preserve or repair SPA fallback for direct routes.
- [x] After approval, commit/push changes and verify the Pages deployment result.

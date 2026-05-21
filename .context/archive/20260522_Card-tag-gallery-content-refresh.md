# ACTIVE_TASK

Status: COMPLETED on 2026-05-22

## Goal
Unify card/tag rendering for projects, workbench groups, and small tools, then refresh project/tool copy and image support without breaking the static, mobile-first homepage.

## Issue Reference
- User request on 2026-05-21: review current card/tag implementations, extract reusable components where useful, unify tag definitions and visual treatment, support highlighting selected points and bolding selected titles, then adjust project/small-tool text and add images.

## Key Impact
- Added shared feature-point rendering with safe emphasis and data-driven highlight support.
- Added semantic repository tag styling, project lifecycle status badges, and non-clickable private repository rows.
- Added build-time GitHub repository stats support for stars and commit counts.
- Added project image gallery support with preview dialog and converted/attached Crater, NPU, Crater CLI, and model-evaluator assets.
- Reworked project ordering, masonry layout, homepage carousel behavior, compact point omission indicators, and bilingual project copy.

## Implementation Details
- `FeaturePointList` now centralizes bullet rendering, safe `**...**` emphasis, and highlighted point colors/dots across projects, small tools, and workbench cards.
- Project repository links now support multilingual semantic tags such as frontend/backend/main/fork/private/public/customized, with a shared semantic tone map.
- Project cards support optional non-clickable repository rows for private repositories and inline GitHub stats when available.
- Added `lifecycleStatus` for project progress badges: starting, ongoing, completed.
- Added `ProjectImageGallery` with first-image aspect ratio, snap scrolling, complete-fit images, and large preview dialog.
- Added animated WebP/static WebP assets for:
  - Crater platform screenshots.
  - NPU compute forecasting images.
  - Crater CLI images.
  - Model compute evaluation GIF demos and diagrams.
- Added `scripts/fetch-github-repo-stats.mjs` and generated GitHub repo stats snapshot, wired through `prebuild`.
- Reworked `/projects` ordering and masonry layout so card flow follows row-major intent rather than column-first ordering.
- Reworked homepage project scrolling to use full-viewport horizontal movement while preserving content alignment.
- Removed undergraduate thesis project from project content for future course-design placement.
- Synchronized updated Chinese project copy into English and checked locale key/point/image consistency.

## Test Plan
- [x] Run TypeScript/build validation (`npm run build`).
- [x] Run lint checks (`npm run lint`).
- [x] Confirm zh/en project locale JSON parses.
- [x] Check project locale consistency for item keys, image keys, and point counts.
- [x] Verify generated image assets exist with expected filenames and sizes.
- [x] Verify compact project cards visibly indicate omitted points.
- [x] Confirm private model-evaluator repositories do not render external links.

## Focusing Files
- `src/components/ProjectCard.tsx`
- `src/components/ProjectGrid.tsx`
- `src/components/ProjectHighlights.tsx`
- `src/components/ProjectImageGallery.tsx`
- `src/components/FeaturePointList.tsx`
- `src/components/GitHubRepoStats.tsx`
- `src/lib/tag-styles.ts`
- `src/data/projects.ts`
- `src/data/tools.ts`
- `src/data/workbench.ts`
- `src/content/locales/zh/projects.json`
- `src/content/locales/en/projects.json`
- `src/content/locales/zh/workbench.json`
- `src/content/locales/en/workbench.json`
- `src/content/locales/zh/tools.json`
- `src/content/locales/zh/common.json`
- `src/content/locales/en/common.json`
- `scripts/fetch-github-repo-stats.mjs`
- `public/assets/projects/`

## Technical Context
- Stack: React + TypeScript + Vite + Tailwind; shadcn/ui style ownership through local components.
- Site is a static GitHub Pages user site; Vite `base` remains `/`.
- Content entries remain data-driven; views do not hardcode individual entries.
- GitHub stats are fetched at build time and can use `GH_REPO_STATS_TOKEN` or `GITHUB_TOKEN` from ignored local env files or CI secrets.
- Private repo rows may keep `githubRepo` for cached stats while omitting `url` to avoid public external links.

## Task Checklist
- [x] Audit duplicated card/tag/point patterns and choose the smallest shared component surface.
- [x] Implement shared tag/pill semantics where useful and replace duplicated tag markup in project-adjacent areas.
- [x] Implement shared feature-point list with highlight support and migrate project/tool/workbench bullet lists.
- [x] Add controlled emphasis support for short text fragments without unsafe HTML.
- [x] Normalize project/tool tag/status/image metadata where needed.
- [x] Refresh project and small-tool copy in zh/en locale files.
- [x] Add and wire image assets for selected project/tool entries.
- [x] Run build/static checks.
- [x] Manually verify homepage, projects, tools, workbench, light/dark, and mobile-sensitive layouts during implementation.

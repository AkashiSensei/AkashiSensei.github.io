# ACTIVE_TASK

Status: COMPLETED on 2026-06-05

## Goal

Add the "知识沉淀" content module in the same data-driven style as the existing Projects / Course Projects / Workbench / Small Tools modules.

## Issue Reference

No external issue link provided.

Remote freshness checked on 2026-06-04: current branch `main` tracks `origin/main`; `git fetch` completed; `main...origin/main` is `0 0` and current.

## Implementation Details

- Created a first-class Knowledge module for blogs, article links, engineering notes, paper-reading repositories, and similar text-heavy outputs.
- Added four initial public knowledge entries:
  - `blob-article`
  - `paper-vault`
  - `ai-builders-digest`
  - `crater-insights`
- Followed existing module conventions:
  - canonical structured data with stable `id` values;
  - localized UI/entity copy in locale namespace files rather than hardcoded React copy;
  - `featured` / `featuredOrder` driven curated highlights for `/resume`;
  - listing route at `/knowledge`;
  - summary cards stay scannable and keep fuller details on detail pages.
- Added `/knowledge/:entryId` detail routes using page-level composition.
- Added WebP image assets for knowledge entries and reused the existing large-image preview gallery.
- Added Knowledge highlight section to `/resume`.
- Added `/knowledge` to navigation using existing `nav.knowledge` labels.
- Extended build-time GitHub repo stats to scan knowledge data and include stars, commit counts, pushed dates, and fallback stats for the four knowledge repos.
- Displayed knowledge updated dates dynamically from GitHub `pushedAt`, formatted to month precision.
- Unified detail-page tag styling for Projects / Course Projects / Knowledge: tags are no longer wrapped in a card and use higher-contrast page-level chips in dark mode.
- Kept root `/` friend-facing homepage unchanged.
- Preserved static GitHub Pages user-site assumptions: Vite `base: "/"`, React Router root paths, no client API tokens.

## Test Plan

- [x] Run type checking / production build (`npm run build`) to verify routes, i18n imports, and data types.
- [x] Inspect responsive behavior for the new listing, details, and resume highlight at narrow widths, with no horizontal overflow observed.
- [x] Verify navigation paths:
  - `/knowledge` renders the new listing page.
  - `/knowledge/:entryId` renders detail pages.
  - `/resume` shows Knowledge highlights when featured entries exist.
  - unknown paths still fall through to 404.
- [x] Verify Chinese and English copy for the new module is registered through the `knowledge` namespace.

## Focusing Files

- `src/App.tsx`
- `src/pages/ResumePage.tsx`
- `src/pages/KnowledgePage.tsx`
- `src/pages/KnowledgeDetailPage.tsx`
- `src/components/KnowledgeCard.tsx`
- `src/components/KnowledgeGrid.tsx`
- `src/components/KnowledgeHighlights.tsx`
- `src/data/knowledge.ts`
- `src/content/locales/zh/knowledge.json`
- `src/content/locales/en/knowledge.json`
- `scripts/fetch-github-repo-stats.mjs`

## Technical Context

- Public static React + TypeScript + Vite site deployed as a GitHub Pages user site; Vite `base` must remain `/`.
- Content modules should be data-driven; views must not hardcode individual entries.
- Entity data and UI chrome strings should remain separated; per-entity copy should be keyed by stable entity `id`.
- Active content modules can expose listing pages and curated `/resume` highlights.
- Summary cards should use title, summary, metadata/tags, links, image preview when relevant, and a clear path forward; long explanatory bullets belong in detail pages, not summary cards.
- Mobile-first is critical; below `md` / 768px card layouts should use one-card mobile behavior.
- Runtime images referenced by site UI/content cards should use WebP assets.
- GitHub stars, commit counts, and pushed timestamps are fetched at build time; no GitHub token is exposed to client bundles.

## Task Checklist

- [x] Inspect current module patterns before editing source code.
- [x] Add `src/data/knowledge.ts` with stable IDs and featured selection helpers.
- [x] Add `knowledge` locale namespace files for Chinese and English.
- [x] Register the new namespace in `src/i18n.ts`.
- [x] Build reusable Knowledge card/grid/highlight components using existing glass/card conventions.
- [x] Add `KnowledgePage` and route metadata for `/knowledge`.
- [x] Add `KnowledgeDetailPage` and route metadata for `/knowledge/:entryId`.
- [x] Add `/knowledge` to navigation.
- [x] Add Knowledge highlights to `/resume`, hidden when no featured entries exist.
- [x] Convert provided knowledge screenshots to WebP and add runtime assets.
- [x] Reuse the existing large-image preview gallery for knowledge images.
- [x] Extend GitHub repo stats to include knowledge repos, stars, commit counts, pushed dates, and fallback stats.
- [x] Display dynamic knowledge update months from repository pushed dates.
- [x] Polish knowledge card layout, masonry listing layout, and detail-page metadata placement.
- [x] Unify detail-page tag styling for project/course/knowledge detail pages.
- [x] Run build/type verification.
- [x] Perform responsive/manual route inspection.

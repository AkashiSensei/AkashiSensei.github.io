# ACTIVE_TASK

Status: COMPLETED on 2026-06-02

## Goal

Add the Course Projects (`课设`) content module by modeling it after existing entity modules, with homepage highlight cards and a dedicated listing page.

## Issue Reference

- User request on 2026-05-23: "模仿现在已有的一些实体，增加一些课设项目，在首页添加卡片，同时提供专门的课设页面。"
- No GitHub issue link provided.

## Implementation Details

- Treat `课设` as its own first-class content module, not as regular `项目` entries:
  - create a canonical structured dataset with stable `id`s
  - keep homepage highlights derived from the same dataset via `featured` / `featuredOrder`
  - keep entity copy in locale files keyed by the same ids
- Reuse the current Projects implementation style where practical:
  - similar card hierarchy, repo/status tags, GitHub stats, optional screenshots/gallery images, feature-point lists
  - same horizontal homepage highlight rail pattern with a "view all" card
  - same dedicated page shape as `/projects`, with a full listing grid
- Add routing and navigation for the dedicated Course Projects page:
  - path: `/course-projects`
  - route title in `App.tsx`
  - nav label/link in existing navigation data and locale namespaces
- Added initial course-project entries from user-confirmed repositories, organizations, and local image assets.
- Kept the module consistent with the existing i18n support:
  - Chinese as source copy
  - English copy synchronized from the final Chinese version
  - did not introduce Italian/Japanese files because the app currently loads Chinese and English only
- Maintained mobile-first layout behavior:
  - no horizontal overflow beyond intentional scroll rails
  - cards remain readable at narrow widths
  - text and repo labels truncate/wrap cleanly

## Test Plan

- Static validation:
  - `npm run build`
  - TypeScript/Vite compilation must pass
- Local UI verification:
  - run the local dev server or preview server
  - open homepage and confirm the Course Projects highlight section appears in the intended order
  - open `/course-projects` directly and via navigation
  - verify route title changes correctly
- Responsive manual checks:
  - inspect homepage and `/course-projects` at about 320px, 390px, tablet, and desktop widths
  - confirm highlight rail scrolling, card widths, repo rows, badges, and point lists do not overlap or clip
- Content checks:
  - every course project id has matching zh/en title, summary, points, and image alt text if images are used
  - every GitHub repo reference is public or intentionally labeled private/unlinked
  - homepage featured count remains curated, typically 1-3 entries

## Focusing Files

- `src/data/course-projects.ts`
- `src/content/locales/zh/course-projects.json`
- `src/content/locales/en/course-projects.json`
- `src/components/CourseProjectHighlights.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/ProjectGrid.tsx`
- `src/components/LazyImage.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/CourseProjectsPage.tsx`
- `src/App.tsx`
- `src/i18n.ts`
- `scripts/fetch-github-repo-stats.mjs`
- `public/assets/course-projects/`

## Technical Context

- Current branch freshness check completed on 2026-05-23: `main` is current with `origin/main` (`git rev-list --left-right --count HEAD...@{upstream}` returned `0 0`).
- SPEC defines `课设` as a content module for course design projects and reference repositories for juniors/seniors.
- SPEC requires content modules to use canonical structured datasets with stable ids; homepage highlights must reference the same records rather than duplicate entity data.
- Current implemented modules follow a `data -> locale namespace -> Card/Grid/Highlights -> Page -> HomePage/App route` pattern.
- The Projects module provided the closest data and UI shape for course projects.
- Current loaded locales are Chinese and English only, despite SPEC naming four target locales.
- Image assets used by UI/content cards should be converted to WebP unless the asset is unsuitable, such as preserving an animated GIF.

## Completed Work

- Added `src/data/course-projects.ts` with stable ids, semester tags, repo metadata, images, homepage featured ordering, and reverse chronological ordering for the dedicated page.
- Added `/course-projects` route, nav entry, route title, i18n resources, and homepage Course Projects highlight rail.
- Generalized project cards/grids and repo rows for course-project usage, including optional repository links for projects without GitHub repos.
- Added centered lazy-image loading placeholders.
- Added semester tag styling and translations, with matching colors for the same semester pair.
- Added and converted course-project images under `public/assets/course-projects/`, including WebP images and the VR animated GIF.
- Updated GitHub stats fetching to include course-project repos, handle public/private/fallback stats, and keep the main project strategy separate from course-project hardcoded fallbacks.
- Synchronized English course-project text with the final Chinese version.
- Curated homepage featured course projects in the requested order: MOS, Cloud YIYAN, undergraduate thesis.

## Task Checklist

- [x] Confirm or discover the initial course-project entries and their public/private repo links.
- [x] Add a `course-projects` structured data module with stable ids, featured ordering, repo metadata, tags, status, and optional media fields.
- [x] Add zh/en course-project locale files with module title/subtitle, view-all copy, status labels if needed, and per-entry copy.
- [x] Reuse or generalize project card/grid/highlight components so Course Projects can share the same visual language without duplicating fragile code.
- [x] Add the Course Projects homepage highlight section.
- [x] Add the dedicated `/course-projects` page.
- [x] Wire route handling, page titles, navigation links, and i18n resource loading.
- [x] Run build and direct-route HTTP verification.
- [x] Perform responsive browser visual verification. User checked the local site and confirmed the current state looks good on 2026-06-02.

# ACTIVE_TASK

Status: COMPLETED on 2026-06-04

## Goal

Add entry detail-page architecture for project-like content and reduce non-workbench card bullet density.

## Issue Reference

- User request, 2026-06-03: "增加对应项目或什么东西的详情页...这一页就介绍这一个项目...修改主页卡片，除了工作台外，一个bullet都不显示，都跳转到详情后显示...详情页面的排版，不要一页一个大卡片"
- Follow-up polish requests, 2026-06-04: align detail-page sections, tune mobile/desktop spacing, use desktop image walls with large-image preview, and keep mobile gallery behavior.

## Implementation Details

- Remote freshness checked at task start: current branch `main`, upstream `origin/main`, after `git fetch`; `main...origin/main` was `0 0`.
- Added stable detail routes for project-like modules:
  - `/projects/:projectId`
  - `/course-projects/:projectId`
  - `/tools/:toolId`
- Kept `/workbench` as an overview/listing module; workbench cards continue showing bullets.
- Summary-card behavior:
  - `ProjectCard` stopped rendering `FeaturePointList` for project and course-project cards.
  - `SmallToolCard` stopped rendering `FeaturePointList` for summary/list/highlight cards.
  - Workbench `SoftwareGroupCard` remains unchanged and can show bullets.
  - Project/tool cards expose internal detail navigation while preserving external repo links.
- Detail-page behavior:
  - Detail pages display the full bullet list from locale `points`.
  - Detail pages reuse canonical datasets and locale records by stable `id`; no duplicated entity content in React components.
  - Detail pages use page-level composition, not one oversized card.
  - Unknown IDs render a module-scoped not-found state.
- Detail-page layout polish:
  - Removed headings for image, link/tag, and highlight sections where the content is self-explanatory.
  - Mobile order places link/tag cards above highlight bullets.
  - Desktop order keeps highlight bullets on the left and link/tag cards on the right.
  - Unified gutters so title/description, image/gallery, info cards, and highlights align on mobile and desktop.
  - Added desktop image walls with 2 columns from `md` and 3 columns from `xl`; mobile keeps horizontal swipe galleries.
  - Desktop image wall items can open a large-image preview dialog.
  - Tuned vertical rhythm around the title block, gallery, cards, and bullets.
- Page title/scroll behavior includes detail routes without exact-path-only logic.
- Existing module listing routes remain stable: `/projects`, `/course-projects`, `/tools`, `/workbench`.

## Test Plan

- Run `npm run build`.
- Run `npm run lint`.
- Browser-check:
  - `/resume`
  - `/projects`
  - at least one `/projects/:projectId`
  - `/course-projects`
  - at least one `/course-projects/:projectId`
  - `/tools`
  - at least one `/tools/:toolId`
  - `/workbench`
- Verify narrow mobile behavior:
  - no horizontal overflow
  - non-workbench cards show no bullet lists
  - workbench cards still show bullets
  - mobile detail pages keep swipe galleries
  - mobile detail sections align consistently
  - external repo links still work independently from internal detail navigation
- Verify desktop behavior:
  - project/tool image walls render in 2-3 columns based on width
  - image wall items open large-image preview dialogs
  - detail pages are not presented as one full-page giant card

## Focusing Files

- `src/App.tsx`
- `src/components/ProjectCard.tsx`
- `src/components/SmallToolCard.tsx`
- `src/pages/ProjectDetailPage.tsx`
- `src/pages/SmallToolDetailPage.tsx`

## Technical Context

- Content is data-driven: canonical entity datasets with stable `id`; views must not hardcode individual entries.
- React Router is the routing layer and supports detail routes.
- GitHub Pages user site: Vite `base` remains `/`; routes are root-based.
- Mobile-first is critical; layouts must stay readable and free of horizontal overflow.
- Summary cards should remain scannable. Full details belong on stable detail routes.
- Detail pages should use page-level composition, not a single oversized card around the whole entry.

## Task Checklist

- [x] Inspect current data shapes for projects, course projects, and tools to define a small shared lookup/detail pattern.
- [x] Add detail route declarations and route-aware document titles.
- [x] Implement project/course-project detail page composition with full points, metadata, links, tags, and gallery.
- [x] Implement small-tool detail page composition with full points, repo metadata, role, and gallery.
- [x] Update `ProjectCard` to hide bullets for summary cards and expose internal detail navigation.
- [x] Update `SmallToolCard` to hide bullets for summary cards and expose internal detail navigation.
- [x] Keep `SoftwareGroupCard` bullet rendering intact.
- [x] Add desktop image walls for detail pages while preserving mobile swipe galleries.
- [x] Add large-image preview dialogs for desktop image wall items.
- [x] Tune detail-page alignment and spacing across mobile and desktop.
- [x] Verify build/lint and route behavior.

## Verification Notes

- `npm run build`: passed. GitHub stats fetch used existing fallback data under restricted network; generated timestamp noise was reverted after builds.
- `npm run lint`: passed.
- Browser route checks passed for `/resume`, `/projects`, `/course-projects`, `/tools`, `/workbench`, `/projects/crater`, `/course-projects/os2023`, and `/tools/project-context-meta-skill`.
- Verified non-workbench cards do not show sampled bullet text, workbench still shows bullet text, detail routes show full points, and checked pages had no horizontal overflow.
- Verified 390px mobile detail layout keeps swipe gallery, hides desktop image wall, and aligns visible title/gallery/card/highlight content.
- Verified 1280px desktop detail layout renders image walls and keeps detail content aligned.
- Verified desktop image wall preview dialogs open for `/projects/crater` and `/tools/project-context-meta-skill`.

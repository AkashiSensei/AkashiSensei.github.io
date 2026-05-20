# ACTIVE_TASK

**Status: COMPLETED on 2026-05-20**

## Goal

Refactor content/i18n structure enough to support reusable 工作台 software-group data, then add homepage software-group highlights and a dedicated 工作台 listing page.

## Issue Reference

No external issue. User request on 2026-05-20: prioritize 工作台 software groups before 项目, with reusable software-group cards. Scope expanded to include full `/workbench` page with responsive masonry layout.

## Implementation Details

- Scope is 工作台 first, not 项目.
- Introduce a software-group content model for third-party software/services/platforms the site owner uses.
- Keep software-group structured data separate from translatable copy:
  - structured data in `src/data/workbench.ts` with stable `id`, ordering/featured flags, icons;
  - localized copy in per-namespace locale files under `src/content/locales/{zh,en}/`.
- Split i18n from monolithic `zh.json` / `en.json` into `common`, `nav`, `home`, `directions`, `workbench` namespaces.
- Eight software groups aligned with RAW_REQUIREMENTS categories; homepage highlights: AI 辅助, 知识沉淀, 创意.
- Homepage: horizontal scroll strip (1/2/3 cards by breakpoint) + view-all card linking to `/workbench`.
- Workbench page: masonry column layout (shortest-column assignment), `max-h-[36rem]` cards, back arrow, responsive 1/2/3 columns.
- Lightweight client routing (`src/lib/navigation.ts`, `AppLink`, `public/404.html` for GitHub Pages).
- Reusable `SoftwareGroupCard`, `SoftwareGroupGrid`, `GlassPanel`, `WorkbenchHighlights`.
- Preserve GitHub Pages user-site assumptions (`base: "/"`).

## Test Plan

- Unit/type checks:
  - [x] Run TypeScript/build checks after implementation.
  - [x] Ensure software-group data shape is type-safe and reusable from both surfaces.
- UI/manual:
  - [x] Verify homepage shows curated software groups in a horizontal strip with a final view-all card.
  - [x] Verify desktop shows three curated groups + view-all without page-level overflow.
  - [x] Verify language switching updates software-group text.
  - [x] Verify mobile widths down to 320px: snap scroll alignment, no horizontal page overflow.
  - [x] Verify `/workbench` lists all groups in masonry layout with back navigation.
- Routing/manual:
  - [x] Verify nav and homepage title link to `/workbench` without full page reload.
  - [x] Verify GitHub Pages root-hosted paths remain compatible with `base: "/"`.

## Focusing Files

- `src/i18n.ts`
- `src/content/locales/*`
- `src/data/workbench.ts`
- `src/components/SoftwareGroupCard.tsx`
- `src/components/SoftwareGroupGrid.tsx`
- `src/components/WorkbenchHighlights.tsx`
- `src/pages/WorkbenchPage.tsx`
- `src/lib/navigation.ts`
- `src/App.tsx`
- `public/404.html`
- `public/assets/workbench-icons/*`

## Technical Context

- Project is a pure static React + TypeScript + Vite site deployed to GitHub Pages user site; Vite `base` must remain `/`.
- Content modules must be data-driven; views must not hardcode individual entries.
- 工作台 is distinct from 方向: stable third-party tools vs interest/exploration themes.
- i18n source language is Chinese; English supported in v1; IT/JA deferred.
- Design: minimal, mobile-first, glassmorphism-inspired.

## Task Checklist

- [x] Finalize the software-group schema and i18n access pattern.
- [x] Split i18n files/namespaces.
- [x] Add typed software-group structured data.
- [x] Add localized software-group copy keyed by stable ids.
- [x] Create reusable SoftwareGroupCard component.
- [x] Add homepage 工作台 highlight section with horizontal scrolling and view-all card.
- [x] Add 工作台 listing page with masonry grid and back navigation.
- [x] Wire homepage/nav anchors and client routing for GitHub Pages.
- [x] Verify build/type checks and basic browser rendering.

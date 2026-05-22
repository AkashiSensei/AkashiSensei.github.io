# ACTIVE_TASK

Status: COMPLETED on 2026-05-22

## Goal
Refine the Small Tools copy and improve the visual presentation of the Small Tools cards/grid across homepage highlights and the `/tools` page.

## Issue Reference
- User request: "精调小工具的描述文本，并优化小工具的展示效果。"
- No external issue link provided.

## Implementation Details
- Improved Chinese source copy for the Small Tools module so entries read less verbose, more concrete, and more portfolio-facing.
- Kept English copy aligned with the refined Chinese meaning, as an AI-drafted translation that still needs human review before publish.
- Preserved the existing data-driven model: small-tool entities stay in `src/data/tools.ts`, while per-entry titles, summaries, and points stay under `src/content/locales/{zh,en}/tools.json`.
- Added screenshot galleries for Project Context Meta-Skill and Engineering Research Skills, with stable WebP assets under `public/assets/tools/`.
- Matched Small Tools image presentation to Project cards: horizontal snap images with click-to-preview, no thumbnail strip.
- Rebalanced homepage rails so Projects, Small Tools, and Workbench all show two actual content cards at the widest layout.
- Replaced the old Small Tool top label row with Project-style role pills using `Owner` and `Contributor`.
- Aligned the `/tools` page grid with `/projects`: one column on mobile, two columns from `md` upward.

## Test Plan
- [x] Run TypeScript/build verification with the project build script.
- [x] Manually inspect the homepage Small Tools highlight section in both zh/en locales.
- [x] Manually inspect `/tools` at mobile widths down to 320px and desktop widths.
- [x] Verify long repo names, private-tool labels, role pills, GitHub stats, image galleries, and feature point lists remain readable and non-overlapping.
- [x] Check light and dark themes for contrast after presentation changes.

## Focusing Files
- `src/content/locales/zh/tools.json`
- `src/content/locales/en/tools.json`
- `src/components/SmallToolCard.tsx`
- `src/components/SmallToolGrid.tsx`
- `src/components/SmallToolHighlights.tsx`
- `src/components/SmallToolImageGallery.tsx`
- `src/components/WorkbenchHighlights.tsx`
- `src/data/tools.ts`
- `public/assets/tools/`

## Technical Context
- The site is a public, static React/Vite/TypeScript GitHub Pages user site; Vite `base` must remain `/`.
- Content modules must be data-driven. Views should not hardcode individual entries.
- The Small Tools module includes repos authored or contributed to by the site owner; entries that are only starred or merely used are out of scope.
- Chinese is the source-of-truth locale. Non-Chinese copy may be AI-generated but should be treated as draft copy for human review.
- UI should remain minimal, content-first, mobile-first, accessible, and within the v1 presentation/navigation scope.
- Mobile layouts down to 320px must not horizontally overflow or cut off interactive elements.

## Task Checklist
- [x] Add Project Context Meta-Skill screenshot assets from local source images, with roadmap as the lead image.
- [x] Add Engineering Research Skills screenshot assets, ordered with Codex images first and Codex result as the lead image.
- [x] Extend Small Tool data and card rendering to support a multi-image gallery while preserving existing single-image entries.
- [x] Simplify Small Tool image presentation to match Project cards: horizontal snap images with click-to-preview, no thumbnail strip.
- [x] Align homepage Small Tools and Workbench highlight rails with Project highlights so the widest viewport shows two content cards per page.
- [x] Replace Small Tool top label row with Project-style role pills using `Owner` and `Contributor`.
- [x] Align the Small Tools detail page grid with the Projects page: one column on mobile, two columns from `md` upward.
- [x] Run build/type checks.
- [x] Audit current Small Tools zh/en copy for verbosity, duplicated claims, and unclear portfolio value.
- [x] Rewrite Chinese titles/summaries/points where needed, keeping each entry concrete and concise.
- [x] Align English copy with the revised Chinese source.
- [x] Adjust `SmallToolCard` visual hierarchy and spacing for better scanability.
- [x] Revisit `SmallToolGrid` height estimation and card constraints so masonry layout feels intentional.
- [x] Tune homepage highlight card behavior and the "view all" card if the revised card sizing exposes issues.
- [x] Verify homepage and `/tools` manually on narrow and desktop viewports, in light/dark and zh/en where practical.

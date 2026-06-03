# ACTIVE_TASK

Status: COMPLETED on 2026-06-03

## Goal

在大图预览下方增加同组图片缩略图栏，允许用户在预览态切换图片，并让预览选中项与卡片中的图片位置保持同步。

## Issue Reference

- User request on 2026-06-03: 点击卡片图片进入大图预览后，在下方展示所有图片小预览；用户可在大图预览中切换图片，并与卡片中的图片同步。
- Follow-up requests on 2026-06-03: 调整大图预览尺寸、间距、毛玻璃效果、缩略图选择行为、键盘/滚动同步、图片标题显示、卡片图片滚动行为、首页文案、英文文案、小工具和工作台卡片一致性。
- Git branch freshness: checked `main` against `origin/main` after `git fetch --prune origin`; current (`0` ahead / `0` behind).

## Completion Summary

- Reworked project/course-project and small-tool image galleries from object-based preview state to index-based state.
- Added large-preview thumbnail rails, active thumbnail indicators, preview title captions, keyboard left/right switching, and card-gallery synchronization.
- Tuned the preview Dialog for mobile and desktop: larger usable preview area, fixed close affordance space, more comfortable outside-click margins, frosted preview card styling, darker dark-mode card treatment, and stable caption rendering.
- Fixed preview/card synchronization issues where opening on a later image or selecting distant thumbnails could briefly jump through the wrong selection.
- Added card image scroll handling so card galleries avoid unwanted vertical scrolling while preserving horizontal image navigation.
- Adjusted selected course-project WebP assets and corresponding image dimensions:
  - Added side padding to the OS lab grades image.
  - Added vertical padding to the fine-grained performance-analysis thesis architecture image.
- Updated homepage text, refined image titles, synced Crater and Workbench bilingual copy, and lightly shortened English descriptions.
- Unified Small Tools and Workbench homepage cards with Project/Course Project compact-card behavior:
  - Small Tools homepage cards show 3 bullet points and no internal text scrolling.
  - Workbench homepage cards show up to 5 bullet points and no internal text scrolling.
  - Full listing pages retain full bullet content.
- Updated SPEC with card-layout responsive breakpoint semantics: below `md`/768px is one-card narrow behavior; `md` and above is wide/two-card behavior.

## Implementation Details

- Current behavior before task:
  - `ProjectImageGallery` rendered project and course-project image strips, opening a Radix/shadcn Dialog with the clicked image.
  - `SmallToolImageGallery` rendered small-tool screenshot strips with a very similar Dialog implementation.
  - Card galleries were horizontal snap scrollers without explicit active-index state.
- Implemented behavior:
  - Replaced object-only `selectedImage` state with index-based selection.
  - When the user clicks a card image, the large preview opens at that image index.
  - A horizontal thumbnail rail is rendered below the large image inside the Dialog, using the same image list and localized alt/placeholder labels.
  - Clicking a thumbnail updates the large image, active thumbnail styling/ARIA state, and card gallery position.
  - Closing the Dialog preserves the card gallery position for the last previewed image.
  - Reopening from a visible card image initializes from the clicked image without animated catch-up scrolling.
  - Layout remains mobile-first with stable thumbnail sizing, constrained preview height, and reachable close controls.
- Related card/content updates:
  - `SmallToolCard` and `SoftwareGroupCard` now accept compact/full variants.
  - Homepage highlight sections pass compact variants.
  - English locale files were lightly shortened to reduce card pressure while preserving information.

## Test Plan

- Build/type check: run the repo's build script after implementation.
- Manual UI verification:
  - `/projects`: open a project card image, switch thumbnails, close the Dialog, verify the card image strip is on the same selected image.
  - `/course-projects`: repeat the same flow for course-project cards that use `ProjectImageGallery`.
  - `/tools`: repeat the same flow for small-tool cards that use `SmallToolImageGallery`.
  - Verify single-image galleries still behave normally and do not show awkward empty controls.
  - Verify narrow mobile widths down to 320px: no clipped controls, no horizontal page overflow, thumbnails remain tappable.
- Accessibility checks:
  - Thumbnail buttons expose useful labels and selected state.
  - Dialog title continues to reflect the currently selected image.

## Focusing Files

- `src/components/ProjectImageGallery.tsx`
- `src/components/SmallToolImageGallery.tsx`
- `src/components/SmallToolCard.tsx`
- `src/components/SoftwareGroupCard.tsx`
- `src/components/SmallToolHighlights.tsx`
- `src/components/WorkbenchHighlights.tsx`
- `src/content/locales/en/*.json`
- `src/content/locales/zh/*.json`
- `src/data/course-projects.ts`
- `public/assets/course-projects/os2023/lab-grades.webp`
- `public/assets/course-projects/kernel-analysis-thesis/architecture-workflow.webp`

## Technical Context

- Stack constraints from SPEC:
  - React + TypeScript + Vite.
  - Tailwind CSS and shadcn/Radix primitives for UI.
  - Mobile-first is critical; layouts must work down to 320px without horizontal overflow or cut-off interactive elements.
  - UI scope is presentation/navigation; avoid overbuilding heavy interactive flows.
  - Content cards/images are data-driven and should keep using existing structured image arrays.
- Existing implementation points:
  - `ProjectImageGallery` supports both `projects` and `courseProjects` translation namespaces.
  - `SmallToolImageGallery` uses direct `alt` strings from `tools.ts`.
  - `LazyImage` can be reused for card-strip images and thumbnail images if the placeholder behavior fits thumbnail sizing.

## Task Checklist

- [x] Convert gallery selection state from selected object to selected index.
- [x] Track card image elements/scroll container refs so preview selection can scroll the card gallery to the matching image.
- [x] Add thumbnail rail inside the large preview Dialog for project/course-project galleries.
- [x] Add matching thumbnail rail behavior for small-tool galleries.
- [x] Ensure active thumbnail styling, labels, and selected state are accessible.
- [x] Tune Dialog layout for desktop and 320px mobile so image, thumbnails, and close button all fit.
- [x] Add image title captions in large preview and stabilize caption rendering during switching.
- [x] Keep thumbnail rail selection initialized and scrolled to the active image when preview opens.
- [x] Tune homepage Small Tools and Workbench compact card bullet limits and remove internal homepage text scrolling.
- [x] Update relevant bilingual copy and lightly shorten English text.
- [x] Update responsive breakpoint semantics in SPEC.
- [x] Run lint.
- [x] Run build/type check.
- [x] Manually verify `/projects`, `/course-projects`, and `/tools` image switching and synchronization.

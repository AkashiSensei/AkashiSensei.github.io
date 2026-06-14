# ACTIVE_TASK

Status: COMPLETED on 2026-06-14

## Goal

Replace the resume project-highlight carousel with the React Bits CardSwap effect while preserving automatic image scrolling inside each project card.

## Issue Reference

- No external issue or PR reference.
- User request: use the React Bits `CardSwap` effect to replace the current project carousel cards; each card should still auto-scroll its internal images.
- User detail: the image display region should use the first image ratio from the `npu-computing-forecast` project (`1280 / 780`, approximately `1.641`).
- Remote freshness checked on 2026-06-14: current branch `main` tracks `origin/main`; `git fetch origin` succeeded; `main...origin/main` comparison is `0 0` (current).

## Implementation Details

- Added a project-owned TypeScript/CSS adaptation of the React Bits `CardSwap` component and the required `gsap` dependency.
- Replaced the resume project-highlight horizontal scroll rail with an upright stacked/depth card swap effect.
- Kept project content data-driven from the existing curated highlight IDs and project records.
- Preserved automatic card-internal image cycling by allowing programmatic horizontal image rail scrolling while disabling user-driven horizontal card image scrolling.
- Kept click-to-preview behavior for project images.
- Used `1280 / 780` as the fixed card media aspect ratio, derived from the first image of the `npu-computing-forecast` entry.
- Removed the bottom indicator bars from the project-highlight card area.
- Set CardSwap `skewAmount` to `0` so stacked cards remain upright.
- Added rounded clipping and theme-consistent `backdrop-filter` blur on the CardSwap card shell without applying image-copy blur or extra decorative overlays.
- Tuned card distance / vertical distance dynamically from estimated displayed card width so smaller cards stay visually tighter.
- Tuned desktop layout spacing: narrowed the left card column, reduced grid gaps, pulled the right copy column closer, centered single-column narrow desktop cards, and aligned the desktop card group slightly above the text top to account for rounded-corner visual weight.
- Reduced the workbench preview card blur to match the navbar/menu glass blur.
- Made the mobile/narrow card-stack container height follow the actual card aspect ratio and stack offsets so the text below no longer sits behind fixed-height empty space.
- Shifted the desktop split-layout card stack slightly further upward after final visual alignment feedback.
- Moved right-side text updates to the CardSwap promote phase while guarding against the parent `activeIndex` echo interrupting the GSAP timeline.
- Preserved the current frosted-glass design direction and did not add a broader design variant or style switch.

## Test Plan

- [x] `npm run lint`
- [x] `./node_modules/.bin/tsc -b`
- [x] `npm run build`
- Browser screenshot / responsive verification remained user-owned per project workflow constraints.

## Focusing Files

- `src/components/ProjectHighlights.tsx`
- `src/components/CardSwap.tsx`
- `src/components/CardSwap.css`
- `src/components/ProjectImageGallery.tsx`
- `src/index.css`

## Technical Context

- Static React + TypeScript + Vite site deployed as a GitHub Pages user site; Vite `base` remains `/`.
- Styling foundation is Tailwind CSS with owned shadcn/ui-style components on Radix primitives.
- Current active design direction: frosted-glass visual system only; improve it in place.
- Mobile quality is first-class; designs must work down to 320px.
- Responsive project/card behavior should follow the named viewport profiles: mobile, standard portrait / tall workspace, standard landscape, and wide desktop at 1600px+.
- Below 768px, card grids use one-card/mobile behavior; at 768px and above, wider card layouts may be used.
- Summary cards should stay scannable; rich narrative and long bullet lists belong on detail pages.
- Normal foreground text should use the centralized `text-tone-1` through `text-tone-5` contrast scale rather than ad hoc foreground opacity.

## Task Checklist

- [x] Locate the nearest `.context/` directory for this repository.
- [x] Confirm branch freshness against the tracked remote branch.
- [x] Read `SPEC.md`, `ROADMAP.md`, and the previous `ACTIVE_TASK.md`.
- [x] Decide that `SPEC.md` / `RAW_REQUIREMENTS.md` do not need updates for this local effect task.
- [x] Reconstruct `ACTIVE_TASK.md` for the new project-card switching task.
- [x] Receive the user's target switching effect / reference.
- [x] Map the requested effect to the affected project surfaces and shared components.
- [x] Identify exact implementation changes and accessibility / reduced-motion requirements.
- [x] Implement the approved effect in a small, focused batch.
- [x] Run `npm run build`.
- [x] Summarize changed surfaces and manual visual review targets.

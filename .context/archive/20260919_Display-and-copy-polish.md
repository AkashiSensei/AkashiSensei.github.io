# ACTIVE_TASK

Status: COMPLETED on 2026-09-19

## Goal

Polish existing site presentation and small copy across `full` / `static` / `plain`: keep listing personal-work highlight color and bold, shrink plain listing body type, then land the later display and copy items the user listed in the same pass.

## Issue Reference

- No external issue link.
- User request on 2026-09-19: polish site presentation and small copy. Scope is the current three display modes, not a new design family.
- Remote freshness at planning: `main` tracked `origin/main` at `438301d`. The task later fast-forwarded onto `2d2731d` (personal-homepage gallery) before finishing.

## Implementation Details

- Treat `plain` as a document layout over the same content, not a de-emphasized content mode.
- Share listing personal-work color and `**bold**` through `emphasized-text` / `PlainPointList`, so glass and plain cannot drift.
- Listing bullet previews use `getListingPointSections()`: unsectioned max 3, split intro/personal-work max 2 each. Workbench listings keep every bullet. Resume highlight counts stay separate.
- Shrink plain listing summary/bullet type to non-plain `text-sm` (`0.875rem`) without shrinking homepage document titles.
- Homepage FPV PageDown from the last screen reaches footer bottom; PageUp from the footer returns to the fourth of five screens. Screen-nav stays five dots.
- Listing-card image strips no longer capture trackpad/wheel for left/right switching. Cards still auto-cycle. User switching stays in the large preview. Detail-page mobile galleries remain swipeable.
- Workbench AI Assist: drop cancelled MiniMax and MiMo bullets; keep highlight indexes on the remaining three subscriptions; add Grok Bot from the local app icon and order Codex, Cursor, Grok Bot, ChatGPT, then Qclaw and Trae CN.
- Move leftover hardcoded homepage/chrome strings into i18n (resume pill, GitHub pill, receipt frame, dialog/back/section a11y).

## Test Plan

- Non-interactive: `npx tsc -b --pretty false` and `npm run lint` passed during implementation.
- User visual review on 2026-09-19 confirmed listing emphasis, paging, gallery scrolling, workbench icons, and highlight indexes.

## Focusing Files

- `src/lib/emphasized-text.tsx` / `src/components/PlainPointList.tsx` / `src/lib/project-points.ts`
- `src/components/FeaturePointList.tsx` / listing and plain index pages
- `src/components/HomeFpvExperience.tsx`
- `src/components/ProjectImageGallery.tsx` / `src/components/SmallToolImageGallery.tsx` and listing cards
- `src/data/workbench.ts` / `src/content/locales/{zh,en}/workbench.json`
- `public/assets/workbench-icons/grok-bot-512.webp`
- `.context/SPEC.md` / `.context/RAW_REQUIREMENTS.md`

## Technical Context

- SPEC: display modes change layout and atmosphere, not semantic emphasis of shared content.
- SPEC: listing-card galleries must not capture page scrolling; auto-cycle remains; preview and detail-mobile swipe stay.
- SPEC: homepage FPV PageDown after the last screen reaches the footer; PageUp from the footer skips the last FPV screen.
- Agent workflow: type/lint by default; visual review by the user.

## Task Checklist

- [x] Restore personal-work highlight color on plain project/course listing bullets, including resume plain lists.
- [x] Keep `**...**` bold in plain listings, matching the glass emphasis treatment.
- [x] Reduce plain listing summary/bullet type to the non-plain `text-sm` size without shrinking homepage document titles.
- [x] Leave detail-page personal-work coloring unchanged.
- [x] Keep tools/workbench listing emphasis consistent if those lists already highlight in glass mode.
- [x] Unify listing-page bullet caps across plain and non-plain: 3 if unsectioned, 2 per section if split; workbench listings keep all.
- [x] Fix FPV homepage resume pill using hardcoded Chinese instead of i18n.
- [x] Sweep remaining hardcoded homepage/chrome copy into i18n (GitHub pill, receipt frame, dialog/back/section a11y).
- [x] Homepage FPV: PageDown from the last screen reaches footer bottom; PageUp from the footer returns to the fourth screen; keep five screen-nav dots.
- [x] Remove cancelled MiniMax and MiMo subscriptions from workbench AI Assist bullets.
- [x] Keep AI Assist highlight indexes on the remaining subscription bullets after that deletion.
- [x] Disable listing-card image swipe so page scrolling is not captured; keep auto-cycling on cards and switching in the large preview.
- [x] Add Grok Bot to the workbench AI Assist icon wall and marquee from the local app icon; order Codex, Cursor, Grok Bot, ChatGPT, then the rest.
- [x] Run non-interactive verification; user confirmed visual review before archive.

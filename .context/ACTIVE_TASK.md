# ACTIVE_TASK

## Goal

Adjust and improve the existing frosted-glass design in place. Do not create a new design style, do not add style switching, and do not build a design-variant architecture in this task.

## Issue Reference

None.

## Implementation Details

- Remote freshness: checked `main` against `origin/main` after fetching `origin`; local and remote were current (`0 0` ahead/behind) at task start.
- Direction change: the attempted new style direction and style-switching implementation has been abandoned. All non-`.context` implementation changes from that attempt were discarded with git.
- Current design remains the only active visual system for now. Future style variants may be reconsidered later, but they are out of scope for this task.
- The next design work should improve the existing interface rather than replacing it: typography, spacing, card/list composition, navigation ergonomics, image treatment, rhythm, and responsive behavior.
- Keep the site content-first, public-safe, readable, and suitable for friends, open-source peers, and interviewers.
- Avoid generic AI-design fingerprints in the current design: decorative gradient blobs as the main idea, excessive glass containers, symmetrical repetitive card rows, indistinct pill-heavy controls, and layouts that only look acceptable on one desktop viewport.
- Keep mobile quality first. Verify at 320px and around 390px before accepting desktop polish.
- Current typography principle: unless explicitly requested, avoid bold / heavy weights for ordinary titles, descriptions, metadata, and card text. Use conservative, slightly smaller font sizes by default, reserving large or heavy type for true hero emphasis.
- Preserve viewport governance requirements:
  - Mobile: 320px-767px, touch-first, single-column, no horizontal overflow.
  - Desktop portrait / high-narrow workspace: 768px-1599px with portrait or narrow/tall proportions; avoid forcing landscape-first composition.
  - Desktop landscape / ordinary desktop: 768px-1599px with landscape proportions; use richer layout while keeping reading widths controlled.
  - Wide desktop: 1600px+ including 2400px+ browser widths; use extra space deliberately without stretching text.
- Consider aspect ratio, not width alone. Full-screen/page-like sections are allowed only when width, height, and aspect ratio support them; tall/narrow screens should use natural scrolling.
- If a layout needs extra explanatory text for rhythm or hierarchy, draft realistic editable copy through existing i18n/content channels rather than hardcoding filler.
- Persistent project docs and UI copy must not record machine-specific local tool or skill paths.
- Future exploration note: a 2.5D "my room" entry experience may be considered later, where room objects represent content modules and clicking them moves the view toward related content. This is a design idea only and is not part of the current in-place design adjustment.
- Future exploration note: "滚动航迹（Scrollflight Vista）" may be considered later as a cinematic homepage concept, using scroll progress to scrub an optimized landscape flight video or frame sequence while foreground sections enter and leave over it. This is a design idea only and is not part of the current in-place design adjustment.
- Future exploration note: "地层索引（Strata Index）" may be considered later as a 2.5D layered underground-facility concept, where scrolling descends through facility layers that reveal content modules. This is a design idea only and is not part of the current in-place design adjustment.

## Test Plan

- Run `npm run lint`.
- Run `npm run build`.
- Browser-verify `/`, `/resume`, `/projects`, `/projects/:id`, `/course-projects`, `/workbench`, `/tools`, `/knowledge`, and representative detail pages after implementation.
- Check light and dark themes.
- Check viewport profiles by width and aspect ratio: mobile at 320px and around 390px; desktop portrait / high-narrow around 768px-1199px wide with tall proportions; standard desktop landscape around 1024px-1599px; wide desktop at 1600px, 1920px, and 2400px+ when practical.
- Confirm no horizontal overflow, clipped controls, overlapping text, clipped cards, broken bottom navigation, or unreadable text.
- Confirm card/list grids use `md`/768px as the narrow-to-wide threshold where relevant, not `sm`/640px.
- Review any newly added draft copy for tone and localization placement.

## Focusing Files

- `src/index.css`
- `src/components/Layout.tsx`
- `src/components/Navbar.tsx`
- `src/components/GlassPanel.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/ResumePage.tsx`
- `src/components/*Highlights.tsx`
- `src/components/*Grid.tsx`
- `src/pages/*DetailPage.tsx`

## Verification Notes

- Non-`.context` implementation changes from the abandoned design-variant attempt were discarded with git.
- Local dev server processes used during the abandoned attempt were stopped.
- No current implementation verification has been run for the next in-place design adjustment yet.

## Technical Context

- Stack: React + TypeScript + Vite, React Router, Tailwind CSS v4, owned shadcn/Radix primitives.
- Deployment: GitHub Pages user site; Vite `base` stays `/`.
- Current UI contract: minimal, content-first, light/dark themes, frosted-glass surfaces, mobile-first.
- Content architecture: structured data and i18n remain single sources of truth; views must not duplicate entity content.
- Route contract: root `/` is friend-facing; `/resume` is interviewer-facing; existing module routes stay stable.
- Mobile constraint: verify layouts down to 320px; card-grid narrow/wide semantics use `md`/768px, not `sm`/640px.
- Copy constraint: additional layout-supporting text is allowed when it improves composition, but it must be realistic draft copy stored in existing content/i18n channels, not hardcoded filler.
- Privacy constraint: persistent project docs and UI copy must not include machine-specific local tool or skill paths.

## Task Checklist

- [x] Stop local dev server processes from the abandoned attempt.
- [x] Use git to discard all non-`.context` tracked changes from the abandoned attempt.
- [x] Remove non-`.context` untracked files from the abandoned attempt.
- [x] Update active task direction: no new design style, no style switching, improve current design in place.
- [x] Keep viewport governance requirements for mobile, desktop portrait / high-narrow, desktop landscape, and wide desktop.
- [ ] Audit the current existing design for concrete layout/readability issues before editing implementation.
- [ ] Propose or implement focused improvements to the existing design only.
- [ ] Verify lint, build, light/dark themes, and responsive behavior after implementation.

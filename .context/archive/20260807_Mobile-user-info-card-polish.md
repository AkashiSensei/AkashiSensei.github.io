# ACTIVE_TASK

Status: COMPLETED on 2026-08-07
Archive: `20260807_Mobile-user-info-card-polish.md`

## Goal

Make the shared personal-information dialog compact enough to show all primary content within common mobile portrait viewports, using a one-row topic carousel instead of wrapped tag rows.

## Issue Reference

- No external issue link or ID was provided.
- User report: the mobile personal-information card is too tall and becomes truncated.
- User idea: make the topic tags a carousel so the card can fit completely on screen.

## Implementation Details

- Scope the change to the shared `ContactDialog` mobile presentation used by the site's existing contact/personal-information triggers; keep the current desktop layout and content hierarchy unchanged at `md` and above.
- Treat 320px-767px as the mobile range and explicitly budget the dialog for common portrait viewports, including 320x568, 360x640, 375x667, and 390x844.
- Preserve the profile visual's typography, insets, photo composition, identity text, status, tilt effect, and aspect ratio while allowing only its outer width and height to follow the mobile dialog's available inner width.
- Give the mobile dialog shell fixed 16px margins from the left and right screen edges. Let its inner width determine the profile card's outer dimensions through the existing aspect ratio, with only a short-viewport safety cap; restore the existing wide two-column shell at `md`.
- Keep the overall mobile dialog width unchanged while sizing the profile card 12px narrower than the available inner width, centered horizontally, with a proportionally adjusted short-viewport cap.
- Use a larger 2rem radius for the overall dialog shell on mobile while preserving the existing `rounded-3xl` desktop radius.
- Use smaller social-link pills on mobile while preserving their existing desktop dimensions.
- Add more mobile vertical separation between the email action and the social-link row without changing the social buttons' horizontal spacing.
- Add an Instagram social link using the compact visible label `IG` and a full accessible brand label; keep all four mobile social pills within the narrowest supported content width.
- Prevent mobile opening flicker by removing the stacked dialog/glass entrance animations, initializing the profile tilt directly at center, and suppressing the role/status blur-in animation on the mobile card. Preserve desktop entrance motion and later mobile tilt interaction.
- Preload the profile photo, mini avatar, grain, and icon-pattern assets; render profile images eagerly with explicit intrinsic dimensions; and reset/start role/status rotation only while the dialog is open so its first frame is deterministic.
- Gate the first dialog mount on completion of the shared profile-asset decode promise, and disable the mobile dialog's focus-triggered Spotlight overlay so autofocus cannot introduce a second post-open visual transition.
- Redirect the mobile dialog's initial focus to its content container so the automatically focused close button does not display a focus rectangle; preserve its keyboard focus indicator when reached manually.
- Replace the mobile wrapping topic list with a single-row horizontal tag rail:
  - preserve the canonical locale-array order and keep every topic reachable;
  - support direct touch/trackpad scrolling and scroll snapping;
  - hide the scrollbar and use a restrained edge cue to communicate overflow;
  - keep the rail meaningfully labelled without making the non-interactive tag row a dialog autofocus target;
  - do not add timed autoplay, so the density fix does not introduce extra motion or reduced-motion complexity;
  - retain the existing wrapped topic layout on desktop.
- Tighten mobile-only dialog padding, inter-section gaps, email-row spacing, and social-link grouping enough for the profile visual, topic rail, email action, social links, and close action to remain visible together.
- Present the content below the profile card as a left-aligned column with wider internal side margins; keep the first topic fully visible and use only a right-edge fade to hint at horizontal overflow.
- Preserve `max-height` and vertical overflow as a safety fallback for exceptionally short or landscape mobile viewports; the acceptance target is no dialog scrolling or truncation on the common portrait sizes above.
- Preserve existing light/dark styling, role and status cycling, mobile tilt, public-safe content, localized topic data, `mailto:` behavior, and outbound social links.
- Keep the density rules local to this dialog/profile-card use rather than changing the shared Radix dialog primitive or unrelated cards globally.
- No `SPEC.md` or `RAW_REQUIREMENTS.md` update is needed: the standing specification already requires mobile support down to 320px, touch-first behavior, and no horizontal page overflow; this task is a focused implementation correction.

## Test Plan

- Automated:
  - Run `npm run build` for TypeScript and production-bundle verification.
  - Run `npm run lint`.
- UI/manual:
  - Verify 320x568, 360x640, 375x667, and 390x844 portrait viewports show the complete dialog without vertical truncation or internal scrolling.
  - Verify a short landscape viewport retains a usable vertical-scroll fallback rather than clipping actions.
  - Verify the topic rail scrolls horizontally by touch/trackpad, exposes every localized tag in order, and does not create page-level horizontal overflow or an unwanted focus rectangle.
  - Verify Chinese and English content in light and dark themes.
  - Verify the dialog close control, email action, GitHub/Zhihu/X links, role/status cycling, and mobile tilt remain usable.
  - Browser-based visual verification remains user-owned unless explicitly delegated, per the project workflow constraint.

## Focusing Files

- `src/components/ContactDialog.tsx`
- `src/components/BrandMarks.tsx`
- `src/components/ProfileCard.tsx`
- `src/components/{ProfileCard,SpotlightCard}.css`
- `src/content/locales/{en,zh}/common.json`
- `src/index.css`
- `index.html`

## Technical Context

- The UI stack is React + TypeScript + Tailwind CSS with project-owned shadcn/Radix primitives; improve the current frosted-glass system in place.
- Mobile is 320px-767px and must be touch-first, readable, and free of page-level horizontal overflow.
- The current dialog already caps itself at `calc(100svh - 2rem)`, but the mobile profile visual may consume `64svh` before the wrapped topic tags, email row, social links, gaps, and padding are added.
- `ContactDialog` is the shared composition layer. The `ProfileCard` outer dimensions may be fluid on mobile, but its internal styling and aspect ratio must remain unchanged.
- Topic content remains sourced from `common.contactDialog.casualTopics`; do not duplicate or hardcode localized labels.
- Theme, locale, public-safe content, and accessibility behavior are first-class constraints.

## Task Checklist

- [x] Preserve the profile card's internal styling and aspect ratio while making only its outer dimensions fluid.
- [x] Set fixed 16px mobile screen-edge margins on the dialog shell.
- [x] Make the profile card's outer dimensions fluid from the dialog inner width while preserving its internal styling.
- [x] Reduce the fluid mobile profile card width by 12px without changing the overall dialog.
- [x] Increase the overall dialog shell corner radius.
- [x] Reduce the mobile GitHub, Zhihu, and X button dimensions.
- [x] Increase the vertical spacing above the mobile social-link row.
- [x] Add the Instagram/IG button and tighten mobile pill padding to keep the four-link row compact.
- [x] Stabilize the mobile dialog opening sequence without changing its final dimensions.
- [x] Preload and synchronously size profile assets, and make role/status timers dialog-open-aware.
- [x] Wait for profile-asset decoding before opening and suppress the autofocus Spotlight transition on mobile.
- [x] Left-align the content below the profile card and increase its internal side margins.
- [x] Convert the mobile topic pills into an accessible one-row horizontal snap rail while retaining desktop wrapping.
- [x] Tighten mobile dialog gaps, padding, email row, and social actions within the portrait height budget.
- [x] Confirm the close button and primary actions remain visible in the user-reviewed mobile layout, with vertical scrolling retained as a short-height fallback.
- [x] Check Chinese/English locale structure and theme-aware class usage for static regressions.
- [x] Run `npm run build` and `npm run lint`.
- [x] Hand off browser-based responsive review to the user and incorporate iterative mobile feedback through final acceptance.

## Completion Evidence

- The user reviewed the mobile dialog throughout the implementation and accepted the final layout after the close-button focus treatment.
- `npm run build`, `npm run lint`, TypeScript compilation, and `git diff --check` passed during implementation.

# ACTIVE_TASK

Status: COMPLETED on 2026-06-15

## Goal

Rework the current contact-only card/dialog into a public-safe "Personal Information" card that still preserves quick contact actions.

## Issue Reference

- No external issue link provided.
- User request: "重做联系方式卡片，不再仅仅是联系方式，而是'个人信息'这样的卡片。"

## Implementation Details

- Rename the user-facing concept from "contact details / 联系方式" toward "personal information / 个人信息" where this card is opened:
  - homepage CTA text can become "个人信息" rather than "联系我";
  - resume hero CTA can use a resume-appropriate label such as "个人信息" or "查看个人信息";
  - navbar accessibility labels should describe opening personal information, not only contact details.
- Expand `ContactDialog` into a richer public profile card while keeping the existing email copy behavior:
  - show a compact identity header for Akashi;
  - include a short public-safe profile snapshot, such as student / software engineering / open-source / job-seeking context;
  - keep email as the primary actionable contact row with copy success/failure feedback;
  - optionally add public links already used elsewhere, such as GitHub and `/resume`, if they improve the card's "personal information" role;
  - preserve privacy copy: no phone number, address, private resume download, or private day-to-day channels.
- Use the React Bits ProfileCard visual effect for the left-side identity card without restyling it as part of the site's current card system. The personal photo can remain empty until the user provides one.
- Keep the component shared across root homepage, `/resume`, and navbar triggers. Avoid duplicating separate personal-info/contact cards unless the existing component becomes too hard to read.
- Prefer existing visual language:
  - keep the current frosted-glass / Spotlight material;
  - use the central text tone scale for ordinary text where practical;
  - keep mobile width, tap targets, and copy button layout stable down to 320px.
- Content should remain in i18n locale files, primarily `common.contactDialog` plus page CTA labels in `home` and `resume`. Chinese is source text; English can be a draft.

## Completed Scope

- Integrated a React Bits style `ProfileCard` into the shared dialog with local `grain.webp`, `iconpattern.png`, profile photo WebP assets, mini avatar, role/status cycling, mobile gyro tilt support, and responsive clipping fixes.
- Reworked the dialog into a personal/contact card with a left profile visual and right-side public friend-link copy, tags, public email, and GitHub / Zhihu / X links.
- Added mobile-specific trimming so the dialog keeps only the photo card, tags, email row card, and external links on narrow screens.
- Tuned light/dark profile-card tone variables, hover/glare behavior, avatar blending, user-info text clipping, and CTA/button contrast.
- Updated page CTA wording back to "联系方式" / "Contact" while keeping the dialog itself as a richer personal information surface.
- Adjusted resume small-tools section vertical rhythm for both side-by-side and stacked layouts.

## Test Plan

- [x] Run TypeScript/build verification, preferably `npm run build`.
- [x] Inspect changed i18n keys for both `zh` and `en` so no visible key fallback appears.
- [x] Manual review by user in browser for:
  - mobile/narrow dialog layout;
  - homepage and resume CTA wording;
  - navbar icon tooltip / screen-reader label;
  - email copy success/failure state.

## Focusing Files

- `src/components/ContactDialog.tsx`
- `src/components/ProfileCard.tsx`
- `src/components/ProfileCard.css`
- `src/components/BrandMarks.tsx`
- `src/components/ui/dialog.tsx`
- `src/content/locales/zh/common.json`
- `src/content/locales/en/common.json`
- `src/content/locales/zh/home.json`
- `src/content/locales/en/home.json`
- `src/content/locales/zh/resume.json`
- `src/content/locales/en/resume.json`
- `src/index.css`
- `src/pages/ResumePage.tsx`
- `public/assets/demo/`
- `public/assets/profile/`

## Technical Context

- The site is public by design: no private documents or unnecessary personal data should be exposed; use safe public contact channels only.
- Root homepage (`/`) is friend-facing and should keep a concise intro, online-resume CTA, public contact/personal-info entry, and GitHub/profile link.
- `/resume` is interviewer-facing and may reuse shared components while supporting job-seeking context.
- UI is React + TypeScript + Tailwind + shadcn/Radix primitives; visual work should improve the current frosted-glass system in place.
- Content and UI copy should stay in structured data / i18n files, not hardcoded in view components.
- Unless explicitly requested, do not start a dev server or browser verification; default verification is build/typecheck/lint/script based.

## Task Checklist

- [x] Update shared dialog copy keys from contact-only framing to personal-information framing.
- [x] Add concise public profile fields/content to the shared dialog.
- [x] Preserve and retest email copy-to-clipboard behavior.
- [x] Update homepage and resume CTA labels to match the new card concept.
- [x] Update navbar accessibility labels/tooltips for the shared trigger.
- [x] Polish responsive dialog layout without broad page redesign.
- [x] Run build/typecheck verification.

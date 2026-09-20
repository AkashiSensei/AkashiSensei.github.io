# ACTIVE_TASK

Status: COMPLETED on 2026-09-20

## Goal

在联系方式 / 个人信息卡片增加 WhatsApp 社交 pill，并为各社交 pill 增加悬浮平台 id 气泡。

## Issue Reference

- No external issue.
- User request on 2026-09-20: add WhatsApp phone number to the contact/personal-information card as a social pill; later enhance hover id bubbles like homepage friend pills.
- Confirmed number: `+44 7434 099408` → `wa.me/447434099408`.
- Order: GitHub → Zhihu → WA → IG → X.
- Zhihu hover id: `毕之` (zh/en same). X / Instagram hover ids use `@` prefix.
- Remote freshness at planning: `main` == `origin/main` at `7cb17c4`.
- Privacy override: earlier archive avoided phone numbers; user explicitly chose to publish WhatsApp.

## Implementation Details

- Shared `ContactDialog` only; WhatsApp mark in `BrandMarks`.
- Mobile social rail: no wrap; horizontal scroll + right-edge fade like topic tags; desktop may wrap.
- Hover speech bubble via `data-hover-label` + `::before` / `::after` (friend-pill pattern); hide bubbles below `md` to avoid scroll clipping.
- Hover ids: `AkashiSensei`, `毕之`, `+44 7434 099408`, `@akashisensei223` (IG), `@akashisensei223` (X).
- Bubble label weight raised to `500` for clearer CJK (e.g. 毕之).
- Updated zh/en privacy/description copy so they no longer claim email-only.

## Test Plan

- Non-interactive: `npx tsc -b --pretty false` and `npm run lint` passed.
- User visual review confirmed before archive.

## Focusing Files

- `src/components/ContactDialog.tsx`
- `src/components/BrandMarks.tsx`
- `src/content/locales/zh/common.json`
- `src/content/locales/en/common.json`
- `src/index.css`

## Technical Context

- SPEC: public-safe contact channels only; no private resume downloads.
- Friend-pill hover pattern lives in FPV CSS; contact dialog mirrors the speech-bubble technique with scoped `.contact-social-pill` rules.

## Task Checklist

- [x] Confirm WhatsApp number and social-pill presentation
- [x] Add WhatsApp mark, pill, and `wa.me` link
- [x] Place WA after Zhihu and before IG
- [x] Mobile social rail: no wrap, horizontal scroll
- [x] Hover speech bubbles for platform ids; hide on mobile
- [x] Zhihu hover id `毕之`; `@` for X/IG
- [x] Increase bubble font weight for CJK readability
- [x] Update zh/en privacy / contact chrome copy
- [x] Typecheck + lint
- [x] User visual review before archive

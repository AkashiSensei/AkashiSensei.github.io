# ACTIVE_TASK

Status: COMPLETED on 2026-06-28

## Goal

Implement and polish the root homepage (`/`) cinematic FPV experience for desktop: scroll progress controls the prepared video/frame timeline, virtual screens carry the homepage content, and floating attachments provide depth while preserving readable interactive content.

## Issue Reference

- User request on 2026-06-23: "网站的首页...把视频作为背景，然后页面上下滚动的位置对应视频的帧，随着下翻页面，视频会逐渐播放。"
- Iterative desktop polish requests through 2026-06-28 covering virtual screens, attachment cards, coffee-chat receipt, and friend-link capsules.
- No external issue link provided.

## Completion Notes

- Completed the desktop-focused FPV homepage pass. Mobile and narrow responsive behavior were intentionally not treated as complete in this task.
- The implementation now uses a route-scoped FPV CSS3D scene with scroll-scrubbed day/night video, virtual screens, and floating attachment cards for elements that need true depth while preserving responsive DOM anchors.
- Tuned the first screens' typography, copy, button attachments, depth offsets, and screen timing.
- Reworked the interest and activity screens with dark glass cards, animated attachment depth, corrected bilingual copy, and desktop layout refinements.
- Added a reusable coffee-chat receipt component, receipt preview route, receipt texture asset, translated receipt content, dynamic receipt height handling, and FPV slide-in/out motion.
- Added the friend-links screen with centered title/subtitle treatment, clickable capsule cards, WebP avatars, external-link affordance, hover speech bubble, and final-screen timing at 8s.
- Added implementation documentation for the FPV virtual-screen and attachment model.

## Implementation Details

- Scope the new experience to `/` only; do not replace `/resume`, module listing pages, or detail-page background behavior.
- Use scroll progress as the source of truth for media position: map `scrollY / scrollableDistance` to video `currentTime` or to a frame-sequence index. Avoid one-wheel-event-equals-one-frame behavior because trackpad/mouse/browser deltas differ.
- Prefer a dedicated homepage component/section for the scroll-controlled media layer, with foreground intro, online-resume CTA, contact, and GitHub entry remaining readable over the video.
- Keep the existing animation preference meaningful: when animation mode is `static` or `prefers-reduced-motion` is active, show a poster/static frame or low-cost fallback instead of running scroll-scrub playback.
- Protect performance: passive scroll listener plus `requestAnimationFrame`; no React state updates on every scroll tick unless necessary; defer media work to route-local components; clean up listeners on route changes.
- Consider browser media constraints: muted/playsInline/preload behavior, metadata readiness before seeking, fallback when duration is unavailable, and poster image before the first reliable frame.
- Maintain theme/locale behavior and current CTA copy structure; any new text should live in the existing i18n home namespace.
- Preserve the current frosted-glass design language rather than introducing a separate style switcher.
- Current implementation uses a route-scoped FPV CSS3D scene with scroll-scrubbed day/night video, virtual screens, and floating attachment cards for elements that need true depth while preserving responsive DOM anchors.

## Test Plan

- [x] Build/type check: run `npm run build` or equivalent TypeScript validation after implementation.
- [x] Lint: run `npm run lint` after touching React hooks, listeners, and shared styling.
- [x] Manual browser review by user for desktop scroll scrubbing, visual composition, attachment depth, button clickability, card timing, receipt layout, and friend-link capsules.
- [x] Asset sanity: verify committed runtime assets are web formats and no private/local video path is referenced.
- [ ] Mobile and narrow responsive polish remains intentionally out of scope for this completed desktop pass.

## Focusing Files

- `src/App.tsx`
- `src/components/HomeFpvExperience.tsx`
- `src/components/home-fpv/`
- `src/components/ReceiptCard.tsx`
- `src/components/coffee-chat-receipt.ts`
- `src/pages/ReceiptPreviewPage.tsx`
- `src/index.css`
- `src/content/locales/*/home.json`
- `public/assets/receipt/`
- `public/assets/friend-links/`
- `public/assets/homepage-fpv/`

## Technical Context

- Current stack: React + TypeScript + Vite + Tailwind + React Router; GitHub Pages user site with Vite `base: "/"`.
- Root homepage (`/`) is friend-facing and intentionally concise; `/resume` carries the richer interviewer-facing content.
- Existing high-cost animation preference is persistent (`full` / `static`) and must remain first-class for new decorative motion.
- Current background effects are global LightRays plus resume-scoped LiquidEther. The new video experience is route-scoped to `/` and does not entangle resume/detail backgrounds.
- This task's visual acceptance focused on desktop FPV composition. Future work should revisit mobile/tablet behavior deliberately.
- Agent workflow note: browser/dev-server verification was user-driven during the task.

## Task Checklist

- [x] Receive or locate the prepared homepage video and decide runtime asset path plus poster/fallback image.
- [x] Choose implementation strategy after inspecting asset characteristics: scrub `<video>` by `currentTime` or convert/use frame sequence if seeking performance is poor.
- [x] Build a route-scoped scroll-video background layer for `HomePage`.
- [x] Adjust homepage layout height/scroll rhythm so the media timeline has enough scroll distance without burying the concise CTAs.
- [x] Wire animation preference and `prefers-reduced-motion` to static/low-cost behavior.
- [x] Add or adjust i18n home copy only if the new composition needs supporting text.
- [x] Tune CSS for foreground readability over video across light/dark themes and desktop viewport profiles.
- [x] Run build/lint verification and report any visual checks left for manual review.
- [x] Browser-review the projection calibration and tune virtual screen timing, attachment depth, and responsive anchor positions after seeing the page in motion.
- [x] Document that mobile and narrow responsive display are not yet considered complete.

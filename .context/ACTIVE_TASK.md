# ACTIVE_TASK

## Goal

Implement a root homepage (`/`) cinematic background where scroll progress controls a prepared video/frame timeline while preserving readable entry content and existing site routes.

## Issue Reference

- User request on 2026-06-23: "网站的首页...把视频作为背景，然后页面上下滚动的位置对应视频的帧，随着下翻页面，视频会逐渐播放。"
- No external issue link provided.

## Implementation Details

- Scope the new experience to `/` only; do not replace `/resume`, module listing pages, or detail-page background behavior.
- Use scroll progress as the source of truth for media position: map `scrollY / scrollableDistance` to video `currentTime` or to a frame-sequence index. Avoid one-wheel-event-equals-one-frame behavior because trackpad/mouse/browser deltas differ.
- Prefer a dedicated homepage component/section for the scroll-controlled media layer, with foreground intro, online-resume CTA, contact, and GitHub entry remaining readable over the video.
- Confirm and place the prepared video asset before implementation. No `.mp4`, `.webm`, `.mov`, or `.m4v` file currently exists under `public/` or `src/`.
- Keep the existing animation preference meaningful: when animation mode is `static` or `prefers-reduced-motion` is active, show a poster/static frame or low-cost fallback instead of running scroll-scrub playback.
- Protect performance: passive scroll listener plus `requestAnimationFrame`; no React state updates on every scroll tick unless necessary; defer media work to route-local components; clean up listeners on route changes.
- Consider browser media constraints: muted/playsInline/preload behavior, metadata readiness before seeking, fallback when duration is unavailable, and poster image before the first reliable frame.
- Maintain theme/locale behavior and current CTA copy structure; any new text should live in the existing i18n home namespace.
- Preserve the current frosted-glass design language rather than introducing a separate style switcher.
- Current implementation uses a route-scoped FPV CSS3D scene with scroll-scrubbed day/night video, virtual screens, and floating attachment cards for elements that need true depth while preserving responsive DOM anchors.

## Test Plan

- Build/type check: run `npm run build` after implementation.
- Lint: run `npm run lint` if implementation touches React hooks, listeners, or shared styling.
- Manual browser review by user unless explicitly delegated: verify desktop scroll scrubbing, reverse scroll behavior, video load fallback, mobile behavior, dark/light themes, animation on/off, and reduced-motion behavior.
- Asset sanity: verify the committed runtime asset is an appropriate web format/size and that no private/local video path is referenced.

## Focusing Files

- `src/pages/HomePage.tsx`
- `src/App.tsx`
- `src/components/animation-provider.tsx`
- `src/index.css`
- `src/content/locales/*/home.json`
- `public/assets/...` for the prepared homepage video/poster asset

## Technical Context

- Current stack: React + TypeScript + Vite + Tailwind + React Router; GitHub Pages user site with Vite `base: "/"`.
- Root homepage (`/`) is friend-facing and intentionally concise; `/resume` carries the richer interviewer-facing content.
- Existing high-cost animation preference is persistent (`full` / `static`) and must remain first-class for new decorative motion.
- Current background effects are global LightRays plus resume-scoped LiquidEther. The new video experience should be route-scoped to `/` and not entangle resume/detail backgrounds.
- Mobile quality is required down to 320px; portrait/tall desktop and ordinary landscape desktop both need intentional composition.
- Agent workflow constraint: do not start a dev server or browser verification unless the user explicitly asks.

## Task Checklist

- [x] Receive or locate the prepared homepage video and decide runtime asset path plus poster/fallback image.
- [x] Choose implementation strategy after inspecting asset characteristics: scrub `<video>` by `currentTime` or convert/use frame sequence if seeking performance is poor.
- [x] Build a route-scoped scroll-video background layer for `HomePage`.
- [x] Adjust homepage layout height/scroll rhythm so the media timeline has enough scroll distance without burying the concise CTAs.
- [x] Wire animation preference and `prefers-reduced-motion` to static/low-cost behavior.
- [x] Add or adjust i18n home copy only if the new composition needs supporting text.
- [x] Tune CSS for foreground readability over video across light/dark themes and mobile/desktop viewport profiles.
- [x] Run build/lint verification and report any visual checks left for manual review.
- [x] Browser-review the projection calibration and tune virtual screen timing, attachment depth, and responsive anchor positions after seeing the page in motion.

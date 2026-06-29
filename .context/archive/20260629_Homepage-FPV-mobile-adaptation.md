# ACTIVE_TASK

Status: COMPLETED on 2026-06-29

## Goal

Stabilize the root homepage FPV experience on mobile so video rendering and CSS3D layout no longer collapse on phone-sized screens.

## Issue Reference

- User request: optimize homepage mobile display; current phone rendering breaks because of video rendering and layout issues.
- User request: investigate iPhone 16 Safari/Firefox behavior where the mobile homepage initially showed a black background until the theme toggle was tapped.
- User request: use mobile-specific FPV background media, test higher-frame-rate and all-keyframe variants, and settle on a smoother mobile background.
- User request: restore compact mobile card bullet content, dynamic card heights, friend-link capsules, mobile/desktop page dots, theme-switch video crossfade, and stable dark-mode refresh behavior.
- Remote freshness: checked `main` against `origin/main` after `git fetch origin`; local and remote commits were current (`0 0`) at task start. Worktree had pre-existing uncommitted/generated media changes and they were treated as user state.

## Implementation Details

- Scope stayed route-scoped to `/` and the existing FPV homepage system. Resume/module detail routes and the broader frosted-glass visual direction were not redesigned.
- Added a mobile-specific FPV mode for phone-sized screens instead of forcing the full desktop CSS3D attachment composition into portrait:
  - Mobile source selection uses `<=767px` and coarse-pointer landscape fallback.
  - CSS3D floating attachments are skipped on mobile.
  - Mobile virtual-screen props now receive `isMobileViewport` so screen components can tune density, layout, and attachment assumptions.
- Reworked mobile FPV layout:
  - Constrained text/card widths to viewport-safe mobile inline sizing.
  - Reduced title scale after the first screen.
  - Restored smaller card bullets where space allowed.
  - Let field/activity cards use content-driven height.
  - Split field/activity card grids into column groups so shorter cards can leave natural vertical fill room.
  - Centered friend-link title/text on mobile and made friend capsules size to content without vertical text compression.
  - Tightened mobile menu button spacing and restored the Akashi icon alignment.
- Replaced the old desktop left page counter with page navigation dots:
  - Desktop uses vertical translucent circular buttons `1-5`.
  - Mobile uses horizontal dots above the bottom menu.
  - Active state changes after crossing a screen anchor by `0.5s`.
  - Dot clicks reuse the existing page-up/page-down scroll animation path.
- Added a GitHub profile outline button to the 学业与工程 card and scaled its mobile card actions down.
- Stabilized theme/background switching:
  - Converted background video switching to a two-slot video buffer.
  - New theme video is loaded, seeked to the current timeline time, and painted before being promoted.
  - Old and new video layers overlap for a short opacity crossfade, then the old layer is cleaned up.
  - Rapid theme toggles cancel stale cleanup timers.
- Stabilized first-load theme behavior:
  - Added an early `index.html` script that resolves `vite-ui-theme` or system preference before React starts and writes `light/dark` plus `color-scheme` to `<html>`.
  - Updated `ThemeProvider` to share the same storage/theme resolution behavior and tolerate storage failures.
  - Updated FPV theme detection so the first render reads the current `<html>` class instead of assuming light mode.
- Stabilized mobile video rendering:
  - Tested original lower-frame-rate mobile source candidates and all-keyframe encodes.
  - Generated 45fps all-keyframe mobile background videos from the existing 90fps sources:
    - `public/assets/homepage-fpv/day-mobile-45-all-i.mp4`
    - `public/assets/homepage-fpv/night-mobile-45-all-i.mp4`
  - Mobile video seek targets are quantized to 45fps frame boundaries.
  - Seek threshold now follows the active video frame rate: 45fps on mobile, 90fps on desktop.
  - Added mobile poster assets and changed initial video visibility so poster remains visible until the browser has a real current video frame. This avoids iOS black first paint where a paused video layer can cover the fallback before decoding.

## Test Plan

- Non-interactive verification passed:
  - `npm run lint`
  - `npm run build`
- Build still uses existing GitHub stats fallbacks when network fetches fail and still reports the existing large chunk warning.
- Browser verification was performed earlier in the task on mobile portrait sizes with the in-app browser before local URL restrictions changed; later phone-specific rendering checks were user-owned on the physical iPhone.
- Manual phone observations drove follow-up fixes:
  - iPhone 16 Safari/Firefox local-network access.
  - Dark-mode refresh initially showing light video first.
  - Mobile first paint showing only the menu until a tap/scroll.
  - Background video jitter during animated page switches.

## Focusing Files

- `index.html`
- `src/components/HomeFpvExperience.tsx`
- `src/components/Navbar.tsx`
- `src/components/home-fpv/types.ts`
- `src/components/home-fpv/screens/Page01.tsx`
- `src/components/home-fpv/screens/Page02.tsx`
- `src/components/home-fpv/screens/Page04.tsx`
- `src/components/home-fpv/screens/Page05.tsx`
- `src/components/theme-provider.tsx`
- `src/index.css`
- `public/assets/homepage-fpv/*`

## Technical Context

- SPEC requires mobile quality down to 320px before desktop polish is complete.
- Root homepage may use scroll-controlled video/frame-sequence media, but it must keep text/CTA readable, respect animation preference and `prefers-reduced-motion`, and provide static or low-cost fallback for mobile, unsupported browsers, or expensive playback.
- Full-screen/page-snapping composition is allowed only when width, height, and aspect ratio support it; portrait/tall workspaces should prefer stable natural reading over landscape-first composition.
- Mobile video rendering on iOS is sensitive to paused video first paint, repeated `currentTime` seeking, codec/frame cadence, and layer compositing. Poster fallback and frame-boundary seek quantization are deliberate mitigations.
- Agent workflow constraint: do not start a dev server or perform browser/screenshot verification unless the user explicitly asks.

## Task Checklist

- [x] Audit mobile-specific runtime path in `HomeFpvExperience.tsx`: viewport detection, scroll height, video preload/seek behavior, CSS3D mounting, and reduced-motion behavior.
- [x] Add mobile-specific lower-frame-rate day/night video assets and viewport-based source selection.
- [x] Add a deliberate mobile/low-cost rendering mode: stable background media fallback, fewer expensive scene objects, and predictable scroll/CTA behavior.
- [x] Rework mobile FPV CSS for 320px-767px: remove horizontal overflow, replace fixed desktop widths with constrained mobile widths, scale typography/cards/receipt/friend links, and keep touch targets accessible.
- [x] Restore mobile card bullets and dynamic card heights for 感受野 and 我还在摸鱼 pages.
- [x] Add desktop/mobile page-dot navigation and delayed active-state logic.
- [x] Fix friend-link capsule sizing, alignment, and quote text rendering on mobile.
- [x] Add GitHub profile action to the 学业与工程 card and tune its mobile button scale.
- [x] Add two-slot video crossfade so theme switches avoid flashing first frames.
- [x] Generate and switch mobile background to 45fps all-keyframe video assets.
- [x] Quantize mobile video seeking to 45fps frame boundaries and frame-rate-aware thresholds.
- [x] Fix dark-mode refresh so the first render uses the correct dark background.
- [x] Add poster-first video visibility fallback so mobile first paint does not black-screen before user interaction.
- [x] Verify animation preference and `prefers-reduced-motion` disable expensive work while retaining readable static content.
- [x] Run build/type/lint checks and summarize remaining manual phone checks for the user.

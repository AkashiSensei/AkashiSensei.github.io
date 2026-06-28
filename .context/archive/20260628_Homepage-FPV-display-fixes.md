# ACTIVE_TASK

Status: COMPLETED on 2026-06-28

## Goal

Fix homepage FPV display issues; continue investigating Firefox button/tag edge blur before applying a new fix.

## Issue Reference

- User request: "个人主页三维空间中的虚拟屏幕，现在会根据浏览器窗口实际大小改变...当屏幕很宽的时候，背景视频可以缩放显示，而不要让两边有黑边。"
- User request: "在我的火狐浏览器上，按钮和卡片的边缘非常模糊，请修复这个问题"
- User request: "调整和修复 我还要寻找 这一页的页面布局和定位..."
- User discussion/request: clarify whether AE camera solve, background video scaling, CSS3D projection, and viewport aspect changes stay aligned; then optimize the camera calculation to match the background cover behavior.
- External issue / PR: TBD
- Current status: wide-screen video fix revised and verified; replaced small FPV button/tag glass rendering with a browser-neutral non-backdrop-filter implementation; moved attachment blur/opacity animation off CSS3D roots; redefined homepage animation toggle as local effect weakening only; centered Page05 layout around the virtual-screen midline; made CSS3D camera FOV cover-aware so it matches background video crop on wide/tall aspect changes; static checks and full build passed.

## Implementation Details

- Treat this as a visual/display polish task for the existing React + Vite + Tailwind site.
- Do not start from a redesign. Preserve the current frosted-glass visual system and improve the affected surface in place.
- Affected page: root homepage `/`, FPV scroll-video scene.
- Confirmed symptom: virtual screens resize with the browser as expected, but the background video can remain centered with black side gutters on very wide windows.
- Expected behavior: the 16:9 background video should scale to cover the full wide viewport, accepting vertical crop when necessary.
- Revised implementation: remove homepage layout padding at all breakpoints, including the `min-[1800px]` shell padding, and make the FPV root a `100vw` full-bleed section centered against the viewport. Keep the explicit 16:9 cover math for the video element.
- Confirmed rendering symptom: FPV buttons and tags show excessively blurred rounded edges in Firefox, while ordinary text remains clear. The severity changes with viewport size.
- Reverted Firefox fallback: removed the previous `@supports (-moz-appearance: none)` style override because it did not address the actual mechanism.
- Current root-cause hypothesis: buttons/tags combine `border-radius: 999px`, translucent backgrounds, borders/shadows, and `backdrop-filter` inside a CSS3D scene scaled to roughly `0.10-0.16` on desktop viewports. Firefox appears to rasterize or resample those rounded filtered layers differently from plain text.
- New implementation approach: remove `backdrop-filter` from small FPV controls across all browsers, replacing it with translucent gradients, inset strokes, and light shadows so the controls render as ordinary layers under CSS3D scaling.
- Animation implementation approach: CSS3D roots now keep only 3D positioning and screen-level opacity. Per-attachment opacity/blur is applied through CSS variables on the inner `.fpv-attachment-clone`, so Firefox does not need to animate `filter` on the same element that CSS3DRenderer transforms with `matrix3d(...)`.
- FPV field/activity/space cards also use non-`backdrop-filter` glass fills to avoid mixing live backdrop sampling with CSS3D attachment animation.
- Homepage animation-toggle semantics: the user animation preference no longer freezes homepage scroll progress, video scrubbing, camera movement, or CSS3D screen changes. It only disables local presentation effects on the FPV homepage: Page04 activity-card depth/fade/blur and Page05 receipt sliding. Other routes keep their existing animation-toggle behavior.
- Page05 layout issue: `.fpv-page-05-layout` previously used `top: 11%`, while the left column added `margin-top: 6.8rem`. This anchored both sides to a fixed top offset rather than the virtual-screen center. The layout now uses `top: 50%` with `translate3d(-50%, -50%, 0)`, aligns grid children at center, keeps the receipt centered by its measured real height, and shifts the left stack slightly upward relative to the centerline instead of relative to the screen top.
- Camera/cover root cause: AE camera data was solved against the original 16:9 comp (`1280x720`). Pure uniform scaling is safe because the camera frustum stays the same and only the projected pixels scale. The mismatch appears when the page viewport changes aspect ratio and the background video uses `object-fit: cover`: the visible source crop changes, but the CSS3D camera previously always kept AE's vertical FOV fixed. That matches narrow/tall viewports where cover preserves height and crops left/right, but it does not match wide/short viewports where cover preserves width and crops top/bottom.
- Camera/cover fix: derive an effective vertical FOV from the original comp aspect and current viewport aspect. If the viewport aspect is less than or equal to the source aspect, keep AE's vertical FOV. If the viewport is wider than the source aspect, keep AE's horizontal FOV and calculate the vertical FOV required for the current aspect. Use this same cover-adjusted FOV both when applying each sampled camera frame and when computing the virtual screen frame size at its birth time.
- Verification notes for the camera fix: on a `1600x700` viewport the background video covers by width (`1600x900`, cropped top/bottom) and the effective vertical FOV changes from `51.16deg` to about `40.84deg`; on a `900x900` viewport the background covers by height (`1600x900`, cropped left/right) and the vertical FOV remains `51.16deg`.
- Existing working tree already contains unrelated pending changes/assets; preserve them unless the user says they belong to this task.

## Test Plan

- Static checks: run the project build/typecheck/lint command available in package scripts after code changes.
- Latest checks run for Page05/camera changes: `npm run lint` and `./node_modules/.bin/vite build`, both passed. The production build still reports the existing large chunk warning.
- Targeted verification: inspect affected component logic and responsive CSS for the named route/viewport.
- Manual visual review: only use browser/screenshot verification if the user explicitly asks for local preview or visual verification, per project workflow constraints.
- Manual/browser verification performed after explicit local-preview work: checked Page05 centering at `1280x720` and `1280x900`, and cover-aware camera behavior at `1600x700` and `900x900`.
- Regression focus: theme, locale, routing, animation preference, mobile down to 320px, portrait/tall desktop, standard landscape, and wide desktop behavior when relevant.

## Focusing Files

- `src/index.css`
- `src/components/HomeFpvExperience.tsx`
- `src/components/home-fpv/screens/*`

## Technical Context

- Git freshness checked: `main` vs `origin/main` after `git fetch origin` is current (`0 ahead / 0 behind`).
- GitHub Pages user site: Vite `base` must remain `/`; routes are rooted at the site root.
- Styling foundation: Tailwind CSS plus project-owned shadcn/Radix-style components.
- Current active style: frosted-glass visual system; improve it in place instead of introducing a new style family.
- Responsive profiles: mobile 320-767px, standard portrait/tall workspace, standard landscape, and wide desktop all matter.
- Text should use the centralized `text-tone-1` through `text-tone-5` scale for ordinary foreground hierarchy.
- Root homepage FPV media must remain route-scoped to `/`, respect animation preference and reduced motion, and provide lower-cost fallbacks.
- Agent workflow: do not start a dev server or inspect the site in a browser unless explicitly requested.

## Task Checklist

- [x] Receive concrete display issue details from the user.
- [x] Map each symptom to the affected route, viewport profile, theme, and language.
- [x] Inspect the smallest relevant component/CSS/data files.
- [x] Draft a focused implementation plan for the confirmed issue.
- [x] Implement the scoped wide-screen video fix.
- [x] Isolate Firefox button/tag blur root cause before applying another visual fix.
- [x] Apply browser-neutral small-control rendering fix.
- [x] Move attachment fade/blur animation off CSS3D roots.
- [x] Redefine homepage animation toggle as local effect weakening.
- [x] Center Page05 around the virtual-screen midline instead of fixed top offsets.
- [x] Analyze AE camera projection versus background video scaling/cropping behavior.
- [x] Implement cover-aware CSS3D camera FOV calculation.
- [x] Run relevant non-interactive checks.
- [x] Summarize changes, verification, and any residual visual-review notes.

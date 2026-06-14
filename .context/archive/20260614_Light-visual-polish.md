# ACTIVE_TASK

Status: COMPLETED on 2026-06-14

## Goal

Apply a light-touch polish pass to the existing visual system: simplify the current background direction, keep the active frosted-glass language, add restrained Spotlight hover feedback, and fix the desktop view-on-phone QR presentation.

## Issue Reference

No external issue. User request on 2026-06-13: optimize display quality, adjust/fix QR code presentation, try liquid-glass effect, improve current frosted glass, and replace the current background because it feels low-end.

Scope was narrowed during implementation: for the current version, remove/simplify the messy background direction but do not design or add a new replacement background yet. Liquid-glass and metal-fx experiments are recorded for future reference, but neither should remain active in the UI for this pass.

## Implementation Details

- Kept the existing frosted-glass visual system as the active style. Liquid-glass and metal-fx are not active in the UI for this pass.
- Removed/simplified the noisy fixed background direction and intentionally deferred a new day/night WebP background set.
- Preserved a lightweight `SpotlightCard` hover layer on menu and card surfaces where it improves feedback without adding heavy rendering cost.
- Polished the desktop QR panel in `Navbar`: align it with the visible menu/tool card, keep it near the menu with a controlled gap, preserve a high-contrast QR plate for scan reliability, and keep loading/error states intentional.
- Updated shared glass surfaces, especially `GlassPanel`, menu surfaces, contact dialog, and the QR card, to match the current material direction without unrelated layout rewrites.
- Preserved routing, i18n keys, theme behavior, current content data contracts, and GitHub Pages `base: "/"`.

## Test Plan

- Static checks: `npm run lint` passed during implementation.
- Build check: `npm run build` passed during implementation; the GitHub stats prebuild path degraded as designed when network fetches failed, and generated stats diffs were restored.
- Manual visual QA: user reviewed the desktop QR panel spacing/alignment through screenshots and requested final gap tuning.
- Responsive visual QA: detailed browser pass is deferred to a future visual QA pass; no browser automation was started because project workflow says not to unless explicitly asked.
- Accessibility sanity: QR trigger remains a button, Escape handling remains in place, outside-click handling remains in place, and QR image alt text is preserved.

## Focusing Files

- `src/components/Navbar.tsx`
- `src/index.css`
- `src/App.tsx`
- `src/components/GlassPanel.tsx`
- `src/components/ContactDialog.tsx`
- `src/components/SpotlightCard.tsx`
- `src/components/SpotlightCard.css`
- `src/pages/HomePage.tsx`
- `src/content/locales/en/home.json`
- `src/content/locales/zh/home.json`

## Technical Context

- Stack: React + TypeScript + Vite + React Router + Tailwind CSS v4 + project-owned shadcn/Radix components.
- Deployment: GitHub Pages user site; Vite `base` must remain `/`.
- Current style contract: the frosted-glass visual system plus lightweight Spotlight hover is the only active style. Do not add style switching or a design-variant architecture.
- Design bar: content-first, readable, public-safe, strong across mobile, ordinary desktop, portrait/tall workspace, and wide desktop. Avoid generic AI-design fingerprints such as purple/blue glow defaults, decorative gradient blobs, excessive glass cards, and layouts that only work on one desktop viewport.
- Asset rule: if new UI/content image assets are added later, they should be WebP before runtime reference. Bright assets need dark-mode comfort handling where relevant.
- Agent workflow: unless explicitly asked, do not start a dev server or open browser automation. Default verification uses non-interactive lint/build checks.

## Decisions & Notes

- Liquid-glass experiments were not kept. The available implementations did not reliably capture the live page background in the desired way, and WebGL-style approaches are likely heavier than this portfolio needs right now.
- `metal-fx` was tested for primary buttons and then removed from active usage because the effect felt too heavy for the current project direction.
- `SpotlightCard` is the retained interaction layer for now. It is lightweight CSS/React pointer tracking and works well with the current frosted-glass surfaces.
- The QR panel spacing issue was traced to `SpotlightCard.css` applying `position: relative` to elements that also needed Tailwind `absolute`. The component CSS now avoids overriding explicit positioning classes.
- The home page now has translated `contact` / `github` labels and the online resume CTA follows the resume page's solid-button direction without a press-down transform.

## Task Checklist

- [x] Audit current QR panel behavior, background direction, and shared glass treatment from code.
- [x] Narrow the background approach: keep the messy old background removed/simplified, and defer new background design.
- [x] Restore the active menu style to frosted glass after liquid-glass experiments.
- [x] Keep `SpotlightCard` hover feedback on menu and card surfaces.
- [x] Update reusable glass surfaces, especially `GlassPanel`, to match the current material direction.
- [x] Fix QR panel positioning and presentation states without breaking keyboard/mouse interactions.
- [x] Align the desktop QR panel to the visible menu/tool card and tune the menu gap.
- [x] Run lint/build checks for the recent UI changes.
- [x] Manual/user visual QA for the QR panel and current lightweight polish pass.
- [x] Prepare a short final implementation summary and archive the task after acceptance.

## Deferred

- Design or generate a new premium day/night WebP background set.
- Revisit liquid-glass effects if a lighter, reliable non-WebGL or acceptable-performance implementation is found.
- Revisit animated/metallic button treatments if the project later wants a more expressive hero CTA style.

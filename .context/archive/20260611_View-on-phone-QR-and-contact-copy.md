# ACTIVE_TASK

Status: COMPLETED on 2026-06-11

## Goal

Add a desktop "view on phone" action to the right-side navigation controls that expands a QR code for the user's current page URL.

## Issue Reference

No external issue link provided. User request on 2026-06-11:

> 在桌面端右侧菜单栏添加一个图标按钮，点击可以展开一个二维码，展示用户当前所在页面的地址。

Follow-up request on 2026-06-11:

> 请你再修改一下联系方式卡片，点击邮箱不是跳转，而是复制我的邮箱地址。

## Implementation Details

- Added an icon-only QR action to the desktop and compact-desktop navigation action clusters.
- Clicking the QR action expands a frosted-glass fixed-position panel near the trigger button.
- The QR code is generated dynamically from the current browser URL:
  - `window.location.origin`
  - React Router `pathname`
  - `search`
  - `hash`
- The generated URL therefore uses localhost during local development and the GitHub Pages production origin after deployment.
- Added outside-click close, Escape close, and repositioning on scroll/resize.
- Kept mobile bottom navigation uncluttered.
- Added localized labels/copy for the QR control and panel.
- Added `qrcode` and `@types/qrcode` for client-side SVG QR generation.
- Updated the contact dialog email card so clicking the email copies the address instead of opening `mailto:`.
- Added copy success/failure feedback and localized contact-dialog copy labels.
- Adjusted existing browser timer types in image carousel components after adding QR typings introduced Node timeout types.

## Test Plan

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Verify QR SVG generation through the installed `qrcode` package.
- [x] Start a local Vite dev server for user retest.
- [x] Confirm generated GitHub repo stats timestamp churn from build verification is not retained.

## Focusing Files

- `src/components/Navbar.tsx`
- `src/components/ContactDialog.tsx`
- `src/content/locales/zh/common.json`
- `src/content/locales/en/common.json`
- `src/components/ProjectHighlights.tsx`
- `src/components/ProjectImageGallery.tsx`
- `package.json`
- `package-lock.json`

## Technical Context

- Stack: React + TypeScript + Vite + Tailwind CSS.
- UI foundation: shadcn/ui-owned components and Radix primitives where useful; current nav is custom React/Tailwind.
- Current active style: frosted-glass visual system. Improve in place; do not add a new design variant.
- Navigation currently lives in `src/components/Navbar.tsx`, with:
  - mobile bottom nav under `md:hidden`;
  - compact tablet/desktop row from `768px` to `<1000px`;
  - full desktop row from `1000px` upward;
  - right-side action clusters for contact, language, and theme.
- Text contrast should prefer existing `text-tone-*` classes for normal foreground text.
- i18n currently registers Chinese and English locale files; Italian/Japanese are future-facing requirements but not present in the active locale tree.
- Git freshness checked before planning: current branch `main` is up to date with `origin/main` after `git fetch` (`main...origin/main` = `0 0`).

## Task Checklist

- [x] Decide QR generation approach after checking dependency size and project conventions.
- [x] Add localized labels/copy for the "view on phone" control and QR panel.
- [x] Implement a route-aware current-URL value in `Navbar`.
- [x] Add the desktop QR icon button to the right action cluster.
- [x] Implement the expandable QR panel with outside-click / Escape close behavior where appropriate.
- [x] Ensure the panel inherits the current glass styling and stays readable in dark/light themes.
- [x] Verify responsive behavior on mobile, compact desktop, and full desktop widths.
- [x] Run build verification and note any residual test gaps.
- [x] Change contact email action from `mailto:` navigation to copy-to-clipboard.
- [x] Add copy feedback states and localized strings.

# Home FPV System

This folder contains the virtual screens used by the home page FPV effect.

## Files

- `types.ts`: shared types for screens and attachments.
- `screens/index.ts`: exports the ordered screen list.
- `screens/PageXX.tsx`: one React component plus one `VirtualScreenDefinition` per screen.
- `../HomeFpvExperience.tsx`: builds the Three/CSS3D scene, places screens, syncs scrolling, and positions attachments.

## Creating A Virtual Screen

Create a screen component under `screens/`, then export a `VirtualScreenDefinition`.

```tsx
function PageExample(_props: VirtualScreenProps) {
  void _props

  return (
    <div className="fpv-virtual-page">
      <div className="fpv-page-node fpv-page-example fpv-page-copy">
        <h2>Title</h2>
        <p className="fpv-page-subtitle">Copy</p>
      </div>
    </div>
  )
}

export const pageExampleScreen: VirtualScreenDefinition = {
  id: "page-example",
  time: 4.5,
  distanceMultiplier: 0.2,
  visibleBefore: 1.12,
  visibleAfter: 1.12,
  Component: PageExample,
}
```

Then add it to `screens/index.ts`.

```ts
export const HOME_FPV_SCREENS = [
  page01Screen,
  pageExampleScreen,
].sort((a, b) => a.time - b.time)
```

Screen placement inside the virtual screen is ordinary CSS. Use `.fpv-page-node` with `left`, `right`, `top`, and `width` in `src/index.css`.

## Screen Timing

- `time`: the camera timeline second where the screen is born.
- `visibleBefore`: how long before `time` it fades in.
- `visibleAfter`: how long after `time` it remains visible.
- `fadeInDuration` and `fadeOutDuration`: optional overrides.
- `distanceMultiplier`: screen distance from the camera at birth, usually `0.2`.
- `offset`: optional `[x, y]` offset in screen-frame units.

## Creating Floating Attachments

Attachments are independent CSS3D objects that follow a DOM anchor inside a virtual screen. Use them for content that must sit in front of the screen plane.

First, create an anchor in the screen content:

```tsx
<h1
  className="fpv-attachment-anchor-hidden fpv-attachment-anchor-reference fpv-page-01-title-anchor"
  data-fpv-attachment-anchor="page01-title"
>
  {t("fpv.page01.title")}
</h1>
```

Then declare an attachment in the screen definition:

```ts
attachments: [
  {
    id: "page01-title-float",
    anchor: "page01-title",
    depth: 20,
    className: "fpv-page-01-title-float",
  },
]
```

The original anchor remains in normal layout, so responsive positioning still works. The visible attachment is placed from the anchor's actual local position.

## Attachment Depth

`depth` moves the attachment along the virtual screen's local `+Z` axis, toward the camera at the time the screen is created.

For live tuning or animation, prefer a CSS variable on the anchor:

```css
.fpv-page-01-title-anchor {
  --fpv-attachment-depth: 20;
}
```

Runtime priority is:

1. `data-fpv-attachment-depth`
2. `--fpv-attachment-depth`
3. `attachments[].depth`

In development, attachment positions are live-synced so CSS variable edits can take effect without a full page refresh. Production does not run the extra dev sync loop.

## Interactive Attachments

Do not clone interactive content. Cloning loses React event handlers.

For buttons, dialogs, links, or other interactive UI, render the attachment with its own component:

```tsx
function Page01ActionRow() {
  return (
    <div className="fpv-action-row fpv-page-01-action-row">
      <button type="button">Contact</button>
      <a href="/resume">Resume</a>
    </div>
  )
}

attachments: [
  {
    id: "page01-actions-float",
    anchor: "page01-actions",
    depth: 20,
    interactive: true,
    cloneAnchor: false,
    Component: Page01ActionRow,
  },
]
```

The screen should still include a hidden reference anchor with the same layout dimensions:

```tsx
<div
  className="fpv-attachment-anchor-hidden fpv-attachment-anchor-reference fpv-action-row fpv-page-01-action-row"
  data-fpv-attachment-anchor="page01-actions"
>
  ...
</div>
```

## Important Pitfalls

- Do not use `getBoundingClientRect()` to compute attachment local positions. It already includes CSS3D projection and makes small depth changes look huge.
- Do not use `transform: translateZ(...)` inside a virtual screen when you need true scene depth. It only transforms DOM inside the screen object; it is not the same as moving a separate CSS3D object toward the camera.
- Do not use `AppLink` inside CSS3D roots. The screen roots are mounted outside the app router context. Use plain `<a href="/resume">` for navigation unless the root is wrapped with a router.
- Do not clone interactive elements. Use a `Component` attachment with `interactive: true`.
- Keep visible floating content and its hidden reference anchor visually equivalent in size, otherwise positioning will drift.

## Debugging

Start the debug dev server:

```sh
make fpv-debug
```

This sets `VITE_FPV_DEBUG_SURFACES=true`.

Debug mode shows virtual screen bounds and makes attachment reference anchors visible with dashed outlines. This helps verify that the hidden reference content matches the visible floating attachment.

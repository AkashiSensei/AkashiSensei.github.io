# Friend Link Capsule Fix

Date: 2026-07-04

This note records the follow-up fix for the FPV friend link capsules on Page 06.

## Scope

- Keep the friend link capsule row inside the desktop HUD safe area.
- Restore the hover greeting for every capsule, including capsules whose quote is truncated.
- Use the browser-native `title` tooltip only when the quote is actually compressed.
- Detect visual quote overflow from the rendered DOM instead of relying only on the text-length preview.

## Implementation Notes

- `Page06.tsx` measures each quote line with `scrollWidth > clientWidth`, then writes a native `title` onto the cloned CSS3D markup when needed.
- `index.css` keeps the custom greeting bubble separate from quote overflow handling.
- The custom full-quote bubble was removed so truncated quotes use the simplest browser tooltip.

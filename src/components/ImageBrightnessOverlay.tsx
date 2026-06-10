import { type ImageBrightness } from "@/lib/image-brightness"

type ImageBrightnessOverlayProps = {
  brightness?: ImageBrightness
}

export function ImageBrightnessOverlay({
  brightness,
}: ImageBrightnessOverlayProps) {
  if (brightness !== "high") {
    return null
  }

  return (
    <span
      aria-hidden="true"
      className="high-brightness-image-overlay pointer-events-none absolute inset-0 z-10"
    />
  )
}


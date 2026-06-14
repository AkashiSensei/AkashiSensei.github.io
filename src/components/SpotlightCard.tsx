import {
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import "./SpotlightCard.css"

type SpotlightCardStyle = CSSProperties & {
  "--spotlight-color"?: string
}

type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean
  children?: ReactNode
  spotlightColor?: string
}

export const SpotlightCard = forwardRef<HTMLDivElement, SpotlightCardProps>(function SpotlightCard({
  asChild = false,
  children,
  className = "",
  onMouseMove,
  spotlightColor = "rgba(255, 255, 255, 0.25)",
  style,
  ...props
}, forwardedRef) {
  const divRef = useRef<HTMLDivElement | null>(null)
  const Comp = asChild ? Slot.Root : "div"

  useImperativeHandle(forwardedRef, () => divRef.current as HTMLDivElement)

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const surface = divRef.current ?? event.currentTarget
    const rect = surface.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    surface.style.setProperty("--mouse-x", `${x}px`)
    surface.style.setProperty("--mouse-y", `${y}px`)
    surface.style.setProperty("--spotlight-color", spotlightColor)
    onMouseMove?.(event)
  }

  return (
    <Comp
      ref={asChild ? undefined : divRef}
      onMouseMove={handleMouseMove}
      className={cn("card-spotlight", className)}
      style={{ ...style, "--spotlight-color": spotlightColor } as SpotlightCardStyle}
      {...props}
    >
      {children}
    </Comp>
  )
})

export default SpotlightCard

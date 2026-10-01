import { type CSSProperties, type ReactNode, useLayoutEffect, useRef } from "react"
import type { WallCard } from "@/lib/question-wall"
import { getWallDepth, getWallMotionFrames, QUESTION_WALL_MOTION, wallDepthStyle } from "@/lib/question-wall-motion"

type Props = {
  card: WallCard
  width: number
  height: number
  age: number
  count: number
  motionEnabled: boolean
  retiring: boolean
  interacting: boolean
  zIndex: number
  children: ReactNode
}

export function QuestionWallLayer({ card, width, height, age, count, motionEnabled, retiring, interacting, zIndex, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const previous = useRef({ card, width, height, age, count })
  const depth = getWallDepth(card, width, height, age, count)
  const opacity = retiring ? 0 : interacting ? 1 : depth.opacity
  const opacityAnimation = useRef<Animation | null>(null)
  const previousOpacity = useRef({ opacity, card, age, width, height, count })

  useLayoutEffect(() => {
    const from = previous.current
    previous.current = { card, width, height, age, count }
    // Layout changes establish a fresh scene; only insertion advances the camera.
    if (!motionEnabled || !ref.current?.animate || from.card !== card || from.width !== width || from.height !== height || from.count !== count || from.age >= age) return
    const frames = getWallMotionFrames(card, width, height, from.age, age, count)
      .map(({ offset, transform }) => ({ offset, transform }))
    const animation = ref.current.animate(frames, {
      duration: QUESTION_WALL_MOTION.durationMs,
      easing: QUESTION_WALL_MOTION.easing,
    })
    return () => animation.cancel()
  }, [card, width, height, age, count, motionEnabled])

  useLayoutEffect(() => {
    const element = ref.current
    const from = previousOpacity.current
    // Read the currently displayed opacity before replacing an interrupted fade.
    const currentOpacity = element && opacityAnimation.current?.playState === "running"
      ? Number(getComputedStyle(element).opacity) : from.opacity
    opacityAnimation.current?.cancel()
    opacityAnimation.current = null
    previousOpacity.current = { opacity, card, age, width, height, count }
    if (!motionEnabled || !element?.animate || from.card !== card || from.width !== width || from.height !== height || from.count !== count || currentOpacity === opacity) return

    const retreating = from.age < age && !interacting
    const frames = retreating
      ? getWallMotionFrames(card, width, height, from.age, age, count).map(({ offset, opacity }) => ({ offset, opacity }))
      : [{ opacity: currentOpacity }, { opacity }]
    frames[0].opacity = currentOpacity
    opacityAnimation.current = element.animate(frames, {
      duration: retreating ? QUESTION_WALL_MOTION.durationMs : QUESTION_WALL_MOTION.highlightDurationMs,
      easing: QUESTION_WALL_MOTION.easing,
    })
  }, [opacity, card, age, width, height, count, interacting, motionEnabled])

  useLayoutEffect(() => () => opacityAnimation.current?.cancel(), [])

  return <div ref={ref} className="question-wall-layer" data-retiring={retiring || undefined}
    aria-hidden={retiring || undefined} inert={retiring}
    style={{ left: card.x, top: card.y, width: card.width, fontSize: card.fontSize,
      // Express the wall's vanishing point in the incoming button's local coordinates.
      "--question-wall-entry-origin": `${width / 2 - card.x}px ${height / 2 - card.y}px`,
      zIndex: interacting ? 30 : zIndex, ...wallDepthStyle(depth),
      opacity } as CSSProperties}>
    {children}
  </div>
}

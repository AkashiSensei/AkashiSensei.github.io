import { useLayoutEffect, useRef, type ReactNode } from "react"
import { CONVERSATION_MOTION, conversationTravel } from "@/lib/question-conversation-motion"

export function QuestionConversationFlow({ open, roundId, children }: {
  open: boolean
  roundId?: string | null
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const animations = useRef<Animation[]>([])

  useLayoutEffect(() => {
    const flow = ref.current
    const scroller = flow?.closest<HTMLElement>(".question-conversation")
    if (!flow || !scroller) return
    if (open) {
      const heading = roundId ? document.getElementById(`question-round-${roundId}`) : null
      scroller.scrollTop = heading
        ? scroller.scrollTop + heading.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 16
        : 0
    }

    const parts = [...flow.querySelectorAll<HTMLElement>(".question-message, .question-project-summary, [data-conversation-not-found]")]
    // Capture the current presentation before cancelling an interrupted entrance.
    const frames = parts.map((part) => {
      const rect = part.getBoundingClientRect()
      const style = getComputedStyle(part)
      const y = style.transform === "none" ? 0 : new DOMMatrixReadOnly(style.transform).m42
      return { part, top: rect.top - y, bottom: rect.bottom - y, y, opacity: Number(style.opacity),
        visible: rect.bottom > 0 && rect.top < window.innerHeight }
    })
    const interrupted = animations.current.length > 0
    animations.current.forEach((animation) => animation.cancel())
    animations.current = []
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    animations.current = frames.map(({ part, top, bottom, y, opacity, visible }, index) => {
      const travel = conversationTravel(top, bottom, window.innerHeight)
      // Off-screen answers must not sweep back through the viewport on dismissal.
      if (!open && !visible) return part.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: "both" })
      return part.animate(open ? [
        { transform: `translateY(${interrupted ? y : travel.entry}px)`, opacity: interrupted ? opacity : 0 },
        { transform: "translateY(0)", opacity: 1 },
      ] : [
        { transform: `translateY(${y}px)`, opacity },
        { transform: `translateY(${travel.exit}px)`, opacity: 0 },
      ], {
        duration: open ? CONVERSATION_MOTION.enterDuration : CONVERSATION_MOTION.exitDuration,
        delay: index * CONVERSATION_MOTION.stagger,
        easing: open ? CONVERSATION_MOTION.enterEasing : CONVERSATION_MOTION.exitEasing,
        fill: "both",
      })
    })
  }, [open, roundId])

  useLayoutEffect(() => () => {
    animations.current.forEach((animation) => animation.cancel())
    animations.current = []
  }, [])

  return <div className="question-conversation-flow" ref={ref}>{children}</div>
}

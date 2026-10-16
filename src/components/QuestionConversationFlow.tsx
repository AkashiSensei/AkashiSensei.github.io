import { useLayoutEffect, useRef, type ReactNode } from "react"
import { captureConversationFrames, animateConversationFrames } from "@/lib/question-conversation-animation"

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

    // Capture the current presentation before cancelling an interrupted entrance.
    const frames = captureConversationFrames(flow)
    const interrupted = animations.current.length > 0
    animations.current.forEach((animation) => animation.cancel())
    animations.current = []
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    animations.current = animateConversationFrames(frames, open, interrupted, window.innerHeight)
  }, [open, roundId])

  useLayoutEffect(() => () => {
    animations.current.forEach((animation) => animation.cancel())
    animations.current = []
  }, [])

  return <div className="question-conversation-flow" ref={ref}>{children}</div>
}

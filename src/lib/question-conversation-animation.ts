import { CONVERSATION_MOTION, conversationExitDelay, conversationExitDuration, conversationTravel } from "./question-conversation-motion.ts"

const partSelector = ".question-message, .question-project-summary, [data-conversation-not-found]"

type ConversationFrame = {
  part: HTMLElement
  top: number
  bottom: number
  y: number
  opacity: number
  visible: boolean
}

export function captureConversationFrames(flow: HTMLElement): ConversationFrame[] {
  return [...flow.querySelectorAll<HTMLElement>(partSelector)].map((part) => {
    const rect = part.getBoundingClientRect()
    const style = getComputedStyle(part)
    const y = style.transform === "none" ? 0 : new DOMMatrixReadOnly(style.transform).m42
    return { part, top: rect.top - y, bottom: rect.bottom - y, y, opacity: Number(style.opacity),
      visible: rect.bottom > 0 && rect.top < window.innerHeight }
  })
}

export function animateConversationFrames(frames: ConversationFrame[], open: boolean, interrupted: boolean, viewportHeight: number) {
  // A shared displacement keeps tall images from catching the earlier text.
  const exitTravel = -frames.reduce((bottom, frame) => frame.visible ? Math.max(bottom, frame.bottom + frame.y) : bottom, 0) - 24
  let exitIndex = 0
  return frames.map(({ part, top, bottom, y, opacity, visible }, index) => {
    const travel = conversationTravel(top, bottom, viewportHeight)
    // Off-screen answers must not sweep back through the viewport on dismissal.
    if (!open && !visible) return part.animate([{ opacity: 0 }, { opacity: 0 }], { duration: 1, fill: "both" })
    return part.animate(open ? [
      { transform: `translateY(${interrupted ? y : travel.entry}px)`, opacity: interrupted ? opacity : 0 },
      { transform: "translateY(0)", opacity: 1 },
    ] : [
      { transform: `translateY(${y}px)`, opacity },
      { transform: `translateY(${y + exitTravel}px)`, opacity: 0 },
    ], {
      duration: open ? CONVERSATION_MOTION.enterDuration : CONVERSATION_MOTION.exitDuration,
      delay: open ? index * CONVERSATION_MOTION.stagger : conversationExitDelay(exitIndex++),
      easing: open ? CONVERSATION_MOTION.enterEasing : CONVERSATION_MOTION.exitEasing,
      fill: "both",
    })
  })
}

// Capture before React detaches the modal DOM. The clone owns no scroll lock,
// focus scope, event handlers or accessible content, so the page is usable now.
export function retainConversationExit(content: HTMLElement, backdrop: HTMLElement | null) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !content.animate) return () => {}

  const frames = captureConversationFrames(content)
  const layer = document.createElement("div")
  layer.className = "question-conversation-exit-layer"
  layer.setAttribute("aria-hidden", "true")
  layer.inert = true
  const animations: Animation[] = []
  const duration = conversationExitDuration(frames.filter((frame) => frame.visible).length)
  const backdropOpacity = backdrop ? Number(getComputedStyle(backdrop).opacity) : 0
  let backdropClone: HTMLElement | null = null
  if (backdrop) {
    backdropClone = backdrop.cloneNode(true) as HTMLElement
    backdropClone.style.animation = "none"
    layer.append(backdropClone)
  }

  const clone = content.cloneNode(true) as HTMLElement
  const bounds = content.getBoundingClientRect()
  // Unlocking the document can restore its scrollbar; keep the exit text fixed.
  clone.style.width = `${bounds.width}px`
  clone.style.height = `${bounds.height}px`
  clone.dataset.state = "closed"
  clone.removeAttribute("id")
  clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"))
  layer.append(clone)
  document.body.append(layer)
  clone.scrollTop = content.scrollTop
  if (backdropClone) animations.push(backdropClone.animate([{ opacity: backdropOpacity }, { opacity: 0 }], { duration, easing: "ease-out", fill: "both" }))
  const parts = [...clone.querySelectorAll<HTMLElement>(partSelector)]
  animations.push(...animateConversationFrames(frames.map((frame, index) => ({ ...frame, part: parts[index] })), false, true, window.innerHeight))

  let removed = false
  const cleanup = () => {
    if (removed) return
    removed = true
    window.clearTimeout(timer)
    animations.forEach((animation) => animation.cancel())
    layer.remove()
  }
  // Also clean up if an animation never reports completion (e.g. a hidden tab).
  const timer = window.setTimeout(cleanup, duration + 50)
  void Promise.allSettled(animations.map((animation) => animation.finished)).then(cleanup)
  return cleanup
}

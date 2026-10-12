export type ResumeEdgeState = {
  phase: "hidden" | "peeking" | "ready"
  reveal: number
  leaveSince: number | null
}

export type ResumeEdgeInput = {
  pointer: { x: number; y: number } | null
  viewportWidth: number
  travelDistance: number
  now: number
  enabled: boolean
  keyboardFocused: boolean
  overTitle: boolean
  titlesVisible: boolean
  pressed: boolean
}

export const resumeEdgeTiming = { leave: 240 } as const
const MAX_PREVIEW_DISTANCE = 3

export function createResumeEdgeState(): ResumeEdgeState {
  return { phase: "hidden", reveal: 0, leaveSince: null }
}

function smoothstep(value: number) {
  const clamped = Math.max(0, Math.min(1, value))
  return clamped * clamped * (3 - 2 * clamped)
}

export function getNextResumeEdgeState(previous: ResumeEdgeState, input: ResumeEdgeInput): {
  state: ResumeEdgeState
  deadline: number | null
} {
  const ready: ResumeEdgeState = { phase: "ready", reveal: 1, leaveSince: null }
  // Do not move a button between pointerdown and click: even a partly exposed
  // circle must remain clickable while it is still being approached.
  if (input.pressed) return { state: previous, deadline: null }
  if (!input.enabled) return { state: ready, deadline: null }
  if (input.keyboardFocused) return { state: ready, deadline: null }

  const { pointer, viewportWidth, now } = input
  const inViewport = pointer !== null && pointer.x >= 0 && pointer.x <= viewportWidth
  // Screen-wide horizontal bands apply at every height, with no dwell delay.
  const readyBoundary = viewportWidth / 6
  const previewBoundary = viewportWidth / 3
  if (input.overTitle || (inViewport && pointer.x <= readyBoundary)) {
    return { state: ready, deadline: null }
  }

  // Count departure time while holding ready, so finishing the text wave does
  // not add another exit delay before the rail can retract.
  if (input.titlesVisible) {
    return { state: { ...ready, leaveSince: previous.leaveSince ?? now }, deadline: null }
  }

  if (previous.phase === "ready") {
    const leaveSince = previous.leaveSince ?? now
    const deadline = leaveSince + resumeEdgeTiming.leave
    if (now < deadline) return { state: { ...ready, leaveSince }, deadline }
  }

  const progress = inViewport ? smoothstep((previewBoundary - pointer.x) / readyBoundary) : 0
  // A physical cap keeps the tentative movement subtle on wide screens too.
  const maxPreview = Math.min(0.12, MAX_PREVIEW_DISTANCE / Math.max(1, input.travelDistance))
  const reveal = maxPreview * progress

  return {
    state: { phase: reveal > 0 ? "peeking" : "hidden", reveal, leaveSince: null },
    deadline: null,
  }
}

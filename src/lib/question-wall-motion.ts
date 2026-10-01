import type { WallCard } from "./question-wall.ts"

// Keep the local wall choreography tunable without changing text layout.
export const QUESTION_WALL_MOTION = {
  durationMs: 1000,
  highlightDurationMs: 500,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  entryScale: 1.28,
  entryLiftPx: 20,
  nearDepth: 640,
  farDepth: 1800,
  retreatPerStep: 40,
  projectionSegments: 16,
  opacityPower: 1.3,
} as const

export function getWallInitialDepth(card: WallCard, width: number, height: number) {
  const nx = (card.x + card.width / 2 - width / 2) / Math.max(1, (width - card.width) / 2)
  const ny = (card.y + card.height / 2 - height / 2) / Math.max(1, (height - card.height) / 2)
  const radius = Math.min(1, Math.hypot(nx, ny))
  // Scene composition, not a law of perspective: peripheral questions start nearer.
  // Derive depth from the original layout so it stays fixed as the camera retreats.
  return QUESTION_WALL_MOTION.farDepth + (QUESTION_WALL_MOTION.nearDepth - QUESTION_WALL_MOTION.farDepth) * radius
}

export function getWallDepth(card: WallCard, width: number, height: number, age: number, count: number) {
  const initialDepth = getWallInitialDepth(card, width, height)
  // Pinhole projection x=fX/Z: after a camera retreat d, the relative scale is Z/(Z+d).
  // Each question has its own Z; its geometry and center displacement remain coupled.
  const scale = initialDepth / (initialDepth + Math.max(0, age) * QUESTION_WALL_MOTION.retreatPerStep)
  return {
    x: (width / 2 - (card.x + card.width / 2)) * (1 - scale),
    y: (height / 2 - (card.y + card.height / 2)) * (1 - scale),
    scale,
    opacity: Math.max(0, 1 - age / Math.max(1, count)) ** QUESTION_WALL_MOTION.opacityPower,
  }
}

export function wallDepthStyle(depth: ReturnType<typeof getWallDepth>) {
  return {
    transform: `translate(${depth.x}px, ${depth.y}px) scale(${depth.scale})`,
    opacity: depth.opacity,
  }
}

export function getWallMotionFrames(card: WallCard, width: number, height: number, fromAge: number, toAge: number, count: number) {
  // Sample the perspective divide within each step, not just its two endpoints.
  // The browser interpolates these bounded transform/opacity frames without a JS frame loop.
  return Array.from({ length: QUESTION_WALL_MOTION.projectionSegments + 1 }, (_, index) => {
    const offset = index / QUESTION_WALL_MOTION.projectionSegments
    return { offset, ...wallDepthStyle(getWallDepth(card, width, height, fromAge + (toAge - fromAge) * offset, count)) }
  })
}

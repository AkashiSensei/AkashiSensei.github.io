import { DIALOG_MOTION } from "./dialog-motion.ts"

export const CONVERSATION_MOTION = {
  ...DIALOG_MOTION,
  exitDuration: 200,
  stagger: 70,
  exitStagger: 35,
} as const

export function conversationExitDelay(index: number) {
  return Math.max(0, index) * CONVERSATION_MOTION.exitStagger
}

// Only the visual exit layer remains until the last staggered part leaves.
export function conversationExitDuration(partCount: number) {
  return CONVERSATION_MOTION.exitDuration + conversationExitDelay(partCount - 1)
}

export function conversationTravel(top: number, bottom: number, viewportHeight: number) {
  return { entry: Math.max(32, viewportHeight - top + 24), exit: -bottom - 24 }
}

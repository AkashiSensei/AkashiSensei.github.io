import { DIALOG_MOTION } from "./dialog-motion.ts"

export const CONVERSATION_MOTION = { ...DIALOG_MOTION, stagger: 70 } as const

// Radix retains the modal until the last staggered part has finished leaving.
export function conversationExitDuration(partCount: number) {
  return CONVERSATION_MOTION.exitDuration + Math.max(0, partCount - 1) * CONVERSATION_MOTION.stagger
}

export function conversationTravel(top: number, bottom: number, viewportHeight: number) {
  return { entry: Math.max(32, viewportHeight - top + 24), exit: -bottom - 24 }
}

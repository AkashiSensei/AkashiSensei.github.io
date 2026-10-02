export const DIALOG_MOTION = {
  enterDuration: 500,
  exitDuration: 330,
  backdropEnterDuration: 350,
  enterEasing: "cubic-bezier(.22,1,.36,1)",
  exitEasing: "cubic-bezier(.55,0,.8,.45)",
} as const

export const dialogMotionStyle = {
  "--dialog-enter-duration": `${DIALOG_MOTION.enterDuration}ms`,
  "--dialog-exit-duration": `${DIALOG_MOTION.exitDuration}ms`,
  "--dialog-backdrop-enter-duration": `${DIALOG_MOTION.backdropEnterDuration}ms`,
  "--dialog-enter-easing": DIALOG_MOTION.enterEasing,
  "--dialog-exit-easing": DIALOG_MOTION.exitEasing,
}

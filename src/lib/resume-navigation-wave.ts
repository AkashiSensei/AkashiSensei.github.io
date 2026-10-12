export const resumeNavigationWaveTiming = { step: 30, leave: 160, open: 380, close: 240 } as const

type ResumeNavigationWaveState = { open: boolean; closing: boolean; originId: string; selectedId: string }

export function closeResumeNavigationWave(previous: ResumeNavigationWaveState): ResumeNavigationWaveState {
  if (!previous.open) return previous
  return { ...previous, open: false, closing: true, originId: previous.selectedId || previous.originId }
}

export function getResumeNavigationCloseDuration(count: number, originIndex: number) {
  if (count <= 0) return 0
  const origin = Math.max(0, Math.min(count - 1, originIndex))
  return Math.max(origin, count - 1 - origin) * resumeNavigationWaveTiming.step + resumeNavigationWaveTiming.close
}

export function getResumeNavigationWaveStep(index: number, originIndex: number) {
  return Math.abs(index - originIndex)
}

export function getResumeNavigationRowSpacing(index: number, selectedIndex: number, count: number) {
  const selected = index === selectedIndex && selectedIndex >= 0 && selectedIndex < count
  // Only internal gaps expand, so the visible group and its flex box share a
  // midpoint even at the first/last item. CSS centers the live animated height.
  return { before: selected && index > 0 ? 6 : 0, after: selected && index < count - 1 ? 6 : 0 }
}

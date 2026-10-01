export type QuestionTextLayout = { width: number; height: number; fontSize: number }
export type MeasureQuestionText = (fontSize: number, width?: number) => { width: number; height: number }
type TextMetrics = { paddingInline: number; paddingBlock: number; lineHeight: number }

// Measurement includes the actual font, inline code, line breaks and text padding.
export function fitQuestionText(wallWidth: number, wallHeight: number, measure: MeasureQuestionText,
  metrics: TextMetrics = { paddingInline: 12, paddingBlock: 8, lineHeight: 1.4 }): QuestionTextLayout {
  const availableWidth = Math.max(1, wallWidth - 16)
  const availableHeight = Math.max(1, wallHeight - 16)
  const natural = measure(20)
  const units = Math.max(1, (natural.width - metrics.paddingInline) / 20)
  const compact = wallWidth < 640
  const preferredSize = (compact ? 20 : 24) - (units > 50 ? 4 : units > 18 ? 2 : 0)
  const maxWidth = Math.min(availableWidth, Math.max(280, Math.min(560, wallWidth * .55)))
  const ratio = compact ? 2.8 : 3.2

  const single = measure(preferredSize)
  if (units <= 18 && single.width <= maxWidth && single.height <= preferredSize * metrics.lineHeight + metrics.paddingBlock + 1 && single.height <= availableHeight) {
    return { width: Math.min(availableWidth, Math.ceil(single.width)), height: Math.ceil(single.height), fontSize: preferredSize }
  }

  let best: QuestionTextLayout | undefined
  let bestScore = Infinity
  for (let fontSize = preferredSize; fontSize >= Math.max(14, preferredSize - 2); fontSize--) {
    const idealWidth = Math.sqrt(units * fontSize * fontSize * metrics.lineHeight * ratio)
    const widths = new Set([maxWidth, ...[.78, .9, 1, 1.12, 1.26].map((scale) =>
      Math.min(maxWidth, Math.max(Math.min(availableWidth, fontSize * 7), Math.round(idealWidth * scale))),
    )])
    for (const width of widths) {
      const size = measure(fontSize, width)
      if (size.height > availableHeight) continue
      const score = Math.abs(Math.log(size.width / size.height / ratio)) + (preferredSize - fontSize) * .15
      if (score < bestScore) {
        bestScore = score
        best = { width, height: Math.ceil(size.height), fontSize }
      }
    }
  }
  if (best) return best

  // Very narrow/short viewports prioritize complete content over the target aspect ratio.
  let fontSize = Math.max(14, preferredSize - 2)
  let size = measure(fontSize, availableWidth)
  while (size.height > availableHeight && fontSize > 12) {
    fontSize--
    size = measure(fontSize, availableWidth)
  }
  return { width: availableWidth, height: Math.ceil(size.height), fontSize }
}

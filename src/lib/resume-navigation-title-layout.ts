type ButtonBounds = { top: number; bottom: number; right: number }
type TitleLayout = { left: number; top: number; width: number; height: number; textCenter: number }

export function getResumeNavigationTitleLayouts(
  buttons: readonly ButtonBounds[],
  titleWidths: readonly number[],
  viewportWidth: number,
  rail: { top: number; bottom: number },
): (TitleLayout | null)[] {
  const widest = Math.max(0, ...titleWidths)
  const centers = buttons.map((button) => (button.top + button.bottom) / 2)
  const visible = centers.flatMap((center, index) => center >= rail.top && center <= rail.bottom ? [index] : [])
  const layouts: (TitleLayout | null)[] = buttons.map(() => null)
  visible.forEach((index, position) => {
    const button = buttons[index]
    const center = centers[index]
    // Adjacent targets meet halfway, even while gaps are expanding/shrinking.
    const top = position > 0 ? (centers[visible[position - 1]] + center) / 2 : button.top - 8
    const bottom = position < visible.length - 1 ? (center + centers[visible[position + 1]]) / 2 : button.bottom + 8
    layouts[index] = {
      left: button.right,
      top,
      width: Math.min(widest + 20, Math.max(0, viewportWidth - button.right - 16)),
      height: bottom - top,
      textCenter: center - top,
    }
  })
  return layouts
}

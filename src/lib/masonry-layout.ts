// Place items in input order at the next available vertical position.
export function masonryLayout(heights: number[], columns: number, columnWidth: number, gap: number) {
  const bottoms = Array.from({ length: Math.max(1, columns) }, () => 0)
  const positions = heights.map((height) => {
    const column = bottoms.indexOf(Math.min(...bottoms))
    const top = bottoms[column]
    bottoms[column] += height
    return { top, left: column * (columnWidth + gap) }
  })
  return { positions, height: Math.max(...bottoms) }
}

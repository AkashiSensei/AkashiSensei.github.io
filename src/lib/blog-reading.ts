export type HeadingPosition = { id: string; top: number }

// Keep the current section active even when its heading has left the viewport.
export function getReadingSection(headings: HeadingPosition[], readingLine: number, atPageEnd = false): string | undefined {
  if (atPageEnd) return headings.at(-1)?.id
  let current: string | undefined
  for (const heading of headings) {
    if (heading.top > readingLine) break
    current = heading.id
  }
  return current
}

export function observeBlogReadingSection(body: HTMLElement, headingIds: readonly string[], onChange: (section: string | undefined) => void) {
  let frame = 0
  const update = () => {
    frame = 0
    // Markdown can replace its heading nodes without changing the source text.
    // Always measure the current, visible nodes within this article body.
    const byId = new Map(Array.from(body.querySelectorAll<HTMLElement>("h2[id], h3[id], h4[id], h5[id], h6[id]"))
      .filter((element) => element.isConnected && element.getClientRects().length)
      .map((element) => [element.id, element]))
    const elements = headingIds.flatMap((id) => {
      const element = byId.get(id)
      return element ? [element] : []
    })
    const readingLine = elements.length ? Number.parseFloat(getComputedStyle(elements[0]).scrollMarginTop) || 0 : 0
    const positions = elements.map((element) => ({ id: element.id, top: element.getBoundingClientRect().top }))
      .filter(({ top }) => Number.isFinite(top))
    const root = document.scrollingElement ?? document.documentElement
    const viewportHeight = root.clientHeight || window.innerHeight
    const atPageEnd = root.scrollTop > 0 && root.scrollTop + viewportHeight >= root.scrollHeight - 1
    onChange(getReadingSection(positions, readingLine + 1, atPageEnd))
  }
  const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
  window.addEventListener("hashchange", schedule)
  const resizeObserver = new ResizeObserver(schedule)
  resizeObserver.observe(body)
  const mutationObserver = new MutationObserver(schedule)
  mutationObserver.observe(body, { childList: true, subtree: true, attributes: true, attributeFilter: ["id", "class", "style", "hidden"] })
  schedule()
  return () => {
    window.cancelAnimationFrame(frame)
    resizeObserver.disconnect()
    mutationObserver.disconnect()
    window.removeEventListener("scroll", schedule)
    window.removeEventListener("resize", schedule)
    window.removeEventListener("hashchange", schedule)
  }
}

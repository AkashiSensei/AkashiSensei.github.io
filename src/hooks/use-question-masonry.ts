import { useLayoutEffect, useRef } from "react"
import { masonryLayout } from "@/lib/masonry-layout"

export function useQuestionMasonry(enabled: boolean, itemKey: string) {
  const ref = useRef<HTMLOListElement>(null)

  useLayoutEffect(() => {
    const list = ref.current
    if (!enabled || !list) return
    const items = Array.from(list.children) as HTMLElement[]
    let frame = 0
    const layout = () => {
      const style = getComputedStyle(list)
      const columns = Number(style.getPropertyValue("--question-columns")) || 1
      const gap = parseFloat(style.columnGap) || 0
      const columnWidth = (list.clientWidth - gap * (columns - 1)) / columns
      // CSS sets the responsive width first, so measurements include actual tag/text wrapping.
      const result = masonryLayout(items.map((item) => item.getBoundingClientRect().height), columns, columnWidth, gap)
      items.forEach((item, index) => {
        item.style.top = `${result.positions[index].top}px`
        item.style.left = `${result.positions[index].left}px`
      })
      list.style.height = `${result.height}px`
      list.dataset.masonryReady = "true"
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(layout)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(list)
    items.forEach((item) => observer.observe(item))
    window.addEventListener("resize", schedule)
    layout()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", schedule)
      delete list.dataset.masonryReady
      list.style.removeProperty("height")
      items.forEach((item) => {
        item.style.removeProperty("top")
        item.style.removeProperty("left")
      })
    }
  }, [enabled, itemKey])

  return ref
}

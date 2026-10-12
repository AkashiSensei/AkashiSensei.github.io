import { type RefObject, useLayoutEffect } from "react"

import { getResumeNavigationTitleLayouts } from "@/lib/resume-navigation-title-layout"

// Labels live outside the scroll rail so short screens cannot clip them. Follow
// real button positions only while a finite CSS transition is running.
export function useResumeNavigationTitlePositions(
  navRef: RefObject<HTMLElement | null>,
  titlesRef: RefObject<HTMLDivElement | null>,
  backdropRef: RefObject<HTMLDivElement | null>,
  visibleIds: readonly string[],
  selectedIndex: number,
) {
  useLayoutEffect(() => {
    const nav = navRef.current
    const titles = titlesRef.current
    if (!nav || !titles) return
    let frame: number | null = null
    const moving = new Map<HTMLElement, Set<string>>()
    const entries = visibleIds.flatMap((id) => {
      const button = nav.querySelector<HTMLElement>(`[aria-controls="${id}"]`)
      const label = titles.querySelector<HTMLElement>(`[data-section-id="${id}"]`)
      const measure = label?.querySelector<HTMLElement>(".resume-section-nav-title-measure")
      return button && label && measure ? [{ button, label, measure }] : []
    })

    const update = () => {
      frame = null
      const rail = nav.getBoundingClientRect()
      // Batch reads before writes to avoid forcing layout once per label.
      const bounds = entries.map(({ button }) => button.getBoundingClientRect())
      const widths = entries.map(({ measure }) => measure.getBoundingClientRect().width)
      const layouts = getResumeNavigationTitleLayouts(bounds, widths, window.innerWidth, rail)
      // Leave a compact feathered tail beyond the longest localized title.
      const titleRight = Math.max(0, ...layouts.map((layout) => layout ? layout.left + layout.width : 0))
      backdropRef.current?.style.setProperty("--resume-nav-backdrop-width", `${Math.min(window.innerWidth, titleRight + 64)}px`)
      entries.forEach(({ label }, index) => {
        const layout = layouts[index]
        label.dataset.inViewport = String(layout !== null)
        if (!layout) return
        label.style.left = `${layout.left}px`
        label.style.top = `${layout.top}px`
        label.style.width = `${layout.width}px`
        label.style.height = `${layout.height}px`
        label.style.setProperty("--resume-title-center", `${layout.textCenter}px`)
      })
      if (moving.size > 0) requestUpdate()
    }

    const requestUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(update)
    }

    const onTransition = (event: TransitionEvent) => {
      if (!(event.target instanceof HTMLElement)) return
      const isRail = event.target === nav && event.propertyName === "transform"
      const isRow = event.target.matches(".resume-section-nav-button")
        && (event.propertyName === "margin-top" || event.propertyName === "margin-bottom")
      if (!isRail && !isRow) return
      const properties = moving.get(event.target) ?? new Set<string>()
      if (event.type === "transitionrun") properties.add(event.propertyName)
      else properties.delete(event.propertyName)
      if (properties.size > 0) moving.set(event.target, properties)
      else moving.delete(event.target)
      requestUpdate()
    }

    const observer = new ResizeObserver(requestUpdate)
    observer.observe(nav)
    entries.forEach(({ measure }) => observer.observe(measure))
    nav.addEventListener("scroll", requestUpdate, { passive: true })
    nav.addEventListener("transitionrun", onTransition)
    nav.addEventListener("transitionend", onTransition)
    nav.addEventListener("transitioncancel", onTransition)
    window.addEventListener("resize", requestUpdate)
    requestUpdate()

    return () => {
      observer.disconnect()
      if (frame !== null) window.cancelAnimationFrame(frame)
      nav.removeEventListener("scroll", requestUpdate)
      nav.removeEventListener("transitionrun", onTransition)
      nav.removeEventListener("transitionend", onTransition)
      nav.removeEventListener("transitioncancel", onTransition)
      window.removeEventListener("resize", requestUpdate)
    }
  }, [navRef, titlesRef, backdropRef, visibleIds, selectedIndex])
}

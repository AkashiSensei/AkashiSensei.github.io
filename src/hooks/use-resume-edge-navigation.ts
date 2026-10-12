import { type RefObject, useCallback, useEffect, useLayoutEffect, useRef } from "react"

import { createResumeEdgeState, getNextResumeEdgeState, type ResumeEdgeInput } from "@/lib/resume-edge-navigation"

const EDGE_NAVIGATION_QUERY = "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

export function useResumeEdgeNavigation(
  navRef: RefObject<HTMLElement | null>,
  titlesRef: RefObject<HTMLElement | null>,
  titlesVisible: boolean,
) {
  const titlesVisibleRef = useRef(titlesVisible)
  const requestUpdateRef = useRef<() => void>(() => {})
  const confirmRef = useRef<(pointer?: { x: number; y: number }) => void>(() => {})
  const confirmIntent = useCallback((pointer?: { x: number; y: number }) => confirmRef.current(pointer), [])

  useLayoutEffect(() => {
    titlesVisibleRef.current = titlesVisible
    requestUpdateRef.current()
  }, [titlesVisible])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const media = window.matchMedia(EDGE_NAVIGATION_QUERY)
    let state = createResumeEdgeState()
    let pointer: ResumeEdgeInput["pointer"] = null
    let overTitle = false
    let pressed = false
    let touchOverride = false
    let frame: number | null = null
    let timer: number | null = null

    const clearTimer = () => {
      if (timer !== null) window.clearTimeout(timer)
      timer = null
    }

    const update = () => {
      frame = null
      clearTimer()
      if (!pressed) {
        delete nav.dataset.edgePressed
        nav.style.removeProperty("--resume-nav-held-transform")
        nav.querySelectorAll<HTMLElement>(".resume-section-nav-button").forEach((button) => {
          button.style.removeProperty("--resume-row-held-transform")
          button.style.removeProperty("--resume-row-held-before")
          button.style.removeProperty("--resume-row-held-after")
        })
      }
      const rect = nav.getBoundingClientRect()
      // Use layout dimensions, independent of the live animated transforms.
      const left = Number.parseFloat(window.getComputedStyle(nav).left) || 0
      const circle = nav.querySelector<HTMLElement>(".resume-section-nav-circle")
      const restingCenter = (circle?.offsetWidth ?? 0) / 6
      const now = performance.now()
      const result = getNextResumeEdgeState(state, {
        pointer,
        viewportWidth: document.documentElement.clientWidth,
        travelDistance: left + rect.width / 2 - restingCenter,
        now,
        enabled: media.matches && !touchOverride,
        keyboardFocused: document.hasFocus() && (nav.querySelector(":focus-visible") !== null
          || titlesRef.current?.querySelector(":focus-visible") != null),
        overTitle,
        titlesVisible: titlesVisibleRef.current,
        pressed,
      })
      state = result.state
      nav.style.setProperty("--resume-nav-reveal", String(state.reveal))
      nav.dataset.edgeState = state.phase
      if (result.deadline !== null) {
        timer = window.setTimeout(requestUpdate, Math.max(1, Math.ceil(result.deadline - now)))
      }
    }

    const requestUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(update)
    }
    requestUpdateRef.current = requestUpdate

    confirmRef.current = (point) => {
      if (point) pointer = point
      state = { phase: "ready", reveal: 1, leaveSince: null }
      requestUpdate()
    }

    const isTitle = (target: EventTarget | null) => target instanceof Element
      && titlesRef.current?.contains(target) === true
      && target.closest(".resume-section-nav-title") !== null

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !media.matches) return
      if (event.buttons === 0) pressed = false
      touchOverride = false
      pointer = { x: event.clientX, y: event.clientY }
      overTitle = isTitle(event.target)
      requestUpdate()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") touchOverride = true
      else pointer = { x: event.clientX, y: event.clientY }
      overTitle = isTitle(event.target)
      pressed = event.target instanceof Node && (nav.contains(event.target) || isTitle(event.target))
      if (pressed && media.matches) {
        // Freeze the actual in-flight transform, not just its destination.
        nav.style.setProperty("--resume-nav-held-transform", window.getComputedStyle(nav).transform)
        nav.querySelectorAll<HTMLElement>(".resume-section-nav-button").forEach((button) => {
          const style = window.getComputedStyle(button)
          button.style.setProperty("--resume-row-held-transform", style.transform)
          button.style.setProperty("--resume-row-held-before", style.marginTop)
          button.style.setProperty("--resume-row-held-after", style.marginBottom)
        })
        nav.dataset.edgePressed = "true"
      }
      requestUpdate()
    }

    const onPointerUp = () => {
      pressed = false
      requestUpdate()
    }

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null || event.pointerType !== "mouse") return
      pointer = null
      overTitle = false
      requestUpdate()
    }

    const reset = () => {
      pointer = null
      overTitle = false
      pressed = false
      state = createResumeEdgeState()
      requestUpdate()
    }

    const observer = new ResizeObserver(requestUpdate)
    observer.observe(nav)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerdown", onPointerDown, { capture: true, passive: true })
    window.addEventListener("pointerup", onPointerUp, { passive: true })
    window.addEventListener("pointercancel", onPointerUp, { passive: true })
    window.addEventListener("pointerout", onPointerOut, { passive: true })
    window.addEventListener("focusin", requestUpdate)
    window.addEventListener("focusout", requestUpdate)
    window.addEventListener("resize", reset)
    window.addEventListener("blur", reset)
    document.addEventListener("visibilitychange", reset)
    media.addEventListener("change", reset)
    requestUpdate()

    return () => {
      observer.disconnect()
      clearTimer()
      if (frame !== null) window.cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerdown", onPointerDown, { capture: true })
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)
      window.removeEventListener("pointerout", onPointerOut)
      window.removeEventListener("focusin", requestUpdate)
      window.removeEventListener("focusout", requestUpdate)
      window.removeEventListener("resize", reset)
      window.removeEventListener("blur", reset)
      document.removeEventListener("visibilitychange", reset)
      media.removeEventListener("change", reset)
      nav.style.removeProperty("--resume-nav-reveal")
      nav.style.removeProperty("--resume-nav-held-transform")
      nav.querySelectorAll<HTMLElement>(".resume-section-nav-button").forEach((button) => {
        button.style.removeProperty("--resume-row-held-transform")
        button.style.removeProperty("--resume-row-held-before")
        button.style.removeProperty("--resume-row-held-after")
      })
      delete nav.dataset.edgeState
      delete nav.dataset.edgePressed
      confirmRef.current = () => {}
      requestUpdateRef.current = () => {}
    }
  }, [navRef, titlesRef])

  return confirmIntent
}

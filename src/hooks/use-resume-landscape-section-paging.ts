import { type RefObject, useEffect, useRef } from "react"

const LANDSCAPE_PAGING_QUERY = "(min-width: 768px) and (orientation: landscape)"
const SECTION_SELECTOR = ".resume-hero-section, .resume-rhythm-section"
const SCROLL_DURATION_MS = 420
const SNAP_EPSILON_PX = 8

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function clamp01(value: number) {
  return clamp(value, 0, 1)
}

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - ((-2 * progress + 2) ** 3) / 2
}

function getMaxScrollY() {
  return Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
}

function getSectionTops(stack: HTMLElement) {
  return Array.from(stack.querySelectorAll<HTMLElement>(SECTION_SELECTOR), (section) =>
    Math.max(0, Math.round(section.getBoundingClientRect().top + window.scrollY)),
  )
}

function getSnapTargets(stack: HTMLElement) {
  const sectionTops = getSectionTops(stack)
  const maxScrollY = getMaxScrollY()
  const lastSectionTop = sectionTops[sectionTops.length - 1] ?? 0

  if (maxScrollY > lastSectionTop + SNAP_EPSILON_PX) {
    return [...sectionTops, maxScrollY]
  }

  return sectionTops
}

function getAdjacentTarget(targets: number[], currentY: number, direction: 1 | -1) {
  if (targets.length === 0) {
    return 0
  }

  const nearestIndex = targets.reduce((nearest, target, index) => {
    const nearestDistance = Math.abs(targets[nearest] - currentY)
    const distance = Math.abs(target - currentY)
    return distance < nearestDistance ? index : nearest
  }, 0)
  const isAtTarget = Math.abs(targets[nearestIndex] - currentY) <= SNAP_EPSILON_PX

  if (isAtTarget) {
    return targets[clamp(nearestIndex + direction, 0, targets.length - 1)] ?? targets[0]
  }

  if (direction > 0) {
    return targets.find((target) => target > currentY + SNAP_EPSILON_PX)
      ?? targets[targets.length - 1]
      ?? targets[0]
  }

  for (let index = targets.length - 1; index >= 0; index -= 1) {
    if (targets[index] < currentY - SNAP_EPSILON_PX) {
      return targets[index]
    }
  }

  return targets[0]
}

function isEditableKeyboardTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true'], [contenteditable='']"),
  )
}

function hasBlockingOverlay(target: EventTarget | null) {
  if (target instanceof Element && target.closest('[role="dialog"], [role="menu"], [data-slot="dialog-content"]')) {
    return true
  }

  return Boolean(
    document.querySelector('[data-slot="dialog-content"], [role="dialog"], [role="menu"]'),
  )
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function isLandscapePagingActive() {
  return window.matchMedia(LANDSCAPE_PAGING_QUERY).matches
}

export function useResumeLandscapeSectionPaging(
  stackRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const cancelAnimation = () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }

    const animateScrollTo = (targetY: number) => {
      const maxScrollY = getMaxScrollY()
      const startY = window.scrollY
      const nextY = clamp(targetY, 0, maxScrollY)
      const deltaY = nextY - startY

      cancelAnimation()

      if (prefersReducedMotion() || Math.abs(deltaY) < 1) {
        window.scrollTo(0, nextY)
        return
      }

      const startTime = performance.now()

      const tick = (currentTime: number) => {
        const progress = clamp01((currentTime - startTime) / SCROLL_DURATION_MS)
        window.scrollTo(0, startY + deltaY * easeInOutCubic(progress))

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(tick)
          return
        }

        animationFrameRef.current = null
      }

      animationFrameRef.current = window.requestAnimationFrame(tick)
    }

    const handlePageKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        isEditableKeyboardTarget(event.target) ||
        hasBlockingOverlay(event.target)
      ) {
        return
      }

      const direction =
        event.key === "PageDown" ? 1
        : event.key === "PageUp" ? -1
        : null

      if (direction === null || !isLandscapePagingActive()) {
        return
      }

      const stack = stackRef.current
      const targets = stack ? getSnapTargets(stack) : []

      if (targets.length === 0) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      if (event.repeat && animationFrameRef.current !== null) {
        return
      }

      animateScrollTo(getAdjacentTarget(targets, window.scrollY, direction))
    }

    window.addEventListener("keydown", handlePageKeyDown, { capture: true })
    window.addEventListener("wheel", cancelAnimation, { passive: true })
    window.addEventListener("touchstart", cancelAnimation, { passive: true })
    window.addEventListener("resize", cancelAnimation)

    return () => {
      cancelAnimation()
      window.removeEventListener("keydown", handlePageKeyDown, { capture: true })
      window.removeEventListener("wheel", cancelAnimation)
      window.removeEventListener("touchstart", cancelAnimation)
      window.removeEventListener("resize", cancelAnimation)
    }
  }, [enabled, stackRef])
}

import { type CSSProperties, type RefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { createPortal } from "react-dom"

import { useAnimationPreference } from "@/components/animation-provider"
import { SpotlightCard } from "@/components/SpotlightCard"
import { useResumeEdgeNavigation } from "@/hooks/use-resume-edge-navigation"
import { useResumeNavigationTitlePositions } from "@/hooks/use-resume-navigation-title-positions"
import { navigationGlassSurfaceClassName } from "@/lib/glass-surface-styles"
import { getActiveResumeSectionIndex, getResumeSections } from "@/lib/resume-sections"
import { closeResumeNavigationWave, getResumeNavigationCloseDuration, getResumeNavigationRowSpacing, getResumeNavigationWaveStep, resumeNavigationWaveTiming } from "@/lib/resume-navigation-wave"
import { cn } from "@/lib/utils"
import "./resume-section-navigation.css"

type ResumeSectionNavigationProps = {
  stackRef: RefObject<HTMLElement | null>
  onNavigate: (id: string) => void
}

export function ResumeSectionNavigation({ stackRef, onNavigate }: ResumeSectionNavigationProps) {
  const { t } = useTranslation("resume")
  const { isPlainDisplayMode } = useAnimationPreference()
  const sections = useMemo(() => getResumeSections(isPlainDisplayMode), [isPlainDisplayMode])
  const [activeId, setActiveId] = useState<string>(sections[0].id)
  const [visibleIds, setVisibleIds] = useState<readonly string[]>(() => sections.map((section) => section.id))
  const navRef = useRef<HTMLElement>(null)
  const [overlayHost] = useState(() => document.createElement("div"))
  const titlesRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const leaveTimerRef = useRef<number | null>(null)
  const [wave, setWave] = useState({ open: false, closing: false, originId: "", selectedId: "" })
  const confirmIntent = useResumeEdgeNavigation(navRef, titlesRef, wave.open || wave.closing)
  const visibleSections = sections.filter((section) => visibleIds.includes(section.id))
  const originIndex = visibleSections.findIndex((section) => section.id === wave.originId)
  const selectedIndex = wave.open ? visibleSections.findIndex((section) => section.id === wave.selectedId) : -1
  useResumeNavigationTitlePositions(navRef, titlesRef, backdropRef, visibleIds, selectedIndex)
  const titleCount = visibleSections.length
  const closeDuration = getResumeNavigationCloseDuration(titleCount, originIndex)
  const waveDelay = Math.max(0, closeDuration - resumeNavigationWaveTiming.close)

  useLayoutEffect(() => {
    // Keep overlays in the rail/navbar stacking context, outside rail clipping.
    const container = navRef.current?.closest(".site-content") ?? document.body
    container.appendChild(overlayHost)
    return () => overlayHost.remove()
  }, [overlayHost])

  useEffect(() => {
    if (!wave.closing) return
    let timer: number | null = null
    const frame = window.requestAnimationFrame(() => {
      const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0 : getResumeNavigationCloseDuration(titleCount, originIndex)
      timer = window.setTimeout(() => {
        setWave((previous) => previous.open ? previous : { ...previous, closing: false })
      }, duration)
    })
    return () => {
      window.cancelAnimationFrame(frame)
      if (timer !== null) window.clearTimeout(timer)
    }
  }, [wave.closing, titleCount, originIndex])

  const cancelLeave = () => {
    if (leaveTimerRef.current !== null) window.clearTimeout(leaveTimerRef.current)
    leaveTimerRef.current = null
  }

  const activate = (id: string) => {
    cancelLeave()
    setWave((previous) => previous.open && previous.selectedId === id ? previous : {
      open: true, closing: false, originId: previous.open ? previous.originId : id, selectedId: id,
    })
  }

  const scheduleLeave = () => {
    cancelLeave()
    leaveTimerRef.current = window.setTimeout(() => {
      leaveTimerRef.current = null
      if (navRef.current?.matches(":hover") || titlesRef.current?.matches(":hover")
        || navRef.current?.querySelector(":focus-visible")
        || titlesRef.current?.querySelector(":focus-visible")) return
      setWave(closeResumeNavigationWave)
    }, resumeNavigationWaveTiming.leave)
  }

  useEffect(() => {
    const reset = () => {
      if (leaveTimerRef.current !== null) window.clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
      setWave(closeResumeNavigationWave)
    }
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") reset() }
    window.addEventListener("blur", reset)
    window.addEventListener("resize", reset)
    window.addEventListener("keydown", onKeyDown)
    document.addEventListener("visibilitychange", reset)
    return () => {
      if (leaveTimerRef.current !== null) window.clearTimeout(leaveTimerRef.current)
      window.removeEventListener("blur", reset)
      window.removeEventListener("resize", reset)
      window.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("visibilitychange", reset)
    }
  }, [])

  useEffect(() => {
    const stack = stackRef.current
    if (!stack) return
    let frame: number | null = null
    const update = () => {
      frame = null
      const rendered = sections.flatMap((section) => {
        const element = stack.querySelector<HTMLElement>(`[id="${section.id}"]`)
        return element ? [{ id: section.id, top: element.getBoundingClientRect().top + window.scrollY }] : []
      })
      const ids = rendered.map((section) => section.id)
      setVisibleIds((previous) => previous.length === ids.length && previous.every((id, index) => id === ids[index]) ? previous : ids)
      const tops = rendered.map((section) => section.top)
      const index = getActiveResumeSectionIndex(tops, window.scrollY, window.innerHeight)
      if (index >= 0) setActiveId(rendered[index].id)
    }
    const requestUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(requestUpdate)
    observer.observe(stack)
    sections.forEach((section) => {
      const element = stack.querySelector<HTMLElement>(`[id="${section.id}"]`)
      if (element) observer.observe(element)
    })
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    requestUpdate()
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [sections, stackRef])

  // Scroll only the dot rail on short viewports, never the document itself.
  useEffect(() => {
    const keepActiveVisible = () => {
      const nav = navRef.current
      const button = nav?.querySelector<HTMLElement>('[aria-current="step"]')
      if (!nav || !button || nav.scrollHeight <= nav.clientHeight) return
      const top = button.offsetTop
      if (top < nav.scrollTop) nav.scrollTop = top
      else if (top + button.offsetHeight > nav.scrollTop + nav.clientHeight) {
        nav.scrollTop = top + button.offsetHeight - nav.clientHeight
      }
    }
    keepActiveVisible()
    window.addEventListener("resize", keepActiveVisible)
    return () => window.removeEventListener("resize", keepActiveVisible)
  }, [activeId, visibleIds])

  return (
    <>
      <nav ref={navRef} className="resume-section-nav" aria-label={t("sectionNavigation.label")}
        onPointerEnter={cancelLeave} onPointerLeave={scheduleLeave} onBlur={scheduleLeave}>
        {visibleSections.map((section, index) => {
          const label = t(section.labelKey)
          const spacing = getResumeNavigationRowSpacing(index, selectedIndex, titleCount)
          return (
            <button
              key={section.id}
              type="button"
              className="resume-section-nav-button"
              onClick={() => onNavigate(section.id)}
              aria-label={t("sectionNavigation.item", { n: index + 1, title: label })}
              aria-current={section.id === activeId ? "step" : undefined}
              aria-controls={section.id}
              data-highlighted={wave.open && section.id === wave.selectedId}
              style={{ "--resume-row-before": `${spacing.before}px`, "--resume-row-after": `${spacing.after}px` } as CSSProperties}
              onPointerEnter={(event) => {
                if (event.pointerType !== "mouse" || event.buttons !== 0) return
                confirmIntent({ x: event.clientX, y: event.clientY })
                activate(section.id)
              }}
              onFocus={(event) => {
                if (!event.currentTarget.matches(":focus-visible")) return
                confirmIntent()
                activate(section.id)
              }}
            >
              <SpotlightCard asChild className={cn(navigationGlassSurfaceClassName, "resume-section-nav-circle rounded-full")}>
                <span aria-hidden="true">{index + 1}</span>
              </SpotlightCard>
            </button>
          )
        })}
      </nav>
      {createPortal(
        <>
          <div ref={backdropRef} className="resume-section-nav-backdrop" aria-hidden="true"
            data-active={wave.open}
            style={{
              "--resume-nav-backdrop-open-duration": `${waveDelay + resumeNavigationWaveTiming.open}ms`,
              "--resume-nav-backdrop-close-duration": `${closeDuration}ms`,
            } as CSSProperties} />
          <div ref={titlesRef} className="resume-section-nav-titles" data-open={wave.open}
            style={{
              "--resume-wave-open-duration": `${resumeNavigationWaveTiming.open}ms`,
              "--resume-wave-close-duration": `${resumeNavigationWaveTiming.close}ms`,
            } as CSSProperties}
            aria-hidden={!wave.open} onPointerEnter={cancelLeave} onPointerLeave={scheduleLeave} onBlur={scheduleLeave}>
            {visibleSections.map((section, index) => (
              <button key={section.id} type="button" className="resume-section-nav-title" data-section-id={section.id}
                tabIndex={-1} disabled={!wave.open}
                onClick={() => onNavigate(section.id)}
                aria-label={t("sectionNavigation.item", { n: index + 1, title: t(section.labelKey) })}
                aria-controls={section.id}
                aria-current={section.id === activeId ? "step" : undefined}
                data-highlighted={wave.open && section.id === wave.selectedId}
                data-current={section.id === activeId}
                style={{ "--resume-wave-delay": `${getResumeNavigationWaveStep(index, Math.max(0, originIndex)) * resumeNavigationWaveTiming.step}ms` } as CSSProperties}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse" && event.buttons === 0) activate(section.id)
                }}
                onFocus={(event) => {
                  if (!event.currentTarget.matches(":focus-visible")) return
                  confirmIntent()
                  activate(section.id)
                }}>
                <span className="resume-section-nav-title-measure" aria-hidden="true">{t(section.labelKey)}</span>
                <span className="resume-section-nav-title-text">{t(section.labelKey)}</span>
              </button>
            ))}
          </div>
        </>, overlayHost,
      )}
    </>
  )
}

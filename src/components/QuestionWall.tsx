import { type CSSProperties, useEffect, useRef, useState, useSyncExternalStore } from "react"
import { ArrowRight, Pause, Play } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ArchiveSectionHeader } from "@/components/SectionHeader"
import { AppLink } from "@/components/AppLink"
import { QuestionList } from "@/components/QuestionList"
import { QuestionText } from "@/components/QuestionText"
import { QuestionWallLayer } from "@/components/QuestionWallLayer"
import { Button } from "@/components/ui/button"
import { useAnimationPreference } from "@/components/animation-provider"
import { questionThreads } from "@/data/questions"
import { useQuestionCopy } from "@/hooks/use-question-copy"
import { useQuestionDialog } from "@/hooks/use-question-dialog"
import { advanceWall, createWall, resizeWall } from "@/lib/question-wall"
import { fitQuestionText } from "@/lib/question-text-layout"
import { QUESTION_WALL_MOTION } from "@/lib/question-wall-motion"
import { shuffleQuestions } from "@/lib/questions"
import { ghostPillActionClassName } from "@/lib/action-button-styles"

const ids = questionThreads.map((thread) => thread.id)
const threadMap = new Map(questionThreads.map((thread) => [thread.id, thread]))
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)")
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}
function getReducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches }
function subscribeMobile(callback: () => void) {
  const media = window.matchMedia("(max-width: 767px)")
  media.addEventListener("change", callback)
  return () => media.removeEventListener("change", callback)
}
function getMobile() { return window.matchMedia("(max-width: 767px)").matches }
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback)
  return () => document.removeEventListener("visibilitychange", callback)
}
function getPageVisibility() { return !document.hidden }

function AnimatedQuestionWall() {
  const { t } = useTranslation("questions")
  const { selectedId, openQuestion } = useQuestionDialog()
  const copy = useQuestionCopy()
  const ref = useRef<HTMLDivElement>(null)
  const measurements = useRef(new Map<string, HTMLDivElement>())
  const [ready, setReady] = useState(false)
  const [wall, setWall] = useState(() => createWall(ids, 960, 440, Math.floor(Math.random() * 0xffffffff)))
  const [inView, setInView] = useState(false)
  const [paused, setPaused] = useState<boolean | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const [landedId, setLandedId] = useState<string | null>(null)
  const isMobile = useSyncExternalStore(subscribeMobile, getMobile, () => false)
  const reduced = useSyncExternalStore(subscribeMotion, getReducedMotion, () => true)
  const motionEnabled = !reduced
  const visible = useSyncExternalStore(subscribeVisibility, getPageVisibility, () => false)
  const userPaused = paused ?? reduced
  const running = ready && !userPaused && !hovered && !focused && !selectedId && inView && visible

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let frame = 0
    let disposed = false
    let lastWidth = 0
    let lastHeight = 0
    const measure = (force = false) => {
      if (disposed) return
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const width = element.clientWidth
        const height = element.clientHeight
        if (!width || !height || (!force && width === lastWidth && height === lastHeight)) return
        lastWidth = width
        lastHeight = height
        const layouts = Object.fromEntries(ids.map((id) => {
          const sample = measurements.current.get(id)!
          const style = window.getComputedStyle(sample)
          const metrics = {
            paddingInline: parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
            paddingBlock: parseFloat(style.paddingTop) + parseFloat(style.paddingBottom),
            lineHeight: parseFloat(style.lineHeight) / parseFloat(style.fontSize),
          }
          return [id, fitQuestionText(width, height, (fontSize, textWidth) => {
            sample.style.fontSize = `${fontSize}px`
            sample.style.width = textWidth === undefined ? "max-content" : `${textWidth}px`
            const bounds = sample.getBoundingClientRect()
            return { width: bounds.width, height: bounds.height }
          }, metrics)]
        }))
        // On exceptionally short screens the wall can scroll internally instead of clipping a question.
        const canvasHeight = Math.max(height, ...Object.values(layouts).map((layout) => layout.height + 16))
        setWall((current) => resizeWall(current, width, canvasHeight, layouts))
        setReady(true)
      })
    }
    const size = new ResizeObserver(() => measure())
    const visibility = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 })
    size.observe(element)
    visibility.observe(element)
    const fontsChanged = () => measure(true)
    void document.fonts.ready.then(fontsChanged)
    document.fonts.addEventListener("loadingdone", fontsChanged)
    measure(true)
    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      size.disconnect()
      visibility.disconnect()
      document.fonts.removeEventListener("loadingdone", fontsChanged)
    }
  }, [copy])

  useEffect(() => {
    if (!running) return
    // Count reading time from the actual landing animation's completion.
    if (motionEnabled && wall.incomingId && landedId !== wall.incomingId) return
    const timer = window.setTimeout(() => setWall(advanceWall), isMobile ? 1000 : 2000)
    return () => window.clearTimeout(timer)
  }, [running, isMobile, motionEnabled, wall.incomingId, landedId])

  useEffect(() => {
    const retiring = wall.retiring
    if (!retiring) return
    const timer = window.setTimeout(() => {
      setWall((current) => current.retiring === retiring ? { ...current, retiring: undefined } : current)
    }, motionEnabled ? QUESTION_WALL_MOTION.durationMs : 0)
    return () => window.clearTimeout(timer)
  }, [wall.retiring, motionEnabled])

  const layers = wall.retiring ? [wall.retiring, ...wall.cards] : wall.cards

  return <>
    <div className="question-wall-stage" ref={ref} data-motion={motionEnabled ? "full" : "static"}
      style={{
        "--question-wall-duration": `${QUESTION_WALL_MOTION.durationMs}ms`,
        "--question-wall-easing": QUESTION_WALL_MOTION.easing,
        "--question-wall-entry-scale": QUESTION_WALL_MOTION.entryScale,
        "--question-wall-entry-lift": `${-QUESTION_WALL_MOTION.entryLiftPx}px`,
      } as CSSProperties}
      onPointerLeave={() => setHovered(null)}>
      <div className="question-wall-measurements" aria-hidden="true" inert>
        {questionThreads.map((thread) => {
          const content = copy(thread)
          return <div key={thread.id} className="question-wall-text question-bubble question-bubble-question" ref={(node) => {
            if (node) measurements.current.set(thread.id, node)
            else measurements.current.delete(thread.id)
          }}>
            <span className="question-wall-title" lang={content.lang}><QuestionText text={content.rounds[thread.rounds[0]].question} /></span>
          </div>
        })}
      </div>
      <div className="question-wall-canvas" style={{ height: wall.height, visibility: ready ? "visible" : "hidden" }}>
      {layers.map((card, index) => {
        const thread = threadMap.get(card.id)!
        const content = copy(thread)
        const isInteracting = focused === card.id || hovered === card.id
        const retiring = wall.retiring === card
        const age = layers.length - index - 1
        return <QuestionWallLayer key={card.id} card={card} width={wall.width} height={wall.height}
          age={age} count={wall.cards.length} motionEnabled={motionEnabled}
          retiring={retiring} interacting={isInteracting} zIndex={index + 1}>
          <button type="button" className="question-wall-text question-bubble question-bubble-question" data-entering={wall.incomingId === card.id || undefined}
          tabIndex={retiring ? -1 : undefined}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && event.animationName === "question-land") setLandedId(card.id)
          }}
          onPointerEnter={(event) => { if (event.pointerType !== "touch") setHovered(card.id) }}
          onPointerLeave={() => setHovered(null)}
          onFocus={() => setFocused(card.id)} onBlur={() => setFocused(null)}
          onClick={(event) => openQuestion(thread.id, event.currentTarget)}>
          <span className="question-wall-title" lang={content.lang}><QuestionText text={content.rounds[thread.rounds[0]].question} /></span>
          </button>
        </QuestionWallLayer>
      })}
      </div>
    </div>
    <div className="section-note question-wall-toolbar">
      <Button type="button" variant="ghost" className={ghostPillActionClassName} onClick={() => setPaused(!userPaused)} aria-pressed={userPaused}>
        {userPaused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
        {t(userPaused ? "resume" : "pause")}
      </Button>
    </div>
  </>
}

export function QuestionWall() {
  const { t } = useTranslation("questions")
  const { isPlainDisplayMode } = useAnimationPreference()
  const [plainThreads] = useState(() => shuffleQuestions(questionThreads).slice(0, 8))
  if (!questionThreads.length) return null
  if (isPlainDisplayMode) return <section id="questions" className="question-plain-section">
    <h2><AppLink to="/questions">{t("title")}</AppLink></h2>
    <p>{t("subtitle")}</p>
    <QuestionList threads={plainThreads} showProjects={false} variant="document" headingLevel={3} masonry />
    <AppLink className="question-view-all" to="/questions">{t("viewAll", { count: questionThreads.length })}<ArrowRight size={16} aria-hidden="true" /></AppLink>
  </section>
  return <section id="questions" className="resume-rhythm-section question-wall-section">
    <ArchiveSectionHeader detailPath="/questions" title={t("title")} subtitle={t("subtitle")}
      viewAllLabel={t("viewAll", { count: questionThreads.length })} />
    <AnimatedQuestionWall />
  </section>
}

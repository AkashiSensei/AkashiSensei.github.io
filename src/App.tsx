import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { useAnimationPreference } from "@/components/animation-provider"
import { Layout } from "@/components/Layout"
import LightRays from "@/components/LightRays.jsx"
import { Button } from "@/components/ui/button"
import { HomePage } from "@/pages/HomePage"
import { CourseProjectsPage } from "@/pages/CourseProjectsPage"
import { KnowledgeDetailPage } from "@/pages/KnowledgeDetailPage"
import { KnowledgePage } from "@/pages/KnowledgePage"
import { ProjectDetailPage } from "@/pages/ProjectDetailPage"
import { ProjectsPage } from "@/pages/ProjectsPage"
import { ReceiptPreviewPage } from "@/pages/ReceiptPreviewPage"
import { ResumePage } from "@/pages/ResumePage"
import { SmallToolDetailPage } from "@/pages/SmallToolDetailPage"
import { ToolsPage } from "@/pages/ToolsPage"
import { WorkbenchPage } from "@/pages/WorkbenchPage"
import { courseProjects } from "@/data/course-projects"
import { knowledgeEntries } from "@/data/knowledge"
import { projects } from "@/data/projects"
import { smallTools } from "@/data/tools"

const pageTitles: Record<string, string> = {
  "/": "Akashi - Homepage",
  "/resume": "Akashi - Resume",
  "/projects": "Akashi - Projects",
  "/course-projects": "Akashi - Course Projects",
  "/workbench": "Akashi - Workspace",
  "/tools": "Akashi - Tools",
  "/knowledge": "Akashi - Knowledge",
  "/receipt-preview": "Akashi - Receipt Preview",
}

const LiquidEther = lazy(() => import("@/components/LiquidEther.jsx"))
const LIQUID_ETHER_DARK_COLORS = ["#7b1024", "#5227FF", "#063d66"]
const LIQUID_ETHER_LIGHT_COLORS = ["#dc565d", "#df7186", "#c8577a"]
const LIGHT_RAYS_DARK_COLOR = "#ffffff"
const LIGHT_RAYS_LIGHT_COLOR = "#17191d"
const LIGHT_RAYS_PARALLAX_SPEED = 0.15

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value))
}

function interpolate(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function smoothstep(progress: number) {
  return progress * progress * (3 - 2 * progress)
}

function interpolateRgb(
  start: [number, number, number],
  end: [number, number, number],
  progress: number,
) {
  return start.map((channel, index) =>
    Math.round(interpolate(channel, end[index], progress)),
  ) as [number, number, number]
}

function getLiquidColorProgress(pathname: string, scrollY: number, viewportHeight: number) {
  const projectsElement =
    pathname === "/resume" ? document.getElementById("projects") : null
  const progressStart =
    projectsElement ?
      scrollY + projectsElement.getBoundingClientRect().top
    : 0
  const transitionDistance = Math.max(viewportHeight * 4.5, 1)

  return clamp01((scrollY - progressStart) / transitionDistance)
}

function getLightRaysTransitionProgress(
  pathname: string,
  scrollY: number,
  viewportHeight: number,
) {
  const projectsElement =
    pathname === "/resume" ? document.getElementById("projects") : null
  const transitionEnd =
    projectsElement ?
      scrollY + projectsElement.getBoundingClientRect().top
    : viewportHeight

  return smoothstep(clamp01(scrollY / Math.max(transitionEnd, 1)))
}

function getLiquidEtherTransitionProgress(
  pathname: string,
  scrollY: number,
  viewportHeight: number,
) {
  const projectsElement =
    pathname === "/resume" ? document.getElementById("projects") : null
  const transitionStart = viewportHeight * 0.5
  const transitionEnd =
    projectsElement ?
      scrollY + projectsElement.getBoundingClientRect().top + viewportHeight * 0.5
    : viewportHeight
  const fadeEnd = Math.max(transitionEnd, transitionStart + 1)
  const linearProgress =
    fadeEnd <= transitionStart ?
      1
    : clamp01((scrollY - transitionStart) / (fadeEnd - transitionStart))

  return smoothstep(linearProgress)
}

function isCurrentThemeDark() {
  return (
    typeof document !== "undefined"
    && document.documentElement.classList.contains("dark")
  )
}

function useIsDarkTheme() {
  const [isDarkTheme, setIsDarkTheme] = useState(isCurrentThemeDark)

  useEffect(() => {
    const rootElement = document.documentElement
    const updateTheme = () => {
      setIsDarkTheme(rootElement.classList.contains("dark"))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(rootElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return isDarkTheme
}

function applyLiquidColorState(
  element: HTMLDivElement,
  pathname: string,
  scrollY: number,
  viewportHeight: number,
  isDarkTheme: boolean,
) {
  const progress = getLiquidColorProgress(pathname, scrollY, viewportHeight)

  if (!isDarkTheme) {
    const [red, green, blue] =
      progress < 0.5 ?
        interpolateRgb([252, 250, 248], [249, 247, 253], progress * 2)
      : interpolateRgb([249, 247, 253], [244, 249, 253], (progress - 0.5) * 2)
    const brightness =
      progress < 0.5 ?
        interpolate(1.22, 1.18, progress * 2)
      : interpolate(1.18, 1.14, (progress - 0.5) * 2)
    const saturation =
      progress < 0.5 ?
        interpolate(1.22, 1.18, progress * 2)
      : interpolate(1.18, 1.24, (progress - 0.5) * 2)
    const hueShift =
      progress < 0.5 ?
        interpolate(0, -48, progress * 2)
      : interpolate(-48, -104, (progress - 0.5) * 2)
    const patternOpacity =
      progress < 0.5 ?
        interpolate(0.18, 0.22, progress * 2)
      : interpolate(0.22, 0.28, (progress - 0.5) * 2)

    element.style.setProperty("--liquid-bg-color", `rgb(${red} ${green} ${blue})`)
    element.style.setProperty("--liquid-hue-shift", `${hueShift.toFixed(2)}deg`)
    element.style.setProperty("--liquid-brightness", brightness.toFixed(3))
    element.style.setProperty("--liquid-saturation", saturation.toFixed(3))
    element.style.setProperty("--liquid-pattern-opacity", patternOpacity.toFixed(3))
    return
  }

  const hueShift =
    progress < 0.5 ?
      interpolate(58, 0, progress * 2)
    : interpolate(0, -34, (progress - 0.5) * 2)
  const brightness =
    progress < 0.5 ?
      interpolate(0.76, 1, progress * 2)
    : interpolate(1, 0.58, (progress - 0.5) * 2)
  const saturation =
    progress < 0.5 ?
      interpolate(1.32, 1.08, progress * 2)
    : interpolate(1.08, 1.22, (progress - 0.5) * 2)
  const red = Math.round(interpolate(3, 0, progress))
  const green = Math.round(interpolate(2, 10, progress))
  const blue = Math.round(interpolate(7, 24, progress))

  element.style.setProperty("--liquid-bg-color", `rgb(${red} ${green} ${blue})`)
  element.style.setProperty("--liquid-hue-shift", `${hueShift.toFixed(2)}deg`)
  element.style.setProperty("--liquid-brightness", brightness.toFixed(3))
  element.style.setProperty("--liquid-saturation", saturation.toFixed(3))
  element.style.setProperty("--liquid-pattern-opacity", "1")
}

function RouteEffects() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (pathname.startsWith("/projects/")) {
      document.title = "Akashi - Project Detail"
      return
    }

    if (pathname.startsWith("/course-projects/")) {
      document.title = "Akashi - Course Project Detail"
      return
    }

    if (pathname.startsWith("/tools/")) {
      document.title = "Akashi - Tool Detail"
      return
    }

    if (pathname.startsWith("/knowledge/")) {
      document.title = "Akashi - Knowledge Detail"
      return
    }

    document.title = pageTitles[pathname] ?? "Akashi - Not Found"
  }, [pathname])

  return null
}

function NotFoundPage() {
  const { t } = useTranslation("common")
  const { isPlainDisplayMode } = useAnimationPreference()

  if (isPlainDisplayMode) {
    return (
      <Layout mainClassName="plain-home-main">
        <article className="plain-home-document plain-detail-document" aria-labelledby="plain-not-found-title">
          <header className="plain-home-header plain-detail-header">
            <p className="plain-home-kicker">404</p>
            <h1 id="plain-not-found-title">{t("notFound.title")}</h1>
            <p className="plain-home-lede">{t("notFound.description")}</p>
            <div className="plain-home-actions">
              <AppLink to="/">{t("notFound.homeCta")}</AppLink>
            </div>
          </header>
        </article>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="flex min-h-[calc(100svh-11rem)] max-w-xl flex-col justify-center gap-5 py-12">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/45">
          404
        </p>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("notFound.title")}
          </h1>
          <p className="text-base leading-relaxed text-foreground/70 sm:text-lg">
            {t("notFound.description")}
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="mt-2 w-fit rounded-full border-white/40 bg-white/40 px-5 backdrop-blur-md transition-colors hover:bg-white/60 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <AppLink to="/">{t("notFound.homeCta")}</AppLink>
        </Button>
      </section>
    </Layout>
  )
}

function LightRaysBackground({
  pathname,
  isDarkTheme,
  isAnimationEnabled,
}: {
  pathname: string
  isDarkTheme: boolean
  isAnimationEnabled: boolean
}) {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const shouldRenderRef = useRef(true)
  const [shouldRenderLightRays, setShouldRenderLightRays] = useState(true)

  useLayoutEffect(() => {
    let animationFrame: number | null = null

    const updateBackgroundOffset = () => {
      animationFrame = null

      const backgroundElement = backgroundRef.current

      if (!backgroundElement) {
        return
      }

      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight || 1
      const opacity =
        1 - getLightRaysTransitionProgress(pathname, scrollY, viewportHeight)

      backgroundElement.style.transform = `translate3d(0, ${scrollY * -LIGHT_RAYS_PARALLAX_SPEED}px, 0)`
      backgroundElement.style.opacity = String(opacity)

      const nextShouldRenderLightRays = opacity > 0
      if (shouldRenderRef.current !== nextShouldRenderLightRays) {
        shouldRenderRef.current = nextShouldRenderLightRays
        setShouldRenderLightRays(nextShouldRenderLightRays)
      }
    }

    const requestBackgroundOffset = () => {
      if (animationFrame !== null) {
        return
      }

      animationFrame = window.requestAnimationFrame(updateBackgroundOffset)
    }

    updateBackgroundOffset()
    window.addEventListener("scroll", requestBackgroundOffset, { passive: true })
    window.addEventListener("resize", requestBackgroundOffset)

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
      }

      window.removeEventListener("scroll", requestBackgroundOffset)
      window.removeEventListener("resize", requestBackgroundOffset)
    }
  }, [pathname])

  return (
    <div ref={backgroundRef} className="site-background" aria-hidden="true">
      {shouldRenderLightRays ? (
        <LightRays
          raysOrigin="top-center"
          raysColor={isDarkTheme ? LIGHT_RAYS_DARK_COLOR : LIGHT_RAYS_LIGHT_COLOR}
          raysSpeed={1}
          lightSpread={isDarkTheme ? 0.5 : 0.4}
          rayLength={isDarkTheme ? 3 : 2.38}
          fadeDistance={isDarkTheme ? 1 : 0.76}
          saturation={isDarkTheme ? 1 : 0.6}
          followMouse={isAnimationEnabled}
          mouseInfluence={isDarkTheme ? 0.1 : 0.06}
          noiseAmount={0}
          distortion={0}
          staticMode={!isAnimationEnabled}
          className={
            isDarkTheme ?
              "site-light-rays site-light-rays-dark"
            : "site-light-rays site-light-rays-light"
          }
        />
      ) : null}
    </div>
  )
}

function LiquidEtherBackground({
  pathname,
  isDarkTheme,
  isAnimationEnabled,
}: {
  pathname: string
  isDarkTheme: boolean
  isAnimationEnabled: boolean
}) {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const shouldRenderRef = useRef(pathname !== "/resume")
  const [shouldRenderLiquidEther, setShouldRenderLiquidEther] = useState(
    pathname !== "/resume",
  )
  const liquidColors =
    isDarkTheme ? LIQUID_ETHER_DARK_COLORS : LIQUID_ETHER_LIGHT_COLORS

  useLayoutEffect(() => {
    let animationFrame: number | null = null

    const updateBackgroundOpacity = () => {
      animationFrame = null

      const backgroundElement = backgroundRef.current

      if (!backgroundElement) {
        return
      }

      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight || 1
      let opacity = 1

      if (pathname === "/resume") {
        opacity = getLiquidEtherTransitionProgress(pathname, scrollY, viewportHeight)
      }

      backgroundElement.style.opacity = String(opacity)
      applyLiquidColorState(
        backgroundElement,
        pathname,
        scrollY,
        viewportHeight,
        isDarkTheme,
      )

      const nextShouldRenderLiquidEther = opacity > 0
      if (shouldRenderRef.current !== nextShouldRenderLiquidEther) {
        shouldRenderRef.current = nextShouldRenderLiquidEther
        setShouldRenderLiquidEther(nextShouldRenderLiquidEther)
      }
    }

    const requestBackgroundOpacity = () => {
      if (animationFrame !== null) {
        return
      }

      animationFrame = window.requestAnimationFrame(updateBackgroundOpacity)
    }

    updateBackgroundOpacity()
    window.addEventListener("scroll", requestBackgroundOpacity, { passive: true })
    window.addEventListener("resize", requestBackgroundOpacity)

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
      }

      window.removeEventListener("scroll", requestBackgroundOpacity)
      window.removeEventListener("resize", requestBackgroundOpacity)
    }
  }, [isDarkTheme, pathname])

  return (
    <div ref={backgroundRef} className="site-liquid-background" aria-hidden="true">
      {shouldRenderLiquidEther ? (
        <Suspense fallback={null}>
          <LiquidEther
            key={isDarkTheme ? "dark-liquid-ether" : "light-liquid-ether"}
            colors={liquidColors}
            mouseForce={20}
            cursorSize={100}
            isViscous
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={500}
            autoRampDuration={0.6}
            staticMode={!isAnimationEnabled}
            className="site-liquid-ether"
          />
        </Suspense>
      ) : null}
    </div>
  )
}

function shouldUseLiquidEtherForPath(pathname: string) {
  return pathname === "/resume"
}

function App() {
  const { pathname } = useLocation()
  const isDarkTheme = useIsDarkTheme()
  const { isAnimationEnabled, isPlainDisplayMode } = useAnimationPreference()
  const shouldUsePlainRoute = isPlainDisplayMode && pathname !== "/receipt-preview"
  const shouldUseLiquidEtherRoute = shouldUseLiquidEtherForPath(pathname) && !shouldUsePlainRoute

  return (
    <>
      <RouteEffects />
      {!shouldUsePlainRoute ? (
        <LightRaysBackground
          pathname={pathname}
          isDarkTheme={isDarkTheme}
          isAnimationEnabled={isAnimationEnabled}
        />
      ) : null}
      {shouldUseLiquidEtherRoute ? (
        <LiquidEtherBackground
          key={pathname}
          pathname={pathname}
          isDarkTheme={isDarkTheme}
          isAnimationEnabled={isAnimationEnabled}
        />
      ) : null}
      <div className="site-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/receipt-preview" element={<ReceiptPreviewPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route
            path="/projects/:projectId"
            element={<ProjectDetailPage projects={projects} />}
          />
          <Route path="/course-projects" element={<CourseProjectsPage />} />
          <Route
            path="/course-projects/:projectId"
            element={
              <ProjectDetailPage
                projects={courseProjects}
                translationNamespace="courseProjects"
                fallbackPath="/course-projects"
              />
            }
          />
          <Route path="/workbench" element={<WorkbenchPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route
            path="/knowledge/:entryId"
            element={<KnowledgeDetailPage entries={knowledgeEntries} />}
          />
          <Route
            path="/tools/:toolId"
            element={<SmallToolDetailPage tools={smallTools} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App

import { ArrowRight, ArrowUpRight } from "lucide-react"
import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { AppLink } from "@/components/AppLink"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { ImageBrightnessOverlay } from "@/components/ImageBrightnessOverlay"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { projects, type Project } from "@/data/projects"
import { type ImageBrightness } from "@/lib/image-brightness"
import { getSemanticTagClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

type ProjectCoverImage = {
  src: string
  altKey: string
  brightness?: ImageBrightness
}

type ProjectTranslationNamespace = "projects" | "courseProjects"

const COVER_CAROUSEL_INTERVAL_MS = 6800
const COVER_CAROUSEL_STAGGER_MS = 1300
const PROJECT_HIGHLIGHT_ROTATION_INTERVAL_MS = 6000
const PROJECT_HIGHLIGHT_IDS = [
  "crater",
  "npu-computing-forecast",
  "model-requirements-evaluator",
]

export function ArchiveSectionHeader({
  detailPath,
  subtitle,
  title,
  viewAllLabel,
}: {
  detailPath: string
  subtitle: string
  title: string
  viewAllLabel: string
}) {
  return (
    <div className="flex flex-col gap-4 px-2 sm:px-3 md:flex-row md:items-end md:justify-between md:gap-8 md:px-4">
      <div className="flex max-w-3xl flex-col gap-2">
        <h2 className="text-3xl font-normal leading-none tracking-tight text-tone-1 md:text-4xl">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-tone-4 sm:text-base">
          {subtitle}
        </p>
      </div>

      <AppLink
        to={detailPath}
        className="group inline-flex w-fit shrink-0 items-center gap-1.5 text-[0.9375rem] font-normal leading-none text-tone-2 transition-colors hover:text-tone-1 sm:text-[1.0625rem] md:-translate-y-2"
      >
        <span>{viewAllLabel}</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-[1.125rem] sm:w-[1.125rem]" />
      </AppLink>
    </div>
  )
}

export function ProjectHighlights() {
  const { t } = useTranslation(["projects", "common"])
  const showcasedProjects = PROJECT_HIGHLIGHT_IDS.map((projectId) =>
    projects.find((project) => project.id === projectId),
  ).filter((project): project is Project => Boolean(project))
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)

  if (showcasedProjects.length === 0) {
    return null
  }

  const boundedActiveProjectIndex = Math.min(
    activeProjectIndex,
    showcasedProjects.length - 1,
  )

  return (
    <section id="projects" className="resume-rhythm-section project-highlights-section flex w-full min-w-0 flex-col justify-center gap-5 overflow-x-clip">
      <ArchiveSectionHeader
        detailPath="/projects"
        title={t("title")}
        subtitle={t("subtitle")}
        viewAllLabel={t("viewAll")}
      />

      <div className="flex flex-col gap-10 lg:gap-12">
        <ProjectFeatureRow
          activeProjectIndex={boundedActiveProjectIndex}
          onActiveProjectIndexChange={setActiveProjectIndex}
          projects={showcasedProjects}
        />
      </div>
    </section>
  )
}

function getPoints(value: unknown) {
  return Array.isArray(value)
    ? value.filter((point): point is string => typeof point === "string")
    : []
}

function ProjectCoverCarousel({
  hoverBlur = true,
  images,
  staggerIndex,
}: {
  hoverBlur?: boolean
  images: ProjectCoverImage[]
  staggerIndex: number
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) {
      return
    }

    let intervalId: ReturnType<typeof setInterval> | undefined
    const timeoutId = setTimeout(
      () => {
        setActiveIndex((current) => (current + 1) % images.length)
        intervalId = setInterval(() => {
          setActiveIndex((current) => (current + 1) % images.length)
        }, COVER_CAROUSEL_INTERVAL_MS)
      },
      COVER_CAROUSEL_INTERVAL_MS + staggerIndex * COVER_CAROUSEL_STAGGER_MS,
    )

    return () => {
      clearTimeout(timeoutId)
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [images.length, staggerIndex])

  return (
    <div className="absolute inset-0 h-full w-full" aria-hidden="true">
      {images.map((image, index) => (
        <div
          key={image.src}
          className={cn(
            "absolute inset-0 h-full w-full overflow-hidden transition-[opacity,filter] duration-700 ease-out",
            hoverBlur && "group-hover:blur-[6px]",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
        >
          <img
            src={image.src}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            className="h-full w-full object-cover"
          />
          <ImageBrightnessOverlay brightness={image.brightness} />
        </div>
      ))}
    </div>
  )
}

function getProjectDetailPath(
  project: Project,
  translationNamespace: ProjectTranslationNamespace,
) {
  return translationNamespace === "courseProjects"
    ? `/course-projects/${project.id}`
    : `/projects/${project.id}`
}

function getProjectRepoLinks(project: Project) {
  return (
    project.links ??
    (project.repoName || project.githubRepo
      ? [
          {
            label: project.repoName ?? project.githubRepo ?? "",
            githubRepo: project.githubRepo,
            repoTags: project.repoTags,
            url: project.externalUrl,
          },
        ]
      : [])
  )
}

function ProjectRepoLinks({
  project,
  textClassName,
  translationNamespace,
}: {
  project: Project
  textClassName: string
  translationNamespace: ProjectTranslationNamespace
}) {
  const { t } = useTranslation([translationNamespace, "common"])
  const repoLinks = getProjectRepoLinks(project)

  if (repoLinks.length === 0) {
    return null
  }

  return (
    <div className={cn("flex flex-col items-start gap-1.5", textClassName)}>
      {repoLinks.map((link) => {
        const content = (
          <>
            {link.repoTags?.map((repoTag) => (
              <span
                key={repoTag}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.6875rem] leading-none shadow-sm backdrop-blur-sm",
                  getSemanticTagClassName(repoTag),
                  "bg-[rgb(var(--site-surface-rgb)_/_0.86)] dark:bg-white/12",
                )}
              >
                {t(`repoTags.${repoTag}`)}
              </span>
            ))}
            <span className="min-w-0 max-w-[8rem] truncate sm:max-w-[10rem] md:max-w-[14rem] xl:max-w-[18rem]">
              {link.label}
            </span>
            {link.url ? (
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
            ) : null}
            <GitHubRepoStats repo={link.githubRepo} />
          </>
        )

        return link.url ? (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${t("repoLabel")}: ${link.label}`}
            className="inline-flex min-w-0 max-w-full items-center gap-1.5 transition-colors hover:text-tone-1"
          >
            {content}
          </a>
        ) : (
          <span
            key={link.label}
            className="inline-flex min-w-0 max-w-full items-center gap-1.5"
          >
            {content}
          </span>
        )
      })}
    </div>
  )
}

function ProjectTagList({
  project,
  translationNamespace,
}: {
  project: Project
  translationNamespace: ProjectTranslationNamespace
}) {
  const { t } = useTranslation([translationNamespace, "common"])

  return (
    <div className="flex flex-wrap gap-1.5">
      {project.tags.slice(0, 8).map((tag, tagIndex) => {
        const isCourseProjectTimeTag =
          translationNamespace === "courseProjects" && tagIndex < 2
        const tagLabel = isCourseProjectTimeTag
          ? t(`semesterTags.${tag}`, { defaultValue: tag })
          : tag

        return (
          <span
            key={tag}
            className="rounded-full border border-foreground/12 bg-[rgb(var(--site-surface-rgb)_/_0.30)] px-2.5 py-1 text-[0.6875rem] font-normal leading-none text-tone-3 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05]"
          >
            {tagLabel}
          </span>
        )
      })}
    </div>
  )
}

function ProjectFeatureRow({
  activeProjectIndex,
  onActiveProjectIndexChange,
  projects,
}: {
  activeProjectIndex: number
  onActiveProjectIndexChange: (projectIndex: number) => void
  projects: Project[]
}) {
  const { i18n, t } = useTranslation(["projects", "common"])
  const projectGalleryRef = useRef<HTMLDivElement>(null)
  const getProjectViewportMode = () => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isStackedDesktop: false,
        isNarrowSplitDesktop: false,
      }
    }

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth

    return {
      isMobile: viewportWidth < 768,
      isStackedDesktop: viewportWidth >= 768 && viewportWidth < 1200,
      isNarrowSplitDesktop: viewportWidth >= 1200 && viewportWidth < 1500,
    }
  }
  const [projectViewportMode, setProjectViewportMode] = useState(
    getProjectViewportMode,
  )
  const project = projects[activeProjectIndex] ?? projects[0]
  const points = getPoints(t(`items.${project.id}.points`, { returnObjects: true }))
  const isEnglish = (i18n.resolvedLanguage ?? i18n.language).startsWith("en")
  const visiblePointCount = projectViewportMode.isMobile || projectViewportMode.isStackedDesktop
    ? 3
    : isEnglish || projectViewportMode.isNarrowSplitDesktop
      ? 1
      : 3
  const visiblePoints = points.slice(0, visiblePointCount)
  const title = t(`items.${project.id}.title`)
  const detailPath = getProjectDetailPath(project, "projects")

  const scrollProjectGalleryToIndex = useCallback((projectIndex: number) => {
    const gallery = projectGalleryRef.current
    const cardElement = gallery?.children.item(projectIndex)

    if (!(gallery && cardElement instanceof HTMLElement)) {
      return
    }

    const targetLeft =
      cardElement.offsetLeft - (gallery.clientWidth - cardElement.offsetWidth) / 2

    gallery.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    })
    onActiveProjectIndexChange(projectIndex)
  }, [onActiveProjectIndexChange])

  const handleProjectGalleryScroll = () => {
    const gallery = projectGalleryRef.current

    if (!gallery || gallery.clientWidth === 0) {
      return
    }

    const cardElements = Array.from(gallery.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    )
    const viewportCenter = gallery.scrollLeft + gallery.clientWidth / 2
    const nextIndex = cardElements.reduce((closestIndex, cardElement, index) => {
      const closestElement = cardElements[closestIndex]
      const cardCenter = cardElement.offsetLeft + cardElement.offsetWidth / 2
      const closestCardCenter =
        closestElement.offsetLeft + closestElement.offsetWidth / 2

      return Math.abs(cardCenter - viewportCenter) <
        Math.abs(closestCardCenter - viewportCenter)
        ? index
        : closestIndex
    }, 0)

    if (
      nextIndex < 0 ||
      nextIndex >= projects.length ||
      nextIndex === activeProjectIndex
    ) {
      return
    }

    onActiveProjectIndexChange(nextIndex)
  }

  useEffect(() => {
    const updateProjectViewportMode = () => {
      const nextMode = getProjectViewportMode()

      setProjectViewportMode((currentMode) =>
        currentMode.isMobile === nextMode.isMobile &&
        currentMode.isStackedDesktop === nextMode.isStackedDesktop &&
        currentMode.isNarrowSplitDesktop === nextMode.isNarrowSplitDesktop
          ? currentMode
          : nextMode,
      )
    }

    updateProjectViewportMode()
    window.addEventListener("resize", updateProjectViewportMode)
    window.visualViewport?.addEventListener("resize", updateProjectViewportMode)

    return () => {
      window.removeEventListener("resize", updateProjectViewportMode)
      window.visualViewport?.removeEventListener("resize", updateProjectViewportMode)
    }
  }, [])

  useEffect(() => {
    if (projects.length < 2) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      const nextIndex = (activeProjectIndex + 1) % projects.length

      scrollProjectGalleryToIndex(nextIndex)
    }, PROJECT_HIGHLIGHT_ROTATION_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [activeProjectIndex, projects.length, scrollProjectGalleryToIndex])

  return (
    <article
      aria-label={title}
      className="grid w-full min-w-0 max-w-full gap-5 min-[1200px]:grid-cols-[minmax(0,1fr)_minmax(20rem,1fr)] min-[1200px]:items-start min-[1200px]:gap-10 xl:gap-12"
    >
      <div className="relative min-w-0 max-w-full overflow-hidden">
        <div
          ref={projectGalleryRef}
          className="project-card-rail-mask flex w-full min-w-0 max-w-full snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-y-none px-2.5 scroll-px-2.5 [scrollbar-width:none] sm:px-3 sm:scroll-px-3 [&::-webkit-scrollbar]:hidden"
          onScroll={handleProjectGalleryScroll}
          style={{ touchAction: "pan-x" }}
        >
          {projects.map((galleryProject) => (
            <div
              key={galleryProject.id}
              className="min-w-0 basis-[calc(100%-0.75rem)] max-w-[calc(100%-0.75rem)] shrink-0 snap-center first:ml-1.5 last:mr-1.5 sm:basis-[calc(100%-1rem)] sm:max-w-[calc(100%-1rem)] sm:first:ml-2 sm:last:mr-2"
            >
              <div className="relative aspect-[16/9.5] w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.28)] bg-foreground/8 shadow-sm shadow-black/10 ring-foreground/0 transition-[border-color,box-shadow] duration-300 group-focus-visible:ring-2 group-focus-visible:ring-foreground/35 dark:border-white/10 dark:bg-white/[0.04]">
                {galleryProject.images?.length ? (
                  <ProjectImageGallery
                    key={galleryProject.id}
                    cardAspectRatio="16 / 9.5"
                    cardImageFit="contain"
                    cardScrollable={false}
                    images={galleryProject.images}
                    className="h-full"
                    translationNamespace="projects"
                  />
                ) : galleryProject.screenshot ? (
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={galleryProject.screenshot.src}
                      alt={t(galleryProject.screenshot.altKey)}
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                    <ImageBrightnessOverlay
                      brightness={galleryProject.screenshot.brightness}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-foreground/8 dark:bg-white/[0.05]" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 opacity-80 dark:from-black/35 dark:to-white/5" />
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-4 flex items-center justify-center gap-2"
          aria-label={t("title")}
        >
          {projects.map((galleryProject, projectIndex) => {
            const isActive = projectIndex === activeProjectIndex

            return (
              <button
                key={galleryProject.id}
                type="button"
                className={cn(
                  "h-[0.1875rem] rounded-full transition-[width,background-color,opacity] duration-300",
                  isActive
                    ? "w-12 bg-tone-2 opacity-100 dark:bg-white/78"
                    : "w-7 bg-tone-5 opacity-60 hover:bg-tone-3 hover:opacity-100 dark:bg-white/24 dark:hover:bg-white/52",
                )}
                onClick={() => scrollProjectGalleryToIndex(projectIndex)}
                aria-label={t(`items.${galleryProject.id}.title`)}
                aria-current={isActive ? "true" : undefined}
              />
            )
          })}
        </div>
      </div>

      <div
        key={project.id}
        className="project-feature-copy-swap detail-link-pair flex h-[31rem] min-w-0 flex-col gap-4 overflow-hidden [--detail-link-active-color:var(--text-tone-1)] sm:h-[28rem] md:h-[25rem] min-[1200px]:h-[24.5rem] min-[1200px]:pr-3 min-[1440px]:h-[26rem] min-[1800px]:h-[28rem]"
      >
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <h3 className="min-w-0 text-2xl font-normal leading-tight tracking-tight text-tone-1 md:text-3xl">
              <AppLink
                to={detailPath}
                className="detail-link-trigger detail-link-emphasis transition-colors hover:text-tone-1"
              >
                {title}
              </AppLink>
            </h3>
          </div>
          <ProjectRepoLinks
            project={project}
            translationNamespace="projects"
            textClassName="text-sm text-tone-4"
          />
        </div>

        <ProjectTagList project={project} translationNamespace="projects" />

        <p className="max-w-2xl text-sm leading-relaxed text-tone-2 sm:text-base">
          {t(`items.${project.id}.summary`)}
        </p>

        {visiblePoints.length ? (
          <ul className="grid gap-1.5 text-[0.8125rem] leading-snug text-tone-3 sm:text-[0.875rem]">
            {visiblePoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-tone-5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <AppLink
          to={detailPath}
          className={cn(
            "detail-link-trigger detail-link-emphasis group/detail inline-flex w-fit items-center gap-1.5 text-sm font-normal text-tone-2 transition-colors hover:text-tone-1",
            visiblePoints.length && "-mt-2",
          )}
        >
          {t("common:details.viewDetails")}
          <ArrowRight className="detail-link-arrow h-4 w-4 transition-transform group-hover/detail:translate-x-0.5" />
        </AppLink>
      </div>
    </article>
  )
}

export function ProjectArchiveCard({
  className,
  project,
  staggerIndex,
  translationNamespace = "projects",
}: {
  className?: string
  project: Project
  staggerIndex: number
  translationNamespace?: ProjectTranslationNamespace
}) {
  const { t } = useTranslation([translationNamespace, "common"])
  const navigate = useNavigate()
  const coverImages = project.images?.length
    ? project.images
    : project.screenshot
      ? [project.screenshot]
      : []
  const detailPath =
    getProjectDetailPath(project, translationNamespace)
  const repoLinks = getProjectRepoLinks(project)
  const points = getPoints(t(`items.${project.id}.points`, { returnObjects: true }))
  const visiblePoints = points
  const title = t(`items.${project.id}.title`)
  const isCourseProject = translationNamespace === "courseProjects"
  const cardRef = useRef<HTMLElement>(null)
  const contentPanelRef = useRef<HTMLDivElement>(null)
  const collapsedHeadingRef = useRef<HTMLHeadingElement>(null)
  const [collapsedContentOffset, setCollapsedContentOffset] = useState(0)

  useLayoutEffect(() => {
    const cardElement = cardRef.current
    const contentPanelElement = contentPanelRef.current
    const headingElement = collapsedHeadingRef.current

    if (!(cardElement && contentPanelElement && headingElement)) {
      return undefined
    }

    const updateCollapsedContentOffset = () => {
      const panelStyle = window.getComputedStyle(contentPanelElement)
      const verticalPadding =
        (Number.parseFloat(panelStyle.paddingTop) || 0) +
        (Number.parseFloat(panelStyle.paddingBottom) || 0)
      const nextOffset = Math.max(
        0,
        cardElement.clientHeight - headingElement.offsetHeight - verticalPadding,
      )

      setCollapsedContentOffset((currentOffset) =>
        Math.abs(currentOffset - nextOffset) < 0.5 ? currentOffset : nextOffset,
      )
    }

    updateCollapsedContentOffset()

    const resizeObserver = new ResizeObserver(updateCollapsedContentOffset)
    resizeObserver.observe(cardElement)
    resizeObserver.observe(headingElement)

    return () => resizeObserver.disconnect()
  }, [title])

  const contentPanelStyle = {
    "--archive-card-collapsed-y": `${collapsedContentOffset}px`,
  } as CSSProperties & Record<"--archive-card-collapsed-y", string>

  const navigateToDetail = () => {
    navigate(detailPath)
  }

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a,button")) {
      return
    }

    navigateToDetail()
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return
    }

    event.preventDefault()
    navigateToDetail()
  }

  return (
    <article
      ref={cardRef}
      aria-label={title}
      className={cn(
        "group relative isolate cursor-pointer overflow-hidden rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.24)] bg-black/15 shadow-sm shadow-black/10 outline-none ring-foreground/0 transition-shadow focus-visible:ring-2 focus-visible:ring-white/70",
        "dark:border-white/10 dark:bg-white/[0.04]",
        className,
      )}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
    >
      {coverImages.length ? (
        <ProjectCoverCarousel
          images={coverImages}
          staggerIndex={staggerIndex}
        />
      ) : (
        <div className="absolute inset-0 bg-foreground/10 dark:bg-white/[0.05]" />
      )}
      {isCourseProject ? (
        <>
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[rgb(var(--site-surface-rgb)_/_0.90)] to-transparent transition-opacity duration-500 group-hover:opacity-0 dark:from-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--site-surface-rgb)_/_0.92)] via-[rgb(var(--site-surface-rgb)_/_0.46)] to-[rgb(var(--site-surface-rgb)_/_0.66)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-black/90 dark:via-black/42 dark:to-black/58" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/28 to-black/42 opacity-95 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 bg-[rgb(var(--site-surface-rgb)_/_0)] transition-colors duration-500 group-hover:bg-[rgb(var(--site-surface-rgb)_/_0.18)] dark:bg-black/0 dark:group-hover:bg-black/34" />
        </>
      )}
      <div
        ref={contentPanelRef}
        style={contentPanelStyle}
        className={cn(
          "absolute inset-x-0 top-0 z-10 translate-y-[var(--archive-card-collapsed-y)] p-4 transition-transform duration-500 ease-out group-hover:translate-y-0 sm:p-5 md:p-6",
          isCourseProject ? "text-tone-1 dark:text-white" : "text-white",
        )}
      >
        <div
          className={cn(
            "max-w-[min(100%,35rem)]",
            isCourseProject
              ? "[text-shadow:0_1px_18px_rgb(255_255_255_/_0.34)] dark:[text-shadow:0_2px_18px_rgb(0_0_0_/_0.68)]"
              : "[text-shadow:0_2px_18px_rgb(0_0_0_/_0.58)]",
          )}
        >
          <h3 className={cn(
            "max-w-full text-left text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-xl xl:text-2xl",
            isCourseProject ? "text-tone-1 dark:text-white" : "text-white",
          )} ref={collapsedHeadingRef}>
            {title}
          </h3>

          <div className="grid max-h-0 gap-3 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:max-h-[28rem] group-hover:pt-4 group-hover:opacity-100">
            {repoLinks.length ? (
              <div
                className={cn(
                  "flex flex-col items-start gap-1.5 text-xs",
                  isCourseProject
                    ? "text-tone-3 dark:text-white/76"
                    : "text-white/76",
                )}
              >
                {repoLinks.map((link) => {
                  const content = (
                    <>
                      {link.repoTags?.map((repoTag) => (
                        <span
                          key={repoTag}
                          className={cn(
                            "shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.6875rem] leading-none shadow-sm backdrop-blur-sm",
                            getSemanticTagClassName(repoTag),
                            "bg-[rgb(var(--site-surface-rgb)_/_0.86)] dark:bg-white/12",
                          )}
                        >
                          {t(`repoTags.${repoTag}`)}
                        </span>
                      ))}
                      <span className="min-w-0 max-w-[8rem] truncate sm:max-w-[10rem] md:max-w-[14rem] xl:max-w-[18rem]">
                        {link.label}
                      </span>
                      {link.url ? (
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                      ) : null}
                      <GitHubRepoStats repo={link.githubRepo} />
                    </>
                  )

                  return link.url ? (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${t("repoLabel")}: ${link.label}`}
                      className={cn(
                        "inline-flex min-w-0 max-w-full items-center gap-1.5 transition-colors",
                        isCourseProject
                          ? "hover:text-tone-1 dark:hover:text-white"
                          : "hover:text-white",
                      )}
                    >
                      {content}
                    </a>
                  ) : (
                    <span
                      key={link.label}
                      className="inline-flex min-w-0 max-w-full items-center gap-1.5"
                    >
                      {content}
                    </span>
                  )
                })}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 8).map((tag, tagIndex) => {
                const isCourseProjectTimeTag =
                  translationNamespace === "courseProjects" && tagIndex < 2
                const tagLabel = isCourseProjectTimeTag
                  ? t(`semesterTags.${tag}`, { defaultValue: tag })
                  : tag

                return (
                  <span
                    key={tag}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium leading-none backdrop-blur-sm",
                      tagIndex >= 4 && "hidden min-[1800px]:inline-flex",
                      isCourseProject
                        ? "border-foreground/12 bg-[rgb(var(--site-surface-rgb)_/_0.44)] text-tone-3 dark:border-white/18 dark:bg-black/22 dark:text-white/78"
                        : "border-white/18 bg-black/18 text-white/78",
                    )}
                  >
                    {tagLabel}
                  </span>
                )
              })}
            </div>

            <p
              className={cn(
                "max-w-2xl leading-relaxed",
                isCourseProject
                  ? "text-[0.9375rem] text-tone-1 dark:text-white/94"
                  : "text-sm text-white/82",
              )}
            >
              {t(`items.${project.id}.summary`)}
            </p>

            {visiblePoints.length ? (
              <ul
                className={cn(
                  "grid gap-1.5 leading-snug",
                  isCourseProject
                    ? "text-[0.875rem] text-tone-2 dark:text-white/88"
                    : "text-[0.8125rem] text-white/76",
                )}
              >
                {visiblePoints.map((point, pointIndex) => (
                  <li
                    key={point}
                    className={cn(
                      "flex gap-2",
                      pointIndex >= 2 && "hidden min-[1800px]:flex",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-[0.55em] h-1 w-1 shrink-0 rounded-full",
                        isCourseProject
                          ? "bg-tone-3 dark:bg-white/72"
                          : "bg-white/58",
                      )}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

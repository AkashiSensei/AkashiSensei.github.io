import { ArrowRight, ArrowUpRight } from "lucide-react"
import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { AppLink } from "@/components/AppLink"
import CardSwap, { Card } from "@/components/CardSwap"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { ImageBrightnessOverlay } from "@/components/ImageBrightnessOverlay"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { projects, type Project } from "@/data/projects"
import { type ImageBrightness } from "@/lib/image-brightness"
import { getProjectPointSections } from "@/lib/project-points"
import {
  getCourseProjectSemesterTagClassName,
  getSemanticTagClassName,
} from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

type ProjectCoverImage = {
  src: string
  altKey: string
  brightness?: ImageBrightness
}

type ProjectTranslationNamespace = "projects" | "courseProjects"

const COVER_CAROUSEL_INTERVAL_MS = 6800
const COVER_CAROUSEL_STAGGER_MS = 1300
const PROJECT_CARD_IMAGE_ASPECT_RATIO = "1280 / 780"
const PROJECT_CARD_HEIGHT_RATIO = 780 / 1280
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
        viewAllLabel={t("viewAllWithCount", { count: projects.length })}
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

    let intervalId: number | undefined
    const timeoutId = window.setTimeout(
      () => {
        setActiveIndex((current) => (current + 1) % images.length)
        intervalId = window.setInterval(() => {
          setActiveIndex((current) => (current + 1) % images.length)
        }, COVER_CAROUSEL_INTERVAL_MS)
      },
      COVER_CAROUSEL_INTERVAL_MS + staggerIndex * COVER_CAROUSEL_STAGGER_MS,
    )

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) {
        window.clearInterval(intervalId)
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
  interactive = true,
  project,
  textClassName,
  translationNamespace,
}: {
  interactive?: boolean
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

        return interactive && link.url ? (
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

function ProjectFeatureCopyContent({
  interactive = true,
  project,
  projectViewportMode,
}: {
  interactive?: boolean
  project: Project
  projectViewportMode: ProjectViewportMode
}) {
  const { i18n, t } = useTranslation(["projects", "common"])
  const { points, highlightedIndexes } = getProjectPointSections(
    t(`items.${project.id}.points`, { returnObjects: true }),
  )
  const isEnglish = (i18n.resolvedLanguage ?? i18n.language).startsWith("en")
  const visiblePointCount = projectViewportMode.isCompactDesktop
    ? 0
    : projectViewportMode.isMobile
      ? 3
      : isEnglish || projectViewportMode.isNarrowSplitDesktop
        ? 1
        : 3
  const visiblePoints = points.slice(0, visiblePointCount)
  const highlightedPointSet = new Set(highlightedIndexes)
  const shouldShowProjectTags = !projectViewportMode.isCompactDesktop
  const title = t(`items.${project.id}.title`)
  const detailPath = getProjectDetailPath(project, "projects")

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h3 className="min-w-0 text-2xl font-normal leading-tight tracking-tight text-tone-1 md:text-[1.7rem] lg:text-3xl">
            {interactive ? (
              <AppLink
                to={detailPath}
                className="detail-link-trigger detail-link-emphasis transition-colors hover:text-tone-1"
              >
                {title}
              </AppLink>
            ) : (
              <span>{title}</span>
            )}
          </h3>
        </div>
        <ProjectRepoLinks
          interactive={interactive}
          project={project}
          translationNamespace="projects"
          textClassName="text-sm text-tone-4"
        />
      </div>

      {shouldShowProjectTags ? (
        <ProjectTagList project={project} translationNamespace="projects" />
      ) : null}

      <p className="max-w-2xl text-sm leading-relaxed text-tone-2 sm:text-base md:text-[0.9375rem] lg:text-base">
        {t(`items.${project.id}.summary`)}
      </p>

      {visiblePoints.length ? (
        <ul className="grid gap-1.5 text-[0.8125rem] leading-snug text-tone-3 sm:text-[0.875rem] md:gap-1">
          {visiblePoints.map((point, pointIndex) => {
            const highlighted = highlightedPointSet.has(pointIndex)

            return (
              <li
                key={point}
                className={cn(
                  "flex gap-2",
                  highlighted && "text-amber-700 dark:text-violet-300",
                )}
              >
                <span
                  className={cn(
                    "mt-[0.55em] h-1 w-1 shrink-0 rounded-full",
                    highlighted
                      ? "bg-amber-700 dark:bg-violet-300"
                      : "bg-tone-5",
                  )}
                />
                <span>{point}</span>
              </li>
            )
          })}
        </ul>
      ) : null}

      {interactive ? (
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
      ) : (
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1.5 text-sm font-normal text-tone-2",
            visiblePoints.length && "-mt-2",
          )}
        >
          {t("common:details.viewDetails")}
          <ArrowRight className="h-4 w-4" />
        </span>
      )}
    </>
  )
}

type ProjectViewportMode = {
  isCompactDesktop: boolean
  isMobile: boolean
  isNarrowSplitDesktop: boolean
  width: number
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
  const getProjectViewportMode = (): ProjectViewportMode => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isCompactDesktop: false,
        isNarrowSplitDesktop: false,
        width: 1440,
      }
    }

    const measuredViewportWidth = window.visualViewport?.width ?? window.innerWidth
    const viewportWidth = Number.isFinite(measuredViewportWidth) && measuredViewportWidth > 0
      ? measuredViewportWidth
      : 1440

    return {
      isMobile: viewportWidth < 768,
      isCompactDesktop: viewportWidth >= 768 && viewportWidth < 1200,
      isNarrowSplitDesktop: viewportWidth >= 1200 && viewportWidth < 1500,
      width: viewportWidth,
    }
  }
  const [projectViewportMode, setProjectViewportMode] = useState(
    getProjectViewportMode,
  )
  const projectCopyMeasureRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [mobileProjectCopyHeight, setMobileProjectCopyHeight] = useState<
    number | null
  >(null)
  const project = projects[activeProjectIndex] ?? projects[0]
  const title = t(`items.${project.id}.title`)
  const estimatedCardWidth = projectViewportMode.isMobile
    ? Math.max(260, projectViewportMode.width - 40)
    : projectViewportMode.isCompactDesktop
      ? Math.min(520, Math.max(320, projectViewportMode.width * 0.44))
      : 704
  const cardSwapDistance = Math.round(
    Math.min(22, Math.max(4, estimatedCardWidth * 0.03)),
  )
  const cardSwapVerticalDistance = Math.round(
    Math.min(24, Math.max(6, estimatedCardWidth * 0.033)),
  )
  const cardSwapDropDistance = Math.round(
    estimatedCardWidth * PROJECT_CARD_HEIGHT_RATIO * 0.5,
  )
  const projectCardStackStyle = {
    "--project-card-stack-bottom": `${Math.max(14, cardSwapVerticalDistance + 4)}px`,
    "--project-card-stack-top": `${cardSwapVerticalDistance * (projects.length - 1) + 10}px`,
    "--project-card-copy-top": `${cardSwapVerticalDistance + 10}px`,
  } as CSSProperties & Record<
    | "--project-card-copy-top"
    | "--project-card-stack-bottom"
    | "--project-card-stack-top",
    string
  >
  const projectCopyHeightStyle = {
    "--project-mobile-copy-height": mobileProjectCopyHeight
      ? `${mobileProjectCopyHeight}px`
      : "26rem",
  } as CSSProperties & Record<"--project-mobile-copy-height", string>

  useEffect(() => {
    const updateProjectViewportMode = () => {
      const nextMode = getProjectViewportMode()

      setProjectViewportMode((currentMode) =>
        currentMode.isMobile === nextMode.isMobile &&
        currentMode.isCompactDesktop === nextMode.isCompactDesktop &&
        currentMode.isNarrowSplitDesktop === nextMode.isNarrowSplitDesktop &&
        Math.abs(currentMode.width - nextMode.width) < 1
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

  useLayoutEffect(() => {
    if (!projectViewportMode.isMobile) {
      return
    }

    const measureElements = projects
      .map((measureProject) => projectCopyMeasureRefs.current[measureProject.id])
      .filter((element): element is HTMLDivElement => Boolean(element))

    if (measureElements.length === 0) {
      return
    }

    let animationFrameId: number | null = null
    let isCancelled = false

    const measureCopyHeight = () => {
      if (isCancelled) {
        return
      }

      const nextHeight = Math.max(
        ...measureElements.map((element) => Math.ceil(element.scrollHeight)),
      )

      if (nextHeight > 0) {
        setMobileProjectCopyHeight((currentHeight) =>
          currentHeight === nextHeight ? currentHeight : nextHeight,
        )
      }
    }

    animationFrameId = window.requestAnimationFrame(measureCopyHeight)

    const resizeObserver = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(measureCopyHeight)

    measureElements.forEach((element) => resizeObserver?.observe(element))
    document.fonts?.ready.then(measureCopyHeight)

    return () => {
      isCancelled = true

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }

      resizeObserver?.disconnect()
    }
  }, [
    i18n.language,
    i18n.resolvedLanguage,
    projectViewportMode.isMobile,
    projectViewportMode.width,
    projects,
  ])

  return (
    <article
      aria-label={title}
      className="grid w-full min-w-0 max-w-full gap-5 md:grid-cols-[minmax(0,0.94fr)_minmax(19rem,1.06fr)] md:items-start md:gap-5 lg:grid-cols-[minmax(0,0.96fr)_minmax(21rem,1.04fr)] lg:gap-6 xl:grid-cols-[minmax(0,0.98fr)_minmax(24rem,1.02fr)] xl:gap-8 min-[1800px]:!grid-cols-[minmax(0,0.92fr)_minmax(28rem,1.08fr)]"
      style={projectCardStackStyle}
    >
      <div className="relative min-w-0 max-w-full overflow-visible">
        <div
          className="relative mx-auto overflow-visible px-1 pb-[var(--project-card-stack-bottom)] pr-6 pt-[var(--project-card-stack-top)] sm:pr-8 md:mx-0 md:min-h-[18rem] md:w-auto md:pr-2 lg:min-h-[22rem] xl:min-h-[24rem] min-[1440px]:min-h-[26rem] min-[1800px]:!min-h-[28rem]"
        >
          <div className="relative aspect-[1280/780] w-[calc(100%-1.5rem)] max-w-[44rem] sm:w-[calc(100%-2rem)] md:w-[calc(100%-1rem)] md:max-w-none lg:w-full">
            <CardSwap
              activeIndex={activeProjectIndex}
              cardDistance={cardSwapDistance}
              className="bottom-0 left-0 [touch-action:pan-y]"
              delay={PROJECT_HIGHLIGHT_ROTATION_INTERVAL_MS}
              dropDistance={cardSwapDropDistance}
              height="100%"
              onActiveIndexChange={onActiveProjectIndexChange}
              pauseOnHover
              skewAmount={0}
              verticalDistance={cardSwapVerticalDistance}
              width="100%"
            >
              {projects.map((galleryProject, projectIndex) => (
                <Card
                  key={galleryProject.id}
                  className="project-card-swap-card-shell group/project-card relative isolate overflow-hidden rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.28)] shadow-sm shadow-black/12 ring-foreground/0 transition-[border-color,box-shadow] duration-300 focus-within:ring-2 focus-within:ring-foreground/35 dark:border-white/10"
                  aria-label={t(`items.${galleryProject.id}.title`)}
                >
                  <div className="absolute inset-0 z-10 overflow-hidden rounded-[inherit]">
                    {galleryProject.images?.length ? (
                      <ProjectImageGallery
                        key={galleryProject.id}
                        cardAspectRatio={PROJECT_CARD_IMAGE_ASPECT_RATIO}
                        cardAutoCycle
                        cardAutoCycleStaggerIndex={projectIndex}
                        cardImageFit="contain"
                        cardInteractive={false}
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
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>

      <div className="relative min-w-0 md:self-start">
        <div
          key={project.id}
          className="project-feature-copy-swap detail-link-pair flex h-[var(--project-mobile-copy-height)] min-w-0 flex-col gap-4 overflow-visible pr-1 [--detail-link-active-color:var(--text-tone-1)] md:h-[22.5rem] md:justify-start md:gap-3.5 md:overflow-hidden md:pr-2 md:pt-[var(--project-card-copy-top)] lg:h-[24rem] xl:h-[25rem] min-[1440px]:h-[26.5rem] min-[1800px]:!h-[29rem]"
          style={projectCopyHeightStyle}
        >
          <ProjectFeatureCopyContent
            project={project}
            projectViewportMode={projectViewportMode}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex min-w-0 flex-col gap-4 overflow-hidden pr-1 opacity-0 md:hidden"
          inert
        >
          {projects.map((measureProject) => (
            <div
              key={measureProject.id}
              ref={(element) => {
                projectCopyMeasureRefs.current[measureProject.id] = element
              }}
              className="detail-link-pair flex min-w-0 flex-col gap-4 [--detail-link-active-color:var(--text-tone-1)]"
            >
              <ProjectFeatureCopyContent
                interactive={false}
                project={measureProject}
                projectViewportMode={projectViewportMode}
              />
            </div>
          ))}
        </div>
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
  const { points, highlightedIndexes } = getProjectPointSections(
    t(`items.${project.id}.points`, { returnObjects: true }),
  )
  const visiblePoints = points
  const highlightedPointSet = new Set(highlightedIndexes)
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
                const semesterTagClassName = getCourseProjectSemesterTagClassName(
                  project.tags[1],
                )
                const tagLabel = isCourseProjectTimeTag
                  ? t(`semesterTags.${tag}`, { defaultValue: tag })
                  : tag

                return (
                  <span
                    key={tag}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[0.6875rem] font-medium leading-none backdrop-blur-sm",
                      tagIndex >= 4 && "hidden min-[1800px]:inline-flex",
                      isCourseProjectTimeTag
                        ? semesterTagClassName
                        : isCourseProject
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
                {visiblePoints.map((point, pointIndex) => {
                  const highlighted = highlightedPointSet.has(pointIndex)

                  return (
                    <li
                      key={point}
                      className={cn(
                        "flex gap-2",
                        pointIndex >= 2 && "hidden min-[1800px]:flex",
                        highlighted &&
                          (isCourseProject
                            ? "text-amber-700 dark:text-violet-200"
                            : "text-amber-200 dark:text-violet-200"),
                      )}
                    >
                      <span
                        className={cn(
                          "mt-[0.55em] h-1 w-1 shrink-0 rounded-full",
                          highlighted
                            ? isCourseProject
                              ? "bg-amber-700 dark:bg-violet-200"
                              : "bg-amber-200 dark:bg-violet-200"
                            : isCourseProject
                              ? "bg-tone-3 dark:bg-white/72"
                              : "bg-white/58",
                        )}
                      />
                      <span>{point}</span>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

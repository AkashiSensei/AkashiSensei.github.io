import {
  ArrowUpRight,
  BookMarked,
  CalendarClock,
  CircleDot,
  GitCommitHorizontal,
  GitPullRequestArrow,
  LockKeyhole,
  MessageSquareText,
} from "lucide-react"
import { type PointerEvent, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { GitHubMark } from "@/components/GitHubMark"
import { getGitHubUserActivity } from "@/lib/github-repo-stats"
import { cn } from "@/lib/utils"

const activityMetricKeys = [
  {
    icon: GitCommitHorizontal,
    labelKey: "githubActivity.stats.commits",
    valueKey: "commits",
  },
  {
    icon: MessageSquareText,
    labelKey: "githubActivity.stats.reviews",
    valueKey: "pullRequestReviews",
  },
  {
    icon: GitPullRequestArrow,
    labelKey: "githubActivity.stats.pullRequests",
    valueKey: "pullRequests",
  },
  {
    icon: CircleDot,
    labelKey: "githubActivity.stats.issues",
    valueKey: "issues",
  },
  {
    icon: BookMarked,
    labelKey: "githubActivity.stats.repositories",
    valueKey: "repositories",
  },
  {
    icon: LockKeyhole,
    labelKey: "githubActivity.stats.restricted",
    valueKey: "restrictedContributions",
  },
] as const

type ActivityMetricKey = (typeof activityMetricKeys)[number]["valueKey"]

type ActivityMetric = (typeof activityMetricKeys)[number] & {
  value: number
}

function toDate(value?: string) {
  if (!value) {
    return undefined
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? undefined : date
}

export function GitHubActivityHighlights() {
  const { i18n, t } = useTranslation("resume")
  const [hoveredMetricKey, setHoveredMetricKey] = useState<
    ActivityMetricKey | undefined
  >()
  const [selectedMetricKey, setSelectedMetricKey] = useState<
    ActivityMetricKey | undefined
  >()
  const [canUseHover, setCanUseHover] = useState(false)
  const lastPointerTypeRef = useRef("")
  const lastTouchSelectionRef = useRef<ActivityMetricKey | undefined>(undefined)
  const activeMetricKey = canUseHover
    ? hoveredMetricKey ?? selectedMetricKey
    : selectedMetricKey

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined
    }

    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const updateCanUseHover = () => setCanUseHover(hoverQuery.matches)

    updateCanUseHover()
    if (typeof hoverQuery.addEventListener === "function") {
      hoverQuery.addEventListener("change", updateCanUseHover)

      return () => hoverQuery.removeEventListener("change", updateCanUseHover)
    }

    const legacyHoverQuery = hoverQuery as MediaQueryList & {
      addListener: (listener: () => void) => void
      removeListener: (listener: () => void) => void
    }

    legacyHoverQuery.addListener(updateCanUseHover)

    return () => legacyHoverQuery.removeListener(updateCanUseHover)
  }, [])

  const recordPointerType = <T extends HTMLElement>(event: PointerEvent<T>) => {
    lastPointerTypeRef.current = event.pointerType
  }
  const commitTouchSelection = (metricKey: ActivityMetricKey) => {
    setHoveredMetricKey(undefined)
    setSelectedMetricKey((current) =>
      current === metricKey ? undefined : metricKey,
    )
  }
  const selectMetricKey = (metricKey: ActivityMetricKey) => {
    if (canUseHover && lastPointerTypeRef.current !== "touch") {
      setHoveredMetricKey(metricKey)
      return
    }

    if (lastTouchSelectionRef.current === metricKey) {
      lastTouchSelectionRef.current = undefined
      return
    }

    commitTouchSelection(metricKey)
  }
  const selectMetricKeyFromPointer = <T extends HTMLElement>(
    event: PointerEvent<T>,
    metricKey: ActivityMetricKey,
  ) => {
    recordPointerType(event)

    if (!canUseHover || event.pointerType === "touch") {
      lastTouchSelectionRef.current = metricKey
      commitTouchSelection(metricKey)
    }
  }
  const focusMetricKey = (metricKey: ActivityMetricKey) => {
    if (canUseHover && lastPointerTypeRef.current !== "touch") {
      setHoveredMetricKey(metricKey)
    }
  }
  const hoverMetricKeyFromPointer = <T extends HTMLElement>(
    event: PointerEvent<T>,
    metricKey: ActivityMetricKey,
  ) => {
    if (
      canUseHover &&
      (event.pointerType === "mouse" || event.pointerType === "pen")
    ) {
      setHoveredMetricKey(metricKey)
    }
  }
  const clearHoveredMetricKey = (metricKey: ActivityMetricKey) => {
    setHoveredMetricKey((currentMetricKey) =>
      currentMetricKey === metricKey ? undefined : currentMetricKey,
    )
  }
  const clearHoveredMetricKeyFromPointer = <T extends HTMLElement>(
    event: PointerEvent<T>,
  ) => {
    if (
      canUseHover &&
      (event.pointerType === "mouse" || event.pointerType === "pen")
    ) {
      setHoveredMetricKey(undefined)
    }
  }
  const activity = getGitHubUserActivity()

  const metrics: ActivityMetric[] = activityMetricKeys
    .map((metric) => ({
      ...metric,
      value: activity?.[metric.valueKey],
    }))
    .filter((metric): metric is ActivityMetric => typeof metric.value === "number")

  const locale = i18n.resolvedLanguage ?? i18n.language
  const numberFormatter = new Intl.NumberFormat(locale)
  const percentFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  })
  const fetchedAt = toDate(activity?.fetchedAt)
  const from = toDate(activity?.from)
  const to = toDate(activity?.to)
  const fetchedAtLabel = fetchedAt
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(fetchedAt)
    : undefined
  const rangeLabel =
    from && to
      ? new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
        }).formatRange(from, to)
      : undefined
  const activityDescription = t("githubActivity.description", {
    returnObjects: true,
  })
  const descriptionLines = Array.isArray(activityDescription)
    ? activityDescription.filter((line): line is string => typeof line === "string")
    : [String(activityDescription)]
  const visibleMetrics = metrics.length > 0 ? metrics : activityMetricKeys
  const metricTotal = metrics.reduce((sum, metric) => sum + metric.value, 0)

  return (
    <section
      id="github-activity"
      className="resume-rhythm-section flex w-full flex-col justify-center gap-5"
    >
      <div className="flex flex-col gap-2 px-2 sm:px-3 md:px-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-normal leading-none tracking-tight text-tone-1 md:text-4xl">
            {t("githubActivity.title")}
          </h2>

          <a
            href={`https://github.com/${activity?.login ?? "AkashiSensei"}`}
            target="_blank"
            rel="noreferrer"
            className="group/repo inline-flex w-fit shrink-0 items-center justify-end gap-1.5 text-right text-[0.9375rem] font-normal leading-none text-tone-2 transition-colors hover:text-tone-1 sm:text-[1.0625rem]"
          >
            <GitHubMark className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
            <span>{activity?.login ?? "AkashiSensei"}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5" />
          </a>
        </div>

        <p className="max-w-3xl text-sm leading-relaxed text-tone-4 sm:text-base">
          {t("githubActivity.subtitle")}
        </p>
      </div>

      <div
        className="grid grid-cols-3 gap-x-5 gap-y-5 px-2 sm:px-3 md:grid-cols-[minmax(0,1.28fr)_minmax(0,0.88fr)_minmax(0,0.88fr)] md:gap-x-6 md:px-4 xl:grid-cols-[minmax(0,1.34fr)_minmax(0,0.88fr)_minmax(0,0.88fr)_minmax(0,0.88fr)] xl:gap-x-8"
        onPointerLeave={clearHoveredMetricKeyFromPointer}
      >
        <div
          className="col-span-3 grid min-h-[11.5rem] grid-cols-[3px_minmax(0,1fr)] gap-5 sm:min-h-[12rem] sm:gap-6 md:col-span-1 md:row-span-3 md:min-h-0 xl:row-span-2"
          onPointerEnter={clearHoveredMetricKeyFromPointer}
        >
          <div className="h-full bg-tone-3 dark:bg-tone-2" aria-hidden="true" />
          <div className="flex min-w-0 flex-col justify-between gap-5 py-1">
            <div className="flex items-start justify-between gap-4">
              <div className="inline-flex min-w-0 items-center gap-2 text-[0.6875rem] font-medium uppercase text-tone-4">
                <CalendarClock className="h-3.5 w-3.5" />
                <span>{rangeLabel ?? t("githubActivity.eyebrow")}</span>
              </div>
            </div>

            <div>
              <p className="text-[clamp(3.25rem,17vw,5.25rem)] font-black leading-none tracking-tight text-tone-1 md:text-[clamp(4rem,8vw,5.75rem)]">
                {typeof activity?.totalContributions === "number"
                  ? numberFormatter.format(activity.totalContributions)
                  : t("githubActivity.unavailable")}
              </p>
              <p className="mt-2 text-base font-medium leading-tight text-tone-2 sm:text-lg">
                {t("githubActivity.totalLabel")}
              </p>
            </div>

            <p className="text-xs leading-relaxed text-tone-4 sm:text-sm">
              {fetchedAtLabel
                ? t("githubActivity.fetchedAt", { time: fetchedAtLabel })
                : t("githubActivity.publicScope")}
            </p>
          </div>
        </div>

        {visibleMetrics.map((metric) => {
          const Icon = metric.icon
          const isDimmed =
            activeMetricKey !== undefined &&
            activeMetricKey !== metric.valueKey
          const value =
            "value" in metric && typeof metric.value === "number"
              ? numberFormatter.format(metric.value)
              : t("githubActivity.unavailable")

          return (
            <button
              key={metric.valueKey}
              type="button"
              className="min-h-[6.75rem] touch-manipulation select-none appearance-none border-0 bg-transparent p-0 text-left outline-none ring-foreground/0 [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-foreground/35 sm:min-h-[7.25rem]"
              onPointerEnter={(event) =>
                hoverMetricKeyFromPointer(event, metric.valueKey)
              }
              onPointerDown={(event) =>
                selectMetricKeyFromPointer(event, metric.valueKey)
              }
              onClick={() => selectMetricKey(metric.valueKey)}
              onFocus={() => focusMetricKey(metric.valueKey)}
              onBlur={() => clearHoveredMetricKey(metric.valueKey)}
              aria-pressed={activeMetricKey === metric.valueKey}
            >
              <div
                className={cn(
                  "grid h-full grid-cols-[3px_minmax(0,1fr)] gap-3 transition-[opacity,filter] duration-300 ease-out sm:gap-5",
                  isDimmed ? "opacity-35" : "opacity-100",
                )}
              >
                <div className="h-full bg-tone-4 dark:bg-tone-3" aria-hidden="true" />
                <div className="flex min-w-0 flex-col justify-between gap-2 py-1">
                  <Icon className="h-4 w-4 shrink-0 text-tone-4" />
                  <p className="text-[2.35rem] font-black leading-none tracking-tight text-tone-1 sm:text-[2.75rem]">
                    {value}
                  </p>
                  <p className="min-w-0 text-sm font-medium leading-tight text-tone-2">
                    {t(metric.labelKey)}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {metricTotal > 0 ? (
        <div
          className="flex h-2.5 w-full gap-1 px-2 sm:px-3 md:px-4"
          onPointerLeave={clearHoveredMetricKeyFromPointer}
          role="img"
          aria-label={t("githubActivity.distributionLabel")}
        >
          {metrics.map((metric) => {
            const isActive = activeMetricKey === metric.valueKey
            const isDimmed =
              activeMetricKey !== undefined && activeMetricKey !== metric.valueKey
            const percent = (metric.value / metricTotal) * 100
            const percentLabel = `${percentFormatter.format(percent)}%`

            return (
              <button
                key={metric.valueKey}
                type="button"
                className={cn(
                  "group relative h-full min-w-1 touch-manipulation overflow-visible rounded-full bg-tone-3 transition-[opacity,background-color,filter] duration-300 ease-out dark:bg-tone-2",
                  isActive ? "opacity-100" : "opacity-70",
                  isDimmed ? "opacity-20" : "",
                )}
                style={{
                  flexBasis: 0,
                  flexGrow: metric.value,
                }}
                onPointerEnter={(event) =>
                  hoverMetricKeyFromPointer(event, metric.valueKey)
                }
                onPointerDown={(event) =>
                  selectMetricKeyFromPointer(event, metric.valueKey)
                }
                onClick={() => selectMetricKey(metric.valueKey)}
                onFocus={() => focusMetricKey(metric.valueKey)}
                onBlur={() => clearHoveredMetricKey(metric.valueKey)}
                aria-label={`${t(metric.labelKey)} ${numberFormatter.format(metric.value)}`}
              >
                <span
                  className={cn(
                    "pointer-events-none absolute bottom-[calc(100%+0.65rem)] left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-lg font-semibold leading-none text-background shadow-sm transition-[opacity,visibility] duration-150 sm:text-xl",
                    isActive ? "visible opacity-100" : "invisible opacity-0",
                  )}
                  role="tooltip"
                >
                  {percentLabel}
                  <span className="absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-foreground" />
                </span>
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="flex flex-col gap-1 px-2 text-sm leading-relaxed text-tone-2 sm:px-3 sm:text-[0.9375rem] md:px-4">
        {descriptionLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </section>
  )
}

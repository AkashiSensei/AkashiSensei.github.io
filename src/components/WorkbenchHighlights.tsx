import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { SoftwareGroupCard } from "@/components/SoftwareGroupCard"
import {
  workbenchGroups,
  type WorkbenchGroup,
  type WorkbenchSoftware,
} from "@/data/workbench"
import { cn } from "@/lib/utils"

const WALL_REPEAT_COUNT = 4
const WALL_ROW_COUNT = 5
const WALL_ROW_OFFSET_STEP_REM = 2.15
const ICON_REPEL_RADIUS = 3.75
const ICON_REPEL_X_REM = 1.55
const ICON_REPEL_Y_REM = 1.05
const PREVIEW_CARD_GAP_PX = 18
const PREVIEW_CARD_MAX_WIDTH_PX = 352
const PREVIEW_CARD_MIN_WIDTH_PX = 264
const PREVIEW_CARD_ESTIMATED_HEIGHT_PX = 336
const PREVIEW_EXIT_DURATION_MS = 360
const PREVIEW_WALL_PADDING_PX = 8

type HoveredWallIcon = {
  itemIndex: number
  rowIndex: number
}

type PreviewSide = "left" | "right"

type PreviewPosition = {
  left: number
  maxHeight: number
  top: number
  width: number
}

type PreviewCandidate = {
  group: WorkbenchGroup
  icon: HoveredWallIcon
  key: string
  position: PreviewPosition
  side: PreviewSide
}

type LockedPreview = {
  icon: HoveredWallIcon
  preview: PreviewCandidate
}

type WorkbenchIcon = WorkbenchSoftware & {
  group: WorkbenchGroup
}

type WallSoftware = WorkbenchIcon & {
  wallKey: string
  orderKey: number
}

function getWorkbenchSoftwareIcons() {
  const softwareById = new Map<string, WorkbenchIcon>()

  workbenchGroups.forEach((group) => {
    group.software.forEach((software) => {
      if (software.id === "evernote") {
        return
      }

      softwareById.set(software.id, {
        ...software,
        group,
      })
    })
  })

  return Array.from(softwareById.values())
}

function buildIconWallRows(software: WorkbenchIcon[]): WallSoftware[][] {
  const wallItems = Array.from({ length: WALL_REPEAT_COUNT }).flatMap(
    (_, repeatIndex) =>
      software.map((item, itemIndex) => ({
        ...item,
        wallKey: `${repeatIndex}-${item.id}`,
        orderKey: (itemIndex * 7 + repeatIndex * 11) % software.length,
      })),
  )

  const shuffledItems = [...wallItems].sort((left, right) => {
    if (left.orderKey !== right.orderKey) {
      return left.orderKey - right.orderKey
    }

    return left.wallKey.localeCompare(right.wallKey)
  })

  return Array.from({ length: WALL_ROW_COUNT }, (_, rowIndex) => {
    const row = shuffledItems.filter(
      (_, itemIndex) => itemIndex % WALL_ROW_COUNT === rowIndex,
    )

    if (row.length === 0) {
      return row
    }

    const firstItem = row[0]
    const lastItem = row[row.length - 1]

    return [
      {
        ...lastItem,
        wallKey: `edge-left-${rowIndex}-${lastItem.wallKey}`,
      },
      ...row,
      {
        ...firstItem,
        wallKey: `edge-right-${rowIndex}-${firstItem.wallKey}`,
      },
    ]
  })
}

function getPreviewGroup(group: WorkbenchGroup): WorkbenchGroup {
  if (group.id !== "knowledge-tools") {
    return group
  }

  return {
    ...group,
    software: group.software.filter((software) => software.id !== "evernote"),
  }
}

function isSameWallIcon(left: HoveredWallIcon, right: HoveredWallIcon) {
  return left.rowIndex === right.rowIndex && left.itemIndex === right.itemIndex
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getPreviewCandidateFromIconRect({
  iconRect,
  itemIndex,
  rowIndex,
  software,
  wallRect,
}: {
  iconRect: DOMRect
  itemIndex: number
  rowIndex: number
  software: WallSoftware
  wallRect?: DOMRect
}): PreviewCandidate {
  const fallbackWallRect = {
    height: iconRect.height * WALL_ROW_COUNT,
    left: iconRect.left - iconRect.width * 2,
    top: iconRect.top - iconRect.height * 2,
    width: iconRect.width * 8,
  }
  const effectiveWallRect = wallRect ?? fallbackWallRect
  const wallCenterX = wallRect
    ? wallRect.left + wallRect.width / 2
    : iconRect.left + iconRect.width / 2
  const iconCenterX = iconRect.left + iconRect.width / 2
  const iconCenterY = iconRect.top + iconRect.height / 2
  const side = iconCenterX < wallCenterX ? "right" : "left"
  const width = clamp(
    effectiveWallRect.width / 2 - PREVIEW_CARD_GAP_PX * 2,
    PREVIEW_CARD_MIN_WIDTH_PX,
    PREVIEW_CARD_MAX_WIDTH_PX,
  )
  const maxHeight = effectiveWallRect.height * 0.8
  const estimatedHeight = Math.min(maxHeight, PREVIEW_CARD_ESTIMATED_HEIGHT_PX)
  const top = clamp(
    iconCenterY - effectiveWallRect.top - estimatedHeight / 2,
    PREVIEW_WALL_PADDING_PX,
    effectiveWallRect.height - estimatedHeight - PREVIEW_WALL_PADDING_PX,
  )
  const left =
    side === "right"
      ? clamp(
          iconRect.right - effectiveWallRect.left + PREVIEW_CARD_GAP_PX,
          PREVIEW_WALL_PADDING_PX,
          effectiveWallRect.width - width - PREVIEW_WALL_PADDING_PX,
        )
      : clamp(
          iconRect.left - effectiveWallRect.left - width - PREVIEW_CARD_GAP_PX,
          PREVIEW_WALL_PADDING_PX,
          effectiveWallRect.width - width - PREVIEW_WALL_PADDING_PX,
        )

  return {
    group: getPreviewGroup(software.group),
    icon: { itemIndex, rowIndex },
    key: `${rowIndex}-${itemIndex}-${software.group.id}`,
    position: {
      left,
      maxHeight,
      top,
      width,
    },
    side,
  }
}

function getIconRepelStyle({
  hoveredIcon,
  itemIndex,
  rowIndex,
}: {
  hoveredIcon: HoveredWallIcon | null
  itemIndex: number
  rowIndex: number
}): CSSProperties {
  if (hoveredIcon === null) {
    return {}
  }

  const isHovered =
    hoveredIcon.rowIndex === rowIndex && hoveredIcon.itemIndex === itemIndex

  if (isHovered) {
    return {
      transform: "translate3d(0, 0, 0)",
      zIndex: 20,
    }
  }

  const dx =
    itemIndex - hoveredIcon.itemIndex +
    (rowIndex - hoveredIcon.rowIndex) * WALL_ROW_OFFSET_STEP_REM * 0.28
  const dy = (rowIndex - hoveredIcon.rowIndex) * 1.08
  const distance = Math.hypot(dx, dy)

  if (distance === 0 || distance > ICON_REPEL_RADIUS) {
    return {}
  }

  const force = (1 - distance / ICON_REPEL_RADIUS) ** 1.65
  const translateX = (dx / distance) * force * ICON_REPEL_X_REM
  const translateY = (dy / distance) * force * ICON_REPEL_Y_REM

  return {
    transform: `translate3d(${translateX.toFixed(3)}rem, ${translateY.toFixed(3)}rem, 0)`,
    zIndex: Math.max(1, Math.round((ICON_REPEL_RADIUS - distance) * 2)),
  }
}

export function WorkbenchHighlights() {
  const { t } = useTranslation("workbench")
  const software = useMemo(() => getWorkbenchSoftwareIcons(), [])
  const wallRows = useMemo(() => buildIconWallRows(software), [software])
  const wallRef = useRef<HTMLDivElement | null>(null)
  const [hoveredIcon, setHoveredIcon] = useState<HoveredWallIcon | null>(null)
  const [previewCandidate, setPreviewCandidate] =
    useState<PreviewCandidate | null>(null)
  const [activePreview, setActivePreview] = useState<PreviewCandidate | null>(null)
  const [lockedPreview, setLockedPreview] = useState<LockedPreview | null>(null)
  const [hasCoarsePointer, setHasCoarsePointer] = useState(false)
  const [retiringPreview, setRetiringPreview] =
    useState<PreviewCandidate | null>(null)

  useEffect(() => {
    if (previewCandidate === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      if (
        lockedPreview !== null &&
        !isSameWallIcon(lockedPreview.icon, previewCandidate.icon)
      ) {
        setLockedPreview(null)
      }

      setRetiringPreview(null)
      setHoveredIcon(previewCandidate.icon)
      setActivePreview(previewCandidate)
    }, 400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [lockedPreview, previewCandidate])

  useEffect(() => {
    if (lockedPreview === null) {
      return
    }

    if (hasCoarsePointer) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setRetiringPreview(lockedPreview.preview)
      setLockedPreview(null)
      setHoveredIcon(null)
      setActivePreview(null)
      setPreviewCandidate(null)
    }, 10000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [hasCoarsePointer, lockedPreview])

  useEffect(() => {
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)")
    const updatePointerMode = () => {
      setHasCoarsePointer(coarsePointerQuery.matches)
    }

    updatePointerMode()
    coarsePointerQuery.addEventListener("change", updatePointerMode)

    return () => {
      coarsePointerQuery.removeEventListener("change", updatePointerMode)
    }
  }, [])

  useEffect(() => {
    if (retiringPreview === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setRetiringPreview(null)
    }, PREVIEW_EXIT_DURATION_MS)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [retiringPreview])

  if (software.length === 0) {
    return null
  }

  const getPreviewCandidate = ({
    event,
    itemIndex,
    rowIndex,
    software,
  }: {
    event: MouseEvent<HTMLSpanElement>
    itemIndex: number
    rowIndex: number
    software: WallSoftware
  }): PreviewCandidate => {
    const iconRect = event.currentTarget.getBoundingClientRect()

    return getPreviewCandidateFromIconRect({
      iconRect,
      itemIndex,
      rowIndex,
      software,
      wallRect: wallRef.current?.getBoundingClientRect(),
    })
  }

  const handleIconEnter = ({
    event,
    itemIndex,
    rowIndex,
    software,
  }: {
    event: MouseEvent<HTMLSpanElement>
    itemIndex: number
    rowIndex: number
    software: WallSoftware
  }) => {
    const nextIcon = { itemIndex, rowIndex }

    if (lockedPreview === null) {
      setHoveredIcon(nextIcon)
      if (activePreview !== null) {
        setRetiringPreview(activePreview)
      }
      setActivePreview(null)
    }

    setPreviewCandidate(
      getPreviewCandidate({
        event,
        itemIndex,
        rowIndex,
        software,
      }),
    )
  }

  const handleIconClick = ({
    event,
    itemIndex,
    rowIndex,
    software,
  }: {
    event: MouseEvent<HTMLSpanElement>
    itemIndex: number
    rowIndex: number
    software: WallSoftware
  }) => {
    const nextIcon = { itemIndex, rowIndex }

    setHoveredIcon(nextIcon)
    setPreviewCandidate(null)
    setActivePreview(null)
    setRetiringPreview(null)
    setLockedPreview({
      icon: nextIcon,
      preview: getPreviewCandidate({
        event,
        itemIndex,
        rowIndex,
        software,
      }),
    })
  }

  const effectiveHoveredIcon = lockedPreview?.icon ?? hoveredIcon
  const visiblePreview = lockedPreview?.preview ?? activePreview ?? retiringPreview
  const isPreviewRetiring =
    lockedPreview === null && activePreview === null && retiringPreview !== null

  return (
    <section id="workbench" className="resume-rhythm-section workbench-rhythm-section flex w-full flex-col justify-center gap-1 sm:gap-2">
      <div className="flex flex-col gap-4 px-2 sm:px-3 md:flex-row md:items-end md:justify-between md:gap-8 md:px-4">
        <div className="flex max-w-3xl flex-col gap-2">
          <h2 className="text-3xl font-normal leading-none tracking-tight text-tone-1 md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-sm leading-relaxed text-tone-4 sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <AppLink
          to="/workbench"
          className="group inline-flex w-fit shrink-0 items-center gap-1.5 text-[0.9375rem] font-normal leading-none text-tone-2 transition-colors hover:text-tone-1 sm:text-[1.0625rem] md:-translate-y-2"
        >
          <span>{t("viewAllWithCount", { count: workbenchGroups.length })}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-[1.125rem] sm:w-[1.125rem]" />
        </AppLink>
      </div>

      <div
        ref={wallRef}
        className="relative mx-auto w-full overflow-x-clip overflow-y-visible pb-0 pt-0 md:pb-4 lg:pb-5 min-[1800px]:!w-[calc(100vw-32rem)]"
        onMouseLeave={() => {
          setPreviewCandidate(null)

          if (lockedPreview === null) {
            if (activePreview) {
              setRetiringPreview(activePreview)
            }

            setHoveredIcon(null)
            setActivePreview(null)
          }
        }}
      >
        <div
          className="flex max-h-[25rem] flex-col gap-0 overflow-visible pb-3 pt-3 sm:max-h-[28rem] sm:pt-3 md:pb-5 lg:max-h-[33rem] lg:pb-6 lg:pt-4"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, black 2rem, black calc(100% - 2rem), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 2rem, black calc(100% - 2rem), transparent 100%)",
          }}
        >
          {wallRows.map((row, rowIndex) => {
            const rowProgress =
              WALL_ROW_COUNT > 1 ? rowIndex / (WALL_ROW_COUNT - 1) : 1
            const rowOffset =
              -(1 - rowProgress) *
              ((WALL_ROW_COUNT - 1) / 2) *
              WALL_ROW_OFFSET_STEP_REM

            return (
              <div
                key={rowIndex}
                className="flex min-w-max items-center justify-center gap-0"
                style={
                  {
                    transform: `translateX(${rowOffset}rem)`,
                  } as CSSProperties
                }
              >
                {row.map((software, itemIndex) => {
                  const isHovered =
                    effectiveHoveredIcon !== null &&
                    effectiveHoveredIcon.rowIndex === rowIndex &&
                    effectiveHoveredIcon.itemIndex === itemIndex

                  return (
                    <span
                      key={software.wallKey}
                      title={software.name}
                      className="relative flex h-14 w-14 shrink-0 origin-center items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none sm:h-[4.5rem] sm:w-[4.5rem] lg:h-[5.25rem] lg:w-[5.25rem]"
                      onMouseEnter={(event) =>
                        handleIconEnter({
                          event,
                          itemIndex,
                          rowIndex,
                          software,
                        })
                      }
                      onClick={(event) =>
                        handleIconClick({
                          event,
                          itemIndex,
                          rowIndex,
                          software,
                        })
                      }
                      style={getIconRepelStyle({
                        hoveredIcon: effectiveHoveredIcon,
                        itemIndex,
                        rowIndex,
                      })}
                    >
                      <img
                        src={software.icon}
                        alt={software.name}
                        className={cn(
                          "h-9 w-9 origin-center object-contain opacity-86 drop-shadow-sm transition-[opacity,filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none sm:h-11 sm:w-11 lg:h-12 lg:w-12",
                          isHovered ? "opacity-100 drop-shadow-lg" : "hover:opacity-100",
                          software.id === "solidworks" &&
                            "dark:drop-shadow-[0_0_14px_rgb(255_255_255_/_0.62)]",
                        )}
                        style={{
                          transform: isHovered ? "scale(1.28)" : "scale(1)",
                        }}
                        loading="lazy"
                      />
                    </span>
                  )
                })}
              </div>
            )
          })}
        </div>

        {visiblePreview ? (
          <div
            key={visiblePreview.key}
            className={cn(
              "absolute z-30 hidden md:block",
              isPreviewRetiring && "pointer-events-none",
            )}
            style={{
              left: `${visiblePreview.position.left}px`,
              maxHeight: `${visiblePreview.position.maxHeight}px`,
              top: `${visiblePreview.position.top}px`,
              width: `${visiblePreview.position.width}px`,
            }}
          >
            <SoftwareGroupCard
              group={visiblePreview.group}
              variant="compact"
              className={cn(
                "workbench-preview-glass h-auto max-h-full min-h-0 w-full overflow-hidden shadow-lg",
                isPreviewRetiring
                  ? "workbench-preview-glass-exit"
                  : "workbench-preview-glass-enter",
              )}
            />
          </div>
        ) : null}

        {lockedPreview ? (
          <div className="px-2 sm:px-3 md:hidden">
            <SoftwareGroupCard
              group={lockedPreview.preview.group}
              variant="compact"
              className="h-auto max-h-none min-h-0 w-full overflow-hidden"
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}

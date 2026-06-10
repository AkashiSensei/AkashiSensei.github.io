import { useEffect, useRef, useState, type CSSProperties } from "react"
import { useTranslation } from "react-i18next"

import directionsData from "@/data/directions.json"
import { cn } from "@/lib/utils"

type DirectionItem = {
  id: string
  planned?: boolean
}

type OrbitPoint = {
  y: number
}

type OrbitPosition = {
  x: number
  y: number
}

type OrbitRange = {
  startRatio: number
  endRatio: number
}

type OrbitLayout = {
  height: number
  positions: OrbitPosition[]
}

const ORBIT_VIEWBOX_WIDTH = 96
const ORBIT_VIEWBOX_HEIGHT = 560
const DEFAULT_ORBIT_HEIGHT = 544
const DEFAULT_ITEM_HEIGHT = 96
const MIN_ITEM_GAP = 48
const ORBIT_INDICATOR_RADIUS = 14
const ORBIT_REPEL_DISTANCE = 18
const ORBIT_REPEL_FALLOFF = 0.58

const MIDDLE_ORBIT_RANGE: OrbitRange = {
  startRatio: 0.08,
  endRatio: 0.88,
}

const RIGHT_ORBIT_RANGE: OrbitRange = {
  startRatio: 0.14,
  endRatio: 0.84,
}

const hasLayoutChanged = (current: OrbitLayout, next: OrbitLayout) => {
  if (Math.abs(current.height - next.height) > 0.5) {
    return true
  }

  if (current.positions.length !== next.positions.length) {
    return true
  }

  return current.positions.some((position, index) => {
    const nextPosition = next.positions[index]

    return (
      Math.abs(position.x - nextPosition.x) > 0.5 ||
      Math.abs(position.y - nextPosition.y) > 0.5
    )
  })
}

const getPointAtY = (
  path: SVGPathElement,
  length: number,
  targetY: number,
): DOMPoint => {
  let lower = 0
  let upper = length

  for (let index = 0; index < 24; index += 1) {
    const midpoint = (lower + upper) / 2
    const point = path.getPointAtLength(midpoint)

    if (point.y < targetY) {
      lower = midpoint
    } else {
      upper = midpoint
    }
  }

  return path.getPointAtLength((lower + upper) / 2)
}

const getOrbitPoints = ({
  hoveredIndex,
  itemHeights,
  path,
  pathLength,
  range,
  width,
}: {
  hoveredIndex?: number | null
  itemHeights: number[]
  path: SVGPathElement
  pathLength: number
  range: OrbitRange
  width: number
}): OrbitLayout => {
  const itemCount = itemHeights.length

  if (itemCount === 0) {
    return {
      height: DEFAULT_ORBIT_HEIGHT,
      positions: [],
    }
  }

  const travelByContent =
    itemHeights
      .slice(0, -1)
      .reduce((total, itemHeight) => total + itemHeight, 0) +
    MIN_ITEM_GAP * Math.max(0, itemCount - 1)
  const ratioTravel = range.endRatio - range.startRatio
  const lastItemHeight = itemHeights[itemHeights.length - 1] ?? DEFAULT_ITEM_HEIGHT

  const height = Math.max(
    DEFAULT_ORBIT_HEIGHT,
    travelByContent / ratioTravel,
    (travelByContent + lastItemHeight - ORBIT_INDICATOR_RADIUS) /
      (1 - range.startRatio),
  )
  const gap =
    itemCount > 1
      ? Math.max(
          MIN_ITEM_GAP,
          (height * ratioTravel -
            itemHeights
              .slice(0, -1)
              .reduce((total, itemHeight) => total + itemHeight, 0)) /
            (itemCount - 1),
        )
      : 0

  let y = height * range.startRatio
  const points: OrbitPoint[] = itemHeights.map((itemHeight) => {
    const point = { y }

    y += itemHeight + gap

    return point
  })

  return {
    height,
    positions: points.map((point, index) => {
      const hoverOffset =
        hoveredIndex === null ||
        hoveredIndex === undefined ||
        hoveredIndex === index
          ? 0
          : (index < hoveredIndex ? -1 : 1) *
            ORBIT_REPEL_DISTANCE *
            ORBIT_REPEL_FALLOFF ** (Math.abs(index - hoveredIndex) - 1)
      const targetY = Math.min(height, Math.max(0, point.y + hoverOffset))
      const viewBoxY = (targetY / height) * ORBIT_VIEWBOX_HEIGHT
      const pathPoint = getPointAtY(path, pathLength, viewBoxY)

      return {
        x: (pathPoint.x / ORBIT_VIEWBOX_WIDTH) * width,
        y: targetY,
      }
    }),
  }
}

function DirectionOrbitItem({
  isActive,
  item,
  itemRef,
  number,
  onHoverEnd,
  onHoverStart,
  position,
}: {
  isActive: boolean
  item: DirectionItem
  itemRef: (node: HTMLLIElement | null) => void
  number: number
  onHoverEnd: () => void
  onHoverStart: () => void
  position?: OrbitPosition
}) {
  const { t } = useTranslation("directions")

  return (
    <li
      ref={itemRef}
      className="relative z-10 grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-3 lg:absolute lg:left-[var(--orbit-x)] lg:top-[var(--orbit-y)] lg:min-h-[5.25rem] lg:w-[calc(100%-4.5rem)] lg:-translate-x-3.5 lg:-translate-y-3.5 lg:gap-4 lg:transition-[left,top] lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)]"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={
        position
          ? ({
              "--orbit-x": `${position.x}px`,
              "--orbit-y": `${position.y}px`,
            } as CSSProperties)
          : undefined
      }
    >
      <div className="relative h-full pt-1">
        <span
          className={cn(
            "relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-white/70 text-[0.6875rem] font-normal leading-none text-black/70 shadow-sm shadow-black/10 backdrop-blur-md transition-[background-color,border-color,box-shadow,color,filter] duration-500 dark:border-white/30 dark:bg-white/14 dark:text-white/78",
            isActive &&
              "border-cyan-100/90 bg-white/92 text-black/82 shadow-[0_0_18px_rgb(125_211_252_/_0.38),0_0_42px_rgb(216_180_254_/_0.18)] dark:border-cyan-100/58 dark:bg-white/22 dark:text-white dark:shadow-[0_0_18px_rgb(125_211_252_/_0.28),0_0_42px_rgb(216_180_254_/_0.16)]",
          )}
        >
          {String(number).padStart(2, "0")}
        </span>
      </div>

      <div className="pt-1">
        <h3 className="text-base font-normal leading-tight tracking-tight text-tone-1 sm:text-[1.0625rem]">
          {t(`items.${item.id}.title`)}
        </h3>
        <p className="mt-1.5 text-[0.8125rem] font-normal leading-snug text-tone-2 sm:text-[0.875rem]">
          {t(`items.${item.id}.summary`)}
        </p>
      </div>
    </li>
  )
}

function DirectionOrbitColumn({
  activeItemId,
  items,
  guidePath,
  onActiveItemChange,
  range,
}: {
  activeItemId: string | null
  items: DirectionItem[]
  guidePath: string
  onActiveItemChange: (itemId: string | null) => void
  range: OrbitRange
}) {
  const directions = directionsData as DirectionItem[]
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  const [layout, setLayout] = useState<OrbitLayout>({
    height: DEFAULT_ORBIT_HEIGHT,
    positions: [],
  })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    const svg = svgRef.current
    const path = pathRef.current
    let frameId: number | undefined

    if (!svg || !path) {
      return undefined
    }

    const updateLayout = () => {
      const { width } = svg.getBoundingClientRect()

      if (width === 0) {
        setLayout((current) =>
          current.positions.length > 0
            ? { ...current, positions: [] }
            : current,
        )
        return
      }

      const length = path.getTotalLength()
      const itemHeights = items.map((_, index) => {
        const measuredHeight = itemRefs.current[index]?.getBoundingClientRect().height

        return measuredHeight && measuredHeight > 0
          ? measuredHeight
          : DEFAULT_ITEM_HEIGHT
      })
      const nextLayout = getOrbitPoints({
        hoveredIndex,
        itemHeights,
        path,
        pathLength: length,
        range,
        width,
      })

      setLayout((current) =>
        hasLayoutChanged(current, nextLayout) ? nextLayout : current,
      )
    }

    const scheduleUpdate = () => {
      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId)
      }

      frameId = window.requestAnimationFrame(updateLayout)
    }

    scheduleUpdate()

    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(svg)
    itemRefs.current.forEach((itemElement) => {
      if (itemElement) {
        resizeObserver.observe(itemElement)
      }
    })

    return () => {
      if (frameId !== undefined) {
        window.cancelAnimationFrame(frameId)
      }
      resizeObserver.disconnect()
    }
  }, [hoveredIndex, items, range])

  return (
    <ol
      className="relative z-10 flex min-h-0 flex-col gap-7 py-2 lg:block lg:h-[var(--orbit-height)] lg:py-0 lg:transition-[height] lg:duration-700 lg:ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={
        {
          "--orbit-height": `${layout.height}px`,
        } as CSSProperties
      }
    >
      <svg
        ref={svgRef}
        className="pointer-events-none absolute inset-y-0 left-0 z-0 hidden h-full w-24 text-foreground/18 dark:text-white/18 lg:block"
        viewBox="0 0 96 560"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={guidePath}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.35"
        />
      </svg>

      {items.map((item, index) => {
        const originalIndex = directions.findIndex((entry) => entry.id === item.id)

        return (
          <DirectionOrbitItem
            key={item.id}
            item={item}
            itemRef={(node) => {
              itemRefs.current[index] = node
            }}
            isActive={activeItemId === item.id}
            number={originalIndex + 1}
            onHoverEnd={() => {
              setHoveredIndex(null)
              onActiveItemChange(null)
            }}
            onHoverStart={() => {
              setHoveredIndex(index)
              onActiveItemChange(item.id)
            }}
            position={layout.positions[index]}
          />
        )
      })}
    </ol>
  )
}

function StarMotif({ isActive }: { isActive: boolean }) {
  return (
    <div
      className={cn(
        "interest-star-motif relative mt-3 h-44 w-44 sm:h-52 sm:w-52 lg:mt-10",
        isActive && "is-active",
      )}
      aria-hidden="true"
    >
      <div className="interest-star-glow absolute inset-8 rounded-full bg-cyan-100/28 blur-3xl dark:bg-cyan-200/10" />
      <img
        src="/assets/interests/prismatic-star.png"
        alt=""
        className="interest-star-image relative h-full w-full select-none object-contain drop-shadow-[0_18px_26px_rgba(15,23,42,0.18)]"
        decoding="async"
        draggable={false}
        aria-hidden="true"
      />
    </div>
  )
}

export function DirectionsSection() {
  const { t } = useTranslation("directions")
  const directions = directionsData as DirectionItem[]
  const [activeDirectionId, setActiveDirectionId] = useState<string | null>(null)

  if (directions.length === 0) {
    return null
  }

  const middleDirections = directions.slice(0, 4)
  const rightDirections = directions.slice(4)

  return (
    <section className="grid min-h-[calc(100svh-8rem)] w-full items-center py-10 sm:py-12">
      <div className="relative grid gap-10 lg:grid-cols-[minmax(15rem,0.82fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-8 xl:gap-12">
        <div className="relative z-10 flex max-w-xl flex-col lg:-translate-y-12 xl:-translate-y-14">
          <p className="text-[0.6875rem] font-normal uppercase tracking-[0.22em] text-tone-5">
            Field
          </p>
          <h2 className="mt-3 text-3xl font-normal tracking-tight text-tone-1 md:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-sm text-sm font-normal leading-relaxed text-tone-4">
            {t("subtitle")}
          </p>
          <StarMotif isActive={activeDirectionId !== null} />
        </div>

        <DirectionOrbitColumn
          activeItemId={activeDirectionId}
          items={middleDirections}
          guidePath="M8 -10 C94 118 96 392 36 570"
          onActiveItemChange={setActiveDirectionId}
          range={MIDDLE_ORBIT_RANGE}
        />

        <div className="relative z-10 lg:pt-14">
          <DirectionOrbitColumn
            activeItemId={activeDirectionId}
            items={rightDirections}
            guidePath="M31 -10 C76 140 78 392 44 570"
            onActiveItemChange={setActiveDirectionId}
            range={RIGHT_ORBIT_RANGE}
          />
        </div>
      </div>
    </section>
  )
}

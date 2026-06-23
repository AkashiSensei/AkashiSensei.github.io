import {
  Children,
  cloneElement,
  createRef,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react"
import gsap from "gsap"

import { cn } from "@/lib/utils"

import "./CardSwap.css"

type CardProps = HTMLAttributes<HTMLDivElement> & {
  customClass?: string
}

type CardSwapProps = {
  activeIndex?: number
  cardDistance?: number
  children: ReactNode
  className?: string
  delay?: number
  dropDistance?: number
  easing?: "elastic" | "linear"
  height?: CSSProperties["height"]
  onActiveIndexChange?: (idx: number) => void
  onCardClick?: (idx: number) => void
  pauseOnHover?: boolean
  skewAmount?: number
  verticalDistance?: number
  width?: CSSProperties["width"]
}

type CardSwapChild = ReactElement<
  HTMLAttributes<HTMLDivElement> & {
    ref?: RefObject<HTMLDivElement | null>
  }
>

const DEFAULT_DROP_DISTANCE = 500

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, customClass, ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className={cn("card-swap-card", customClass, className)}
    />
  ),
)
Card.displayName = "Card"

function makeSlot(index: number, distX: number, distY: number, total: number) {
  return {
    x: index * distX,
    y: -index * distY,
    z: -index * distX * 1.5,
    zIndex: total - index,
  }
}

function placeNow(
  element: HTMLDivElement | null,
  slot: ReturnType<typeof makeSlot>,
  skew: number,
) {
  if (!element) {
    return
  }

  gsap.set(element, {
    force3D: true,
    skewY: skew,
    transformOrigin: "center center",
    x: slot.x,
    xPercent: -50,
    y: slot.y,
    yPercent: -50,
    z: slot.z,
    zIndex: slot.zIndex,
  })
}

function getAnimationConfig(easing: CardSwapProps["easing"]) {
  return easing === "elastic"
    ? {
        durDrop: 2,
        durMove: 2,
        durReturn: 2,
        ease: "elastic.out(0.6,0.9)",
        promoteOverlap: 0.9,
        returnDelay: 0.05,
      }
    : {
        durDrop: 0.8,
        durMove: 0.8,
        durReturn: 0.8,
        ease: "power1.inOut",
        promoteOverlap: 0.45,
        returnDelay: 0.2,
      }
}

function getReducedMotionPreference() {
  return typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export default function CardSwap({
  activeIndex,
  cardDistance = 60,
  children,
  className,
  delay = 5000,
  dropDistance = DEFAULT_DROP_DISTANCE,
  easing = "elastic",
  height = 400,
  onActiveIndexChange,
  onCardClick,
  pauseOnHover = false,
  skewAmount = 6,
  verticalDistance = 70,
  width = 500,
}: CardSwapProps) {
  const childArr = useMemo(() => Children.toArray(children), [children])
  const refs = useMemo(
    () => childArr.map(() => createRef<HTMLDivElement>()),
    // Card refs only need to be recreated when the number of cards changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length],
  )
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i))
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const intervalRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const announcedActiveIndexRef = useRef<number | null>(null)
  const config = useMemo(() => getAnimationConfig(easing), [easing])

  const placeCurrentOrder = useCallback(() => {
    order.current.forEach((childIndex, slotIndex) => {
      placeNow(
        refs[childIndex]?.current ?? null,
        makeSlot(slotIndex, cardDistance, verticalDistance, refs.length),
        skewAmount,
      )
    })
  }, [cardDistance, refs, skewAmount, verticalDistance])

  const syncActiveIndex = useCallback((nextActiveIndex: number) => {
    if (
      nextActiveIndex < 0
      || nextActiveIndex >= order.current.length
      || order.current[0] === nextActiveIndex
    ) {
      return
    }

    timelineRef.current?.kill()
    timelineRef.current = null
    announcedActiveIndexRef.current = null
    order.current = [
      nextActiveIndex,
      ...order.current.filter((index) => index !== nextActiveIndex),
    ]
    placeCurrentOrder()
  }, [placeCurrentOrder])

  const swap = useCallback(() => {
    if (order.current.length < 2) {
      return
    }

    const [front, ...rest] = order.current
    const frontElement = refs[front]?.current

    if (!frontElement || getReducedMotionPreference()) {
      order.current = [...rest, front]
      placeCurrentOrder()
      onActiveIndexChange?.(order.current[0])
      return
    }

    timelineRef.current?.kill()

    const timeline = gsap.timeline()
    timelineRef.current = timeline

    timeline.to(frontElement, {
      duration: config.durDrop,
      ease: config.ease,
      y: `+=${dropDistance}`,
    })

    timeline.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`)
    timeline.call(() => {
      const promotedIndex = rest[0]

      announcedActiveIndexRef.current = promotedIndex
      onActiveIndexChange?.(promotedIndex)
    }, undefined, "promote")
    rest.forEach((childIndex, slotIndex) => {
      const element = refs[childIndex]?.current
      const slot = makeSlot(slotIndex, cardDistance, verticalDistance, refs.length)

      if (!element) {
        return
      }

      timeline.set(element, { zIndex: slot.zIndex }, "promote")
      timeline.to(
        element,
        {
          duration: config.durMove,
          ease: config.ease,
          x: slot.x,
          y: slot.y,
          z: slot.z,
        },
        `promote+=${slotIndex * 0.15}`,
      )
    })

    const backSlot = makeSlot(
      refs.length - 1,
      cardDistance,
      verticalDistance,
      refs.length,
    )

    timeline.addLabel("return", `promote+=${config.durMove * config.returnDelay}`)
    timeline.call(() => {
      gsap.set(frontElement, { zIndex: backSlot.zIndex })
    }, undefined, "return")
    timeline.to(
      frontElement,
      {
        duration: config.durReturn,
        ease: config.ease,
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
      },
      "return",
    )
    timeline.call(() => {
      order.current = [...rest, front]

      if (announcedActiveIndexRef.current === order.current[0]) {
        announcedActiveIndexRef.current = null
      }
    })
  }, [
    cardDistance,
    config.durDrop,
    config.durMove,
    config.durReturn,
    config.ease,
    config.promoteOverlap,
    config.returnDelay,
    dropDistance,
    onActiveIndexChange,
    placeCurrentOrder,
    refs,
    verticalDistance,
  ])

  useEffect(() => {
    placeCurrentOrder()

    return () => {
      timelineRef.current?.kill()
    }
  }, [placeCurrentOrder])

  useEffect(() => {
    if (typeof activeIndex !== "number") {
      return
    }

    if (activeIndex === announcedActiveIndexRef.current) {
      return
    }

    syncActiveIndex(activeIndex)
  }, [activeIndex, syncActiveIndex])

  useEffect(() => {
    if (childArr.length < 2 || getReducedMotionPreference()) {
      return undefined
    }

    intervalRef.current = window.setInterval(swap, delay)

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [childArr.length, delay, swap])

  useEffect(() => {
    if (!pauseOnHover) {
      return undefined
    }

    const node = containerRef.current

    if (!node) {
      return undefined
    }

    const pause = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return
      }

      timelineRef.current?.pause()

      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    const resume = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return
      }

      timelineRef.current?.play()

      if (intervalRef.current === null && childArr.length > 1) {
        intervalRef.current = window.setInterval(swap, delay)
      }
    }

    node.addEventListener("pointerenter", pause)
    node.addEventListener("pointerleave", resume)

    return () => {
      node.removeEventListener("pointerenter", pause)
      node.removeEventListener("pointerleave", resume)
    }
  }, [childArr.length, delay, pauseOnHover, swap])

  const rendered = childArr.map((child, index) => {
    if (!isValidElement(child)) {
      return child
    }

    const childElement = child as CardSwapChild

    return cloneElement(childElement, {
      key: index,
      ref: refs[index],
      style: {
        height,
        width,
        ...(childElement.props.style ?? {}),
      },
      onClick: (event: ReactMouseEvent<HTMLDivElement>) => {
        childElement.props.onClick?.(event)
        onCardClick?.(index)
      },
    })
  })

  return (
    <div
      ref={containerRef}
      className={cn("card-swap-container", className)}
      style={{ height, width }}
    >
      {rendered}
    </div>
  )
}

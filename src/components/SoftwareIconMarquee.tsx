import { useEffect, useRef, useState, type CSSProperties } from "react"

import { type WorkbenchSoftware } from "@/data/workbench"
import { cn } from "@/lib/utils"

export function SoftwareIconMarquee({ software }: { software: WorkbenchSoftware[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const cycleRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState({ cycles: 2, distance: 0 })

  useEffect(() => {
    const viewport = viewportRef.current
    const cycle = cycleRef.current
    if (!viewport || !cycle) return

    const measure = () => {
      const distance = cycle.getBoundingClientRect().width
      if (distance <= 0) return
      // Fill the viewport plus one whole cycle to cover the outgoing icons.
      const cycles = Math.max(2, Math.ceil(viewport.clientWidth / distance) + 1)
      setLayout((current) => current.cycles === cycles && current.distance === distance
        ? current
        : { cycles, distance })
    }

    const frame = requestAnimationFrame(measure)
    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(cycle)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [software.length])

  return (
    <div
      ref={viewportRef}
      className="software-icon-marquee -mx-1 min-w-0 shrink-0 overflow-hidden py-1"
      style={{
        "--software-icon-marquee-duration": `${Math.max(14, software.length * 3.4)}s`,
        "--software-icon-marquee-distance": `${-layout.distance}px`,
      } as CSSProperties}
    >
      <div className="software-icon-marquee-track flex w-max">
        {Array.from({ length: layout.cycles }, (_, cycleIndex) => (
          <div
            key={cycleIndex}
            ref={cycleIndex === 0 ? cycleRef : undefined}
            className="flex shrink-0 gap-3 pr-3"
            aria-hidden={cycleIndex > 0 ? true : undefined}
          >
            {software.map((item) => (
              <div key={item.id} title={item.name} className="shrink-0 transition-transform hover:-translate-y-0.5">
                <img
                  src={item.icon}
                  alt={cycleIndex === 0 ? item.name : ""}
                  className={cn(
                    "h-11 w-11 object-contain drop-shadow-sm",
                    item.id === "solidworks" && "dark:drop-shadow-[0_0_14px_rgb(255_255_255_/_0.62)]",
                  )}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

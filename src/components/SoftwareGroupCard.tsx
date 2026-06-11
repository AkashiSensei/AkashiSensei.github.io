import { type CSSProperties } from "react"
import { Ellipsis } from "lucide-react"
import { useTranslation } from "react-i18next"

import { FeaturePointList } from "@/components/FeaturePointList"
import { GlassPanel } from "@/components/GlassPanel"
import { type WorkbenchGroup } from "@/data/workbench"
import { cn } from "@/lib/utils"

type SoftwareGroupCardProps = {
  group: WorkbenchGroup
  className?: string
  variant?: "compact" | "full"
}

export function SoftwareGroupCard({
  group,
  className,
  variant = "full",
}: SoftwareGroupCardProps) {
  const { t } = useTranslation("workbench")
  const points = t(`items.${group.id}.points`, { returnObjects: true }) as string[]
  const visiblePoints = variant === "compact" ? points.slice(0, 5) : points
  const hiddenPointCount = points.length - visiblePoints.length
  const marqueeDuration = `${Math.max(14, group.software.length * 3.4)}s`

  return (
    <GlassPanel
      className={cn(
        "flex h-full max-h-[28rem] flex-col gap-4 p-4 transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.70)] dark:hover:bg-white/10",
        className,
      )}
    >
      <h3 className="shrink-0 text-xl font-bold leading-tight text-foreground/90">
        {t(`items.${group.id}.title`)}
      </h3>

      <div
        className="software-icon-marquee -mx-1 min-w-0 shrink-0 overflow-hidden py-1"
        style={
          {
            "--software-icon-marquee-duration": marqueeDuration,
          } as CSSProperties
        }
      >
        <div className="software-icon-marquee-track flex w-max gap-3 pr-3">
          {[0, 1].map((cycleIndex) =>
            group.software.map((software) => (
              <div
                key={`${cycleIndex}-${software.id}`}
                title={software.name}
                className="shrink-0 transition-transform hover:-translate-y-0.5"
                aria-hidden={cycleIndex === 1}
              >
                <img
                  src={software.icon}
                  alt={cycleIndex === 0 ? software.name : ""}
                  className="h-11 w-11 object-contain drop-shadow-sm"
                  loading="lazy"
                />
              </div>
            )),
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex flex-1 min-h-0 flex-col gap-2.5",
          variant === "full" &&
            "overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/90">
          {t(`items.${group.id}.summary`)}
        </p>

        <FeaturePointList
          points={visiblePoints}
          highlightedIndexes={group.highlightPointIndexes}
        />

        {hiddenPointCount > 0 ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground/55 dark:text-foreground/65">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-foreground/15 to-foreground/10 dark:via-foreground/20 dark:to-foreground/10" />
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.45)] bg-[rgb(var(--site-surface-rgb)_/_0.38)] px-2.5 py-1 shadow-sm shadow-black/5 dark:border-white/10 dark:bg-white/[0.06]">
              <Ellipsis className="h-3.5 w-3.5" />
              {t("morePoints", { count: hiddenPointCount })}
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-foreground/15 to-foreground/10 dark:via-foreground/20 dark:to-foreground/10" />
          </div>
        ) : null}
      </div>
    </GlassPanel>
  )
}

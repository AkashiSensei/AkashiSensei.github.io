import { useTranslation } from "react-i18next"

import { FeaturePointList } from "@/components/FeaturePointList"
import { GlassPanel } from "@/components/GlassPanel"
import { type WorkbenchGroup } from "@/data/workbench"
import { cn } from "@/lib/utils"

type SoftwareGroupCardProps = {
  group: WorkbenchGroup
  className?: string
}

export function SoftwareGroupCard({ group, className }: SoftwareGroupCardProps) {
  const { t } = useTranslation("workbench")
  const points = t(`items.${group.id}.points`, { returnObjects: true }) as string[]

  return (
    <GlassPanel
      className={cn(
        "flex h-full max-h-[28rem] flex-col gap-4 p-4 transition-colors hover:bg-white/55 dark:hover:bg-white/10",
        className,
      )}
    >
      <h3 className="shrink-0 text-xl font-bold leading-tight text-foreground/90">
        {t(`items.${group.id}.title`)}
      </h3>

      <div className="shrink-0 min-w-0 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {group.software.map((software) => (
          <div
            key={software.id}
            title={software.name}
            className="shrink-0 transition-transform hover:-translate-y-0.5"
          >
            <img
              src={software.icon}
              alt={software.name}
              className="h-11 w-11 object-contain drop-shadow-sm"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-1 min-h-0 flex-col gap-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/90">
          {t(`items.${group.id}.summary`)}
        </p>

        <FeaturePointList
          points={points}
          highlightedIndexes={group.highlightPointIndexes}
        />
      </div>
    </GlassPanel>
  )
}

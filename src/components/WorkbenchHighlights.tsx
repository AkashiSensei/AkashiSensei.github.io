import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { cn } from "@/lib/utils"
import { featuredWorkbenchGroups } from "@/data/workbench"
import { GlassPanel } from "@/components/GlassPanel"
import { SoftwareGroupCard } from "@/components/SoftwareGroupCard"

export function WorkbenchHighlights() {
  const { t } = useTranslation("workbench")

  if (featuredWorkbenchGroups.length === 0) {
    return null
  }

  return (
    <section id="workbench" className="flex w-full max-w-5xl flex-col gap-3 pt-2 sm:pt-4">
      <div className="flex flex-col gap-1.5 px-2 sm:px-4">
        <AppLink to="/workbench" className="group flex w-fit items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <ArrowRight className="h-8 w-8 text-foreground/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground/80 md:h-10 md:w-10" />
        </AppLink>
        <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/90 sm:text-base">
          {t("subtitle")}
        </p>
      </div>

      <div className="relative left-1/2 flex w-screen -translate-x-1/2 snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 scroll-px-6 sm:px-[max(1.5rem,calc((100vw-64rem)/2+1rem))] sm:scroll-px-[max(1.5rem,calc((100vw-64rem)/2+1rem))]">
        {featuredWorkbenchGroups.map((group) => (
          <SoftwareGroupCard
            key={group.id}
            group={group}
            variant="compact"
            className="w-[calc(100vw-3rem)] shrink-0 snap-start sm:w-[min(calc((100vw-3rem-0.75rem)/2),calc((64rem-2rem-0.75rem)/2))]"
          />
        ))}
        <ViewAllCard className="w-44 shrink-0 snap-start" />
      </div>
    </section>
  )
}

function ViewAllCard({ className }: { className?: string }) {
  const { t } = useTranslation("workbench")

  return (
    <AppLink to="/workbench" className={cn("block h-full group", className)} aria-label={t("viewAllTitle")}>
      <GlassPanel className="flex h-full max-h-[28rem] flex-col items-start gap-4 p-4 transition-colors hover:bg-white/55 dark:hover:bg-white/10">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-foreground/60 dark:text-foreground/70">
            {t("viewAll")}
          </span>
          <h3 className="text-xl font-bold leading-snug text-foreground/90">
            {t("viewAllTitle")}
          </h3>
          <p className="text-sm leading-relaxed text-foreground/75 dark:text-foreground/85">
            {t("viewAllDescription")}
          </p>
        </div>
        <ArrowRight className="h-7 w-7 text-foreground/40 group-hover:text-foreground/80 group-hover:translate-x-1 transition-all duration-300" />
      </GlassPanel>
    </AppLink>
  )
}

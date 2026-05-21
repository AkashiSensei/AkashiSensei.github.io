import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { GlassPanel } from "@/components/GlassPanel"
import { ProjectCard } from "@/components/ProjectCard"
import { featuredProjects } from "@/data/projects"
import { cn } from "@/lib/utils"

export function ProjectHighlights() {
  const { t } = useTranslation("projects")

  if (featuredProjects.length === 0) {
    return null
  }

  return (
    <section id="projects" className="flex w-full max-w-5xl flex-col gap-3 pt-2 sm:pt-4">
      <div className="flex flex-col gap-1.5 px-2 sm:px-4">
        <AppLink to="/projects" className="group flex w-fit items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <ArrowRight className="h-8 w-8 text-foreground/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground/80 md:h-10 md:w-10" />
        </AppLink>
        <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/90 sm:text-base">
          {t("subtitle")}
        </p>
      </div>

      <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 scroll-px-6 sm:mx-0 sm:px-0 sm:scroll-px-0">
        {featuredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            className="w-full shrink-0 snap-start sm:w-[calc(50%-0.375rem)]"
          />
        ))}
        <ViewAllCard className="w-[55vw] shrink-0 snap-start sm:w-[12rem] lg:w-[8.5rem]" />
      </div>
    </section>
  )
}

function ViewAllCard({ className }: { className?: string }) {
  const { t } = useTranslation("projects")

  return (
    <AppLink
      to="/projects"
      className={cn("block h-full group", className)}
      aria-label={t("viewAllTitle")}
    >
      <GlassPanel className="flex h-full flex-col items-start gap-4 p-4 transition-colors hover:bg-white/55 dark:hover:bg-white/10">
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
        <ArrowRight className="h-7 w-7 text-foreground/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground/80" />
      </GlassPanel>
    </AppLink>
  )
}

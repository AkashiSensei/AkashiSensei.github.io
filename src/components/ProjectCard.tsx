import { ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"

import { GlassPanel } from "@/components/GlassPanel"
import { type Project } from "@/data/projects"
import { cn } from "@/lib/utils"

type ProjectCardProps = {
  project: Project
  className?: string
  variant?: "compact" | "full"
}

export function ProjectCard({
  project,
  className,
  variant = "compact",
}: ProjectCardProps) {
  const { t } = useTranslation("projects")
  const points = t(`items.${project.id}.points`, { returnObjects: true }) as string[]
  const visiblePoints = variant === "compact" ? points.slice(0, 3) : points
  const hasScreenshot = Boolean(project.screenshot)
  const heightLimit =
    variant === "full"
      ? hasScreenshot
        ? "max-h-[48rem]"
        : "max-h-[40rem]"
      : hasScreenshot
        ? "max-h-[42rem]"
        : "max-h-[34rem]"

  return (
    <GlassPanel
      className={cn(
        "group flex h-full min-h-0 flex-col overflow-hidden transition-colors hover:bg-white/55 dark:hover:bg-white/10",
        heightLimit,
        className,
      )}
    >
      {project.screenshot ? (
        <img
          src={project.screenshot.src}
          alt={t(project.screenshot.altKey)}
          loading="lazy"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex shrink-0 items-start gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold leading-tight text-foreground/90">
              {t(`items.${project.id}.title`)}
            </h3>
            <p className="mt-1 break-words text-sm leading-snug text-foreground/60 dark:text-foreground/70">
              {project.repoName}
            </p>
          </div>

          {project.externalUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t("repoLabel")}: ${project.repoName}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/45 transition-colors hover:bg-foreground/10 hover:text-foreground/85"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.status?.map((status) => (
            <span
              key={status}
              className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-xs font-medium text-foreground/65 dark:bg-white/10 dark:text-foreground/75"
            >
              {t(`status.${status}`)}
            </span>
          ))}
        </div>

        <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/90">
          {t(`items.${project.id}.summary`)}
        </p>

        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-foreground/75 dark:text-foreground/85">
          {visiblePoints.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40 dark:bg-foreground/50" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/45 bg-white/25 px-2.5 py-1 text-xs font-medium text-foreground/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>

        {variant === "full" && project.links ? (
          <div className="flex flex-wrap gap-2 border-t border-foreground/10 pt-3">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-foreground/[0.06] px-3 py-1.5 text-xs font-semibold text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                {link.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </GlassPanel>
  )
}

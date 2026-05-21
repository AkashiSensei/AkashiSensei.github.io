import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { FeaturePointList } from "@/components/FeaturePointList"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { GlassPanel } from "@/components/GlassPanel"
import { type SmallTool } from "@/data/tools"
import { cn } from "@/lib/utils"

type SmallToolCardProps = {
  tool: SmallTool
  className?: string
}

export function SmallToolCard({ tool, className }: SmallToolCardProps) {
  const { t } = useTranslation("tools")
  const points = t(`items.${tool.id}.points`, { returnObjects: true }) as string[]

  return (
    <GlassPanel
      className={cn(
        "flex h-full flex-col overflow-hidden transition-colors hover:bg-white/55 dark:hover:bg-white/10",
        tool.screenshot ? "max-h-[44rem]" : "max-h-[32rem]",
        className,
      )}
    >
      {tool.screenshot ? (
        <img
          src={tool.screenshot.src}
          alt={tool.screenshot.alt}
          className="aspect-[16/9] w-full shrink-0 object-cover"
          loading="lazy"
        />
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <div className="flex shrink-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/40 bg-white/35 px-2.5 py-1 text-xs font-semibold text-foreground/65 dark:border-white/10 dark:bg-white/5 dark:text-foreground/75">
              {t(`labels.${tool.role}`)}
            </span>
            {tool.archived ? (
              <span className="rounded-full border border-white/40 bg-white/35 px-2.5 py-1 text-xs font-semibold text-foreground/65 dark:border-white/10 dark:bg-white/5 dark:text-foreground/75">
                {t("labels.archived")}
              </span>
            ) : null}
            {tool.status ? (
              <span className="rounded-full border border-white/40 bg-white/35 px-2.5 py-1 text-xs font-semibold text-foreground/65 dark:border-white/10 dark:bg-white/5 dark:text-foreground/75">
                {t(`labels.${tool.status}`)}
              </span>
            ) : null}
          </div>

          <h3 className="text-xl font-bold leading-tight text-foreground/90">
            {t(`items.${tool.id}.title`)}
          </h3>

          {tool.repoUrl && tool.repoName ? (
            <a
              href={tool.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="group/repo inline-flex min-w-0 w-fit max-w-full items-center gap-1.5 text-sm font-semibold text-foreground/60 transition-colors hover:text-foreground/90 dark:text-foreground/75 dark:hover:text-foreground"
            >
              <span className="min-w-0 truncate">{tool.repoName}</span>
              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5" />
              <GitHubRepoStats repo={tool.githubRepo} />
            </a>
          ) : (
            <span className="inline-flex min-w-0 w-fit max-w-full text-sm font-semibold text-foreground/60 dark:text-foreground/75">
              {tool.repoName ?? t("labels.privateTool")}
            </span>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <p className="text-sm leading-relaxed text-foreground/80 dark:text-foreground/90">
            {t(`items.${tool.id}.summary`)}
          </p>

          <FeaturePointList
            points={points}
            highlightedIndexes={tool.highlightPointIndexes}
          />
        </div>
      </div>
    </GlassPanel>
  )
}

import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { FeaturePointList } from "@/components/FeaturePointList"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { GlassPanel } from "@/components/GlassPanel"
import { SmallToolImageGallery } from "@/components/SmallToolImageGallery"
import { type SmallTool } from "@/data/tools"
import { cn } from "@/lib/utils"

type SmallToolCardProps = {
  tool: SmallTool
  className?: string
}

const roleClassName = {
  author:
    "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-300/15 dark:text-emerald-200",
  contributor:
    "border-sky-300/60 bg-sky-100/70 text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/15 dark:text-sky-200",
} satisfies Record<SmallTool["role"], string>

export function SmallToolCard({ tool, className }: SmallToolCardProps) {
  const { t } = useTranslation("tools")
  const points = t(`items.${tool.id}.points`, { returnObjects: true }) as string[]
  const hasImages = Boolean(tool.screenshots?.length || tool.screenshot)

  return (
    <GlassPanel
      className={cn(
        "flex h-full flex-col overflow-hidden transition-colors hover:bg-white/55 dark:hover:bg-white/10",
        hasImages ? "max-h-[44rem]" : "max-h-[32rem]",
        className,
      )}
    >
      {tool.screenshots?.length ? (
        <SmallToolImageGallery images={tool.screenshots} />
      ) : tool.screenshot ? (
        <img
          src={tool.screenshot.src}
          alt={tool.screenshot.alt}
          className="aspect-[16/9] w-full object-cover"
          loading="lazy"
        />
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
        <div className="flex shrink-0 flex-col gap-3">
          <div className="flex items-center gap-2">
            <h3 className="min-w-0 text-xl font-bold leading-tight text-foreground/90">
              {t(`items.${tool.id}.title`)}
            </h3>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
                roleClassName[tool.role],
              )}
            >
              {t(`labels.${tool.role}`)}
            </span>
          </div>

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

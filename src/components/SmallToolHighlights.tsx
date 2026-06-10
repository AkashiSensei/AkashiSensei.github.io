import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { featuredSmallTools, type SmallTool } from "@/data/tools"
import { cn } from "@/lib/utils"

const roleToneClassName = {
  author: "text-emerald-700 dark:text-emerald-200",
  contributor: "text-sky-700 dark:text-sky-200",
} satisfies Record<SmallTool["role"], string>

export function SmallToolHighlights() {
  const { t } = useTranslation("tools")
  const tags = t("tags", { returnObjects: true }) as string[]
  const desktopToolColumns = [
    featuredSmallTools.filter((_, index) => index % 2 === 0),
    featuredSmallTools.filter((_, index) => index % 2 === 1),
  ]

  if (featuredSmallTools.length === 0) {
    return null
  }

  return (
    <section
      id="tools"
      className="grid min-h-[calc(100svh-8rem)] w-full items-center gap-8 py-10 sm:py-12 lg:grid-cols-[minmax(14rem,0.72fr)_minmax(0,1.28fr)] lg:gap-12 xl:gap-16"
    >
      <div className="flex max-w-xl flex-col gap-4 px-2 sm:px-3 md:px-4 lg:self-start lg:pt-[22svh] xl:pt-[21svh]">
        <div className="flex flex-col gap-2">
          <p className="text-[0.6875rem] font-normal uppercase tracking-[0.22em] text-tone-5">
            Utility
          </p>
          <h2 className="text-3xl font-normal leading-none tracking-tight text-tone-1 md:text-4xl">
            {t("title")}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-tone-3 sm:text-base">
            {t("subtitle")}
          </p>
          <p className="max-w-md text-sm leading-relaxed text-tone-4 sm:text-base">
            {t("description")}
          </p>
          <div className="flex max-w-md flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-tone-4/35 bg-surface/35 px-2.5 py-1 text-[0.75rem] font-normal leading-none text-tone-3 backdrop-blur-sm dark:bg-surface/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <AppLink
          to="/tools"
          className="group inline-flex w-fit items-center gap-1.5 text-[0.9375rem] font-normal leading-none text-tone-2 transition-colors hover:text-tone-1 sm:text-[1.0625rem]"
        >
          <span>{t("viewAll")}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-[1.125rem] sm:w-[1.125rem]" />
        </AppLink>
      </div>

      <div className="grid items-start gap-y-7 md:hidden">
        {featuredSmallTools.map((tool) => (
          <SmallToolLineItem key={tool.id} tool={tool} />
        ))}
      </div>

      <div className="hidden items-start gap-x-8 md:grid md:grid-cols-2 xl:gap-x-12">
        {desktopToolColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-10">
            {column.map((tool) => (
              <SmallToolLineItem key={tool.id} tool={tool} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function SmallToolLineItem({ tool }: { tool: SmallTool }) {
  const { t } = useTranslation(["tools", "common"])
  const detailPath = `/tools/${tool.id}`
  const statusLabel = tool.status ? t(`labels.${tool.status}`) : null

  return (
    <article className="grid grid-cols-[3px_minmax(0,1fr)] gap-4">
      <div className="h-full bg-tone-4 dark:bg-tone-3" aria-hidden="true" />
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] leading-none">
            <span className={cn("font-normal", roleToneClassName[tool.role])}>
              {t(`labels.${tool.role}`)}
            </span>
            {statusLabel ? <span className="text-tone-5">{statusLabel}</span> : null}
            {tool.archived ? (
              <span className="text-tone-5">{t("labels.archived")}</span>
            ) : null}
          </div>

          <h3 className="text-lg font-normal leading-tight tracking-tight text-tone-1 sm:text-xl">
            <AppLink to={detailPath} className="transition-colors hover:text-tone-1">
              {t(`items.${tool.id}.title`)}
            </AppLink>
          </h3>
        </div>

        <p className="text-[0.8125rem] font-normal leading-relaxed text-tone-4 sm:text-[0.875rem]">
          {t(`items.${tool.id}.summary`)}
        </p>

        <AppLink
          to={detailPath}
          className="group/detail inline-flex w-fit items-center gap-1.5 text-sm font-normal text-tone-2 transition-colors hover:text-tone-1"
        >
          {t("common:details.viewDetails")}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/detail:translate-x-0.5" />
        </AppLink>
      </div>
    </article>
  )
}

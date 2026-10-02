import { ArchiveSectionHeader, SectionNote } from "@/components/SectionHeader"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { featuredSmallTools, smallTools, type SmallTool } from "@/data/tools"
import { getSemanticTagClassName } from "@/lib/tag-styles"
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
      className="resume-rhythm-section small-tools-rhythm-section flex w-full flex-col justify-center gap-5"
    >
      <div className="small-tools-layout grid w-full content-start items-start gap-5 sm:gap-6 xl:grid-cols-[minmax(14rem,0.72fr)_minmax(0,1.28fr)] xl:gap-12">
        <div className="resume-feature-offset flex max-w-xl flex-col gap-4 xl:self-start">
          <ArchiveSectionHeader detailPath="/tools" title={t("title")} subtitle={t("subtitle")}
            viewAllLabel={t("viewAllWithCount", { count: smallTools.length })} />
          <SectionNote><p>{t("description")}</p></SectionNote>
          <div className="flex max-w-md flex-wrap gap-2 px-2 sm:px-3 md:px-4">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-tone-4/35 bg-surface/35 px-2.5 py-1 text-[0.75rem] font-normal leading-none text-tone-3 backdrop-blur-sm dark:bg-surface/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid items-start gap-y-7 px-2 sm:px-3 md:hidden">
          {featuredSmallTools.map((tool) => (
            <SmallToolLineItem key={tool.id} tool={tool} />
          ))}
        </div>

        <div className="small-tool-list-offset hidden items-start gap-x-8 px-4 md:grid md:grid-cols-2 xl:gap-x-10 xl:px-0">
          {desktopToolColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-7 xl:gap-8">
              {column.map((tool) => (
                <SmallToolLineItem key={tool.id} tool={tool} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function SmallToolLineItem({ tool }: { tool: SmallTool }) {
  const { t } = useTranslation(["tools", "common"])
  const detailPath = `/tools/${tool.id}`
  const statusLabel = tool.status ? t(`labels.${tool.status}`) : null

  return (
    <article className="detail-link-pair grid grid-cols-[3px_minmax(0,1fr)] gap-4 [--detail-link-active-color:var(--text-tone-1)]">
      <div className="h-full bg-tone-4 dark:bg-tone-3" aria-hidden="true" />
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs leading-none">
            <span className={cn("font-normal", roleToneClassName[tool.role])}>
              {t(`labels.${tool.role}`)}
            </span>
            {tool.repoTags?.map((repoTag) => (
              <span
                key={repoTag}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[0.625rem] leading-none",
                  getSemanticTagClassName(repoTag),
                )}
              >
                {t(`repoTags.${repoTag}`)}
              </span>
            ))}
            {statusLabel ? <span className="text-tone-5">{statusLabel}</span> : null}
            {tool.archived ? (
              <span className="text-tone-5">{t("labels.archived")}</span>
            ) : null}
          </div>

          <h3 className="text-card font-normal leading-tight tracking-tight text-tone-1">
            <AppLink
              to={detailPath}
              className="detail-link-trigger detail-link-emphasis transition-colors hover:text-tone-1"
            >
              {t(`items.${tool.id}.title`)}
            </AppLink>
          </h3>
        </div>

        <p className="text-sm font-body leading-relaxed text-tone-4 sm:text-sm">
          {t(`items.${tool.id}.summary`)}
        </p>

        <AppLink
          to={detailPath}
          className="detail-link-trigger detail-link-emphasis group/detail inline-flex w-fit items-center gap-1.5 text-sm font-normal text-tone-2 transition-colors hover:text-tone-1"
        >
          {t("common:details.viewDetails")}
          <ArrowRight className="detail-link-arrow h-4 w-4 transition-transform duration-300 group-hover/detail:translate-x-0.5" />
        </AppLink>
      </div>
    </article>
  )
}

import { useTranslation } from "react-i18next"

import { KnowledgeCard } from "@/components/KnowledgeCard"
import { ArchiveSectionHeader } from "@/components/ProjectHighlights"
import { featuredKnowledgeEntries } from "@/data/knowledge"

export function KnowledgeHighlights() {
  const { t } = useTranslation("knowledge")

  if (featuredKnowledgeEntries.length === 0) {
    return null
  }

  return (
    <section id="knowledge" className="flex min-h-[calc(100svh-8rem)] w-full flex-col justify-center gap-5 py-10 sm:py-12">
      <ArchiveSectionHeader
        detailPath="/knowledge"
        title={t("title")}
        subtitle={t("subtitle")}
        viewAllLabel={t("viewAll")}
      />

      <div className="grid items-stretch gap-5 md:grid-cols-3 md:gap-6 xl:gap-7">
        {featuredKnowledgeEntries.map((entry, index) => {
          const staggerOrder = index === 1 ? 0 : index === 0 ? 1 : 2

          return (
            <KnowledgeCard
              key={entry.id}
              entry={entry}
              imageAutoCycleStaggerIndex={staggerOrder}
              variant="compact"
              className="h-full min-h-[27rem]"
            />
          )
        })}
      </div>
    </section>
  )
}

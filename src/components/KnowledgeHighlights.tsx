import { useTranslation } from "react-i18next"

import { KnowledgeCard } from "@/components/KnowledgeCard"
import { ArchiveSectionHeader } from "@/components/SectionHeader"
import { featuredKnowledgeEntries, knowledgeEntries } from "@/data/knowledge"

export function KnowledgeHighlights() {
  const { t } = useTranslation("knowledge")

  if (featuredKnowledgeEntries.length === 0) {
    return null
  }

  return (
    <section id="knowledge" className="resume-rhythm-section flex h-auto w-full flex-col justify-center gap-5">
      <ArchiveSectionHeader
        detailPath="/knowledge"
        title={t("title")}
        subtitle={t("subtitle")}
        viewAllLabel={t("viewAllWithCount", { count: knowledgeEntries.length })}
      />

      <div className="grid items-start gap-5 md:grid-cols-3 md:gap-5 min-[1440px]:!gap-6">
        {featuredKnowledgeEntries.map((entry, index) => {
          const staggerOrder = index === 1 ? 0 : index === 0 ? 1 : 2

          return (
            <KnowledgeCard
              key={entry.id}
              entry={entry}
              imageAutoCycleStaggerIndex={staggerOrder}
              variant="compact"
            />
          )
        })}
      </div>
    </section>
  )
}

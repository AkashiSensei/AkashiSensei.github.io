import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { KnowledgeCard } from "@/components/KnowledgeCard"
import { ArchiveSectionHeader } from "@/components/ProjectHighlights"
import { featuredKnowledgeEntries, knowledgeEntries } from "@/data/knowledge"

export function KnowledgeHighlights() {
  const { t } = useTranslation("knowledge")
  const getVisibleEntryCount = () => {
    if (typeof window === "undefined") {
      return 3
    }

    return window.matchMedia("(min-width: 768px)").matches ? 3 : 2
  }
  const [visibleEntryCount, setVisibleEntryCount] = useState(getVisibleEntryCount)

  useEffect(() => {
    const updateVisibleEntryCount = () => {
      setVisibleEntryCount(getVisibleEntryCount())
    }

    updateVisibleEntryCount()
    window.addEventListener("resize", updateVisibleEntryCount)
    window.visualViewport?.addEventListener("resize", updateVisibleEntryCount)

    return () => {
      window.removeEventListener("resize", updateVisibleEntryCount)
      window.visualViewport?.removeEventListener(
        "resize",
        updateVisibleEntryCount,
      )
    }
  }, [])

  if (featuredKnowledgeEntries.length === 0) {
    return null
  }

  return (
    <section id="knowledge" className="resume-rhythm-section flex w-full flex-col justify-center gap-5">
      <ArchiveSectionHeader
        detailPath="/knowledge"
        title={t("title")}
        subtitle={t("subtitle")}
        viewAllLabel={t("viewAllWithCount", { count: knowledgeEntries.length })}
      />

      <div className="grid items-stretch gap-5 md:grid-cols-3 md:gap-5 min-[1440px]:!gap-6">
        {featuredKnowledgeEntries.slice(0, visibleEntryCount).map((entry, index) => {
          const staggerOrder = index === 1 ? 0 : index === 0 ? 1 : 2

          return (
            <KnowledgeCard
              key={entry.id}
              entry={entry}
              imageAutoCycleStaggerIndex={staggerOrder}
              variant="compact"
              className="h-full min-h-[24rem] sm:min-h-[25rem] md:min-h-[21rem] lg:min-h-[21.5rem] xl:min-h-[23rem] min-[1440px]:!min-h-[24rem]"
            />
          )
        })}
      </div>
    </section>
  )
}

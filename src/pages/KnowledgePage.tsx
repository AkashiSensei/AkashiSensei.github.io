import { useTranslation } from "react-i18next"

import { BackButton } from "@/components/BackButton"
import { KnowledgeGrid } from "@/components/KnowledgeGrid"
import { Layout } from "@/components/Layout"
import { knowledgeEntries } from "@/data/knowledge"

export function KnowledgePage() {
  const { t } = useTranslation("knowledge")

  return (
    <Layout>
      <div className="mx-auto mt-2 flex w-full max-w-7xl flex-col gap-8 sm:mt-4 sm:gap-12">
        <div className="flex flex-col px-2 sm:px-4">
          <BackButton />

          <header className="flex flex-col gap-3 sm:gap-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t("title")}
            </h1>
            <p className="text-base leading-relaxed text-foreground/80 dark:text-foreground/90 sm:text-lg">
              {t("subtitle")}
            </p>
          </header>
        </div>

        <KnowledgeGrid entries={knowledgeEntries} />
      </div>
    </Layout>
  )
}

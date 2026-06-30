import { useTranslation } from "react-i18next"

import { Layout } from "@/components/Layout"
import { BackButton } from "@/components/BackButton"
import { useAnimationPreference } from "@/components/animation-provider"
import { PlainWorkbenchIndexPage } from "@/components/PlainWorkbenchIndexPage"
import { SoftwareGroupGrid } from "@/components/SoftwareGroupGrid"
import { workbenchGroups } from "@/data/workbench"

export function WorkbenchPage() {
  const { t } = useTranslation("workbench")
  const { isPlainDisplayMode } = useAnimationPreference()

  if (isPlainDisplayMode) {
    return <PlainWorkbenchIndexPage groups={workbenchGroups} />
  }

  return (
    <Layout>
      <div className="mx-auto mt-2 flex w-full max-w-7xl flex-col gap-8 sm:mt-4 sm:gap-12">
        <div className="flex flex-col px-2 sm:px-4">
          <BackButton />

          <header className="flex flex-col gap-3 sm:gap-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h1>
            <p className="text-base leading-relaxed text-foreground/80 dark:text-foreground/90 sm:text-lg">
              {t("subtitle")}
            </p>
          </header>
        </div>

        <SoftwareGroupGrid groups={workbenchGroups} />
      </div>
    </Layout>
  )
}

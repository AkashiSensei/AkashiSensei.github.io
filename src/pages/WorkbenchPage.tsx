import { SectionHeader } from "@/components/SectionHeader"
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

          <SectionHeader level={1} title={t("title")} subtitle={t("subtitle")} className="px-0 sm:px-0 md:px-0" />
        </div>

        <SoftwareGroupGrid groups={workbenchGroups} />
      </div>
    </Layout>
  )
}

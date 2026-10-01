import { SectionHeader } from "@/components/SectionHeader"
import { useTranslation } from "react-i18next"

import { BackButton } from "@/components/BackButton"
import { useAnimationPreference } from "@/components/animation-provider"
import { Layout } from "@/components/Layout"
import { PlainProjectIndexPage } from "@/components/PlainProjectIndexPage"
import { ProjectGrid } from "@/components/ProjectGrid"
import { projects } from "@/data/projects"

export function ProjectsPage() {
  const { t } = useTranslation("projects")
  const { isPlainDisplayMode } = useAnimationPreference()

  if (isPlainDisplayMode) {
    return <PlainProjectIndexPage projects={projects} />
  }

  return (
    <Layout>
      <div className="mx-auto mt-2 flex w-full max-w-7xl flex-col gap-8 sm:mt-4 sm:gap-12">
        <div className="flex flex-col px-2 sm:px-4">
          <BackButton />

          <SectionHeader level={1} title={t("title")} subtitle={t("subtitle")} className="px-0 sm:px-0 md:px-0" />
        </div>

        <ProjectGrid projects={projects} />
      </div>
    </Layout>
  )
}

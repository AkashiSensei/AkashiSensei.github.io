import { useTranslation } from "react-i18next"

import {
  ArchiveSectionHeader,
  ProjectArchiveCard,
} from "@/components/ProjectHighlights"
import { featuredCourseProjects } from "@/data/course-projects"

export function CourseProjectHighlights() {
  const { t } = useTranslation("courseProjects")

  if (featuredCourseProjects.length === 0) {
    return null
  }

  return (
    <section id="course-projects" className="flex min-h-[calc(100svh-8rem)] w-full flex-col justify-center gap-5 py-10 sm:py-12">
      <ArchiveSectionHeader
        detailPath="/course-projects"
        title={t("title")}
        subtitle={t("subtitle")}
        viewAllLabel={t("viewAll")}
      />

      <div className="flex flex-col gap-5 md:h-[30rem] md:flex-row md:gap-6 xl:h-[34rem] xl:gap-7">
        {featuredCourseProjects.map((project, index) => {
          const staggerOrder = index === 1 ? 0 : index === 0 ? 1 : 2

          return (
            <ProjectArchiveCard
              key={project.id}
              project={project}
              staggerIndex={staggerOrder}
              translationNamespace="courseProjects"
              className="min-h-[18rem] md:min-h-0 md:flex-1 md:transition-[flex-grow] md:duration-500 md:ease-out md:hover:flex-[1.35]"
            />
          )
        })}
      </div>

      <p className="w-full whitespace-pre-line px-2 text-sm font-normal leading-relaxed text-tone-2 sm:px-3 sm:text-base md:px-4">
        {t("reflection")}
      </p>
    </section>
  )
}

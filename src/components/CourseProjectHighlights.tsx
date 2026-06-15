import { useTranslation } from "react-i18next"

import {
  ArchiveSectionHeader,
  ProjectArchiveCard,
} from "@/components/ProjectHighlights"
import { courseProjects, featuredCourseProjects } from "@/data/course-projects"

export function CourseProjectHighlights() {
  const { t } = useTranslation("courseProjects")

  if (featuredCourseProjects.length === 0) {
    return null
  }

  return (
    <section id="course-projects" className="resume-rhythm-section flex w-full flex-col justify-center gap-5">
      <ArchiveSectionHeader
        detailPath="/course-projects"
        title={t("title")}
        subtitle={t("subtitle")}
        viewAllLabel={t("viewAllWithCount", { count: courseProjects.length })}
      />

      <div className="grid gap-5 md:grid-cols-3 md:gap-5 min-[1440px]:flex min-[1440px]:h-[26rem] min-[1440px]:flex-row min-[1440px]:gap-6 min-[1800px]:!h-[30rem]">
        {featuredCourseProjects.map((project, index) => {
          const staggerOrder = index === 1 ? 0 : index === 0 ? 1 : 2

          return (
            <ProjectArchiveCard
              key={project.id}
              project={project}
              staggerIndex={staggerOrder}
              translationNamespace="courseProjects"
              className="min-h-[18rem] sm:min-h-[20rem] md:min-h-[17rem] lg:min-h-[18rem] min-[1440px]:min-h-0 min-[1440px]:flex-1 min-[1440px]:transition-[flex-grow] min-[1440px]:duration-500 min-[1440px]:ease-out min-[1440px]:hover:flex-[1.25]"
            />
          )
        })}
      </div>

      <p className="w-full whitespace-pre-line px-2 text-sm font-normal leading-relaxed text-tone-2 sm:px-3 md:px-4 lg:text-[0.9375rem] xl:text-base">
        {t("reflection")}
      </p>
    </section>
  )
}

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
    <section id="course-projects" className="resume-rhythm-section flex w-full flex-col justify-center gap-5">
      <ArchiveSectionHeader
        detailPath="/course-projects"
        title={t("title")}
        subtitle={t("subtitle")}
        viewAllLabel={t("viewAll")}
      />

      <div className="grid gap-5 md:grid-cols-2 md:gap-6 min-[1440px]:flex min-[1440px]:h-[30rem] min-[1440px]:flex-row min-[1440px]:gap-7 min-[1800px]:!h-[34rem]">
        {featuredCourseProjects.map((project, index) => {
          const staggerOrder = index === 1 ? 0 : index === 0 ? 1 : 2

          return (
            <ProjectArchiveCard
              key={project.id}
              project={project}
              staggerIndex={staggerOrder}
              translationNamespace="courseProjects"
              className={`min-h-[18rem] sm:min-h-[20rem] md:min-h-[22rem] min-[1440px]:min-h-0 min-[1440px]:flex-1 min-[1440px]:transition-[flex-grow] min-[1440px]:duration-500 min-[1440px]:ease-out min-[1440px]:hover:flex-[1.35] ${index === 2 ? "md:col-span-2 min-[1440px]:col-span-1" : ""}`}
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

import { useRef } from "react"
import { useTranslation } from "react-i18next"

import { ContactDialog } from "@/components/ContactDialog"
import { CourseProjectHighlights } from "@/components/CourseProjectHighlights"
import { DirectionsSection } from "@/components/DirectionsSection"
import { EducationHighlights } from "@/components/EducationHighlights"
import { GitHubActivityHighlights } from "@/components/GitHubActivityHighlights"
import { GitHubMark } from "@/components/GitHubMark"
import { QuestionWall } from "@/components/QuestionWall"
import { KnowledgeHighlights } from "@/components/KnowledgeHighlights"
import { Layout } from "@/components/Layout"
import { ProjectHighlights } from "@/components/ProjectHighlights"
import { ResumePlainExperience } from "@/components/ResumePlainExperience"
import { SmallToolHighlights } from "@/components/SmallToolHighlights"
import { Button } from "@/components/ui/button"
import { WorkbenchHighlights } from "@/components/WorkbenchHighlights"
import { useAnimationPreference } from "@/components/animation-provider"
import { useResumeLandscapeSectionPaging } from "@/hooks/use-resume-landscape-section-paging"
import { filledPillActionClassName, ghostPillActionClassName } from "@/lib/action-button-styles"
import { cn } from "@/lib/utils"

type ValueCard = {
  title: string
  description: string
}

export function ResumePage() {
  const { i18n, t } = useTranslation("resume")
  const { isPlainDisplayMode } = useAnimationPreference()
  const sectionStackRef = useRef<HTMLDivElement>(null)

  useResumeLandscapeSectionPaging(sectionStackRef, !isPlainDisplayMode)

  if (isPlainDisplayMode) {
    return (
      <Layout mainClassName="plain-home-main plain-resume-main">
        <ResumePlainExperience />
      </Layout>
    )
  }

  const isEnglish = (i18n.resolvedLanguage ?? i18n.language).startsWith("en")
  const resumeDescription = t("description", {
    returnObjects: true,
  })
  const descriptionParagraphs = Array.isArray(resumeDescription)
    ? resumeDescription
    : String(resumeDescription).split("\n\n")
  const resumeValues = t("values", {
    returnObjects: true,
  })
  const valueCards = Array.isArray(resumeValues)
    ? resumeValues.filter(
        (item): item is ValueCard =>
          typeof item === "object" &&
          item !== null &&
          "title" in item &&
          "description" in item,
      )
    : []
  const resumeKickerTags = t("kickerTags", {
    returnObjects: true,
  })
  const kickerTags = Array.isArray(resumeKickerTags)
    ? resumeKickerTags.filter((tag): tag is string => typeof tag === "string")
    : [String(resumeKickerTags)]

  return (
    <Layout mainClassName="resume-page-main">
      <div ref={sectionStackRef} className="resume-section-stack mt-8 flex flex-col sm:mt-16 md:mt-2">
        <section className="resume-hero-section grid w-full items-center gap-9 pb-5 pt-2 sm:gap-10 sm:pb-6 sm:pt-4 md:gap-8 md:pb-6 md:pt-0 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,31rem)] xl:gap-12 xl:pb-8 min-[1800px]:!grid-cols-[minmax(0,1fr)_31rem] min-[1800px]:!gap-18">
          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="flex flex-wrap gap-2">
              {kickerTags.map((tag) => (
                <span
                  key={tag}
                  className="w-fit rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.45)] bg-[rgb(var(--site-surface-rgb)_/_0.38)] px-3 py-1 text-[0.6875rem] font-normal uppercase tracking-wide text-tone-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <h1 className="text-hero font-light leading-tight tracking-tight text-tone-1 text-pretty">
                {t("titleLead")}
              </h1>
              <p className="max-w-full text-xl font-light italic leading-snug text-tone-3 text-pretty">
                {t("titleAccent")}
              </p>
            </div>
            <div className={`flex max-w-3xl flex-col text-base font-body leading-[1.45] text-tone-2 lg:max-w-4xl xl:max-w-6xl ${isEnglish ? "sm:text-base" : "sm:text-lg"}`}>
              {descriptionParagraphs.map((paragraph) => (
                <p key={paragraph} className="whitespace-pre-line min-[1800px]:whitespace-nowrap">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <ContactDialog>
                <Button
                  variant="outline"
                  className={cn(filledPillActionClassName, "h-12 px-7")}
                >
                  {t("contact")}
                </Button>
              </ContactDialog>
              <Button
                variant="ghost"
                asChild
                className={ghostPillActionClassName}
              >
                <a
                  href="https://github.com/AkashiSensei"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  <GitHubMark className="h-4 w-4 shrink-0" />
                  {t("github")}
                </a>
              </Button>
            </div>
          </div>
          <div className="grid w-full max-w-5xl gap-5 justify-self-start sm:grid-cols-2 lg:max-w-none lg:grid-cols-1 lg:gap-5 lg:pt-6 xl:gap-6 xl:pt-9 min-[1800px]:!pt-12">
            {valueCards.map((card) => (
              <div
                key={card.title}
                className="grid grid-cols-[2px_minmax(0,1fr)] gap-4"
              >
                <div className="h-full bg-tone-3 dark:bg-tone-2" />
                <div className="max-w-[27rem]">
                  <h2 className="text-base font-medium leading-tight tracking-tight text-tone-1 sm:text-lg">
                    {card.title}
                  </h2>
                  <p className="mt-1.5 text-sm font-body leading-snug text-tone-2 sm:text-sm">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <ProjectHighlights />
        <EducationHighlights />
        <GitHubActivityHighlights />
        <DirectionsSection />
        <CourseProjectHighlights />
        <WorkbenchHighlights />
        <QuestionWall />
        <KnowledgeHighlights />
        <SmallToolHighlights />
      </div>
    </Layout>
  )
}

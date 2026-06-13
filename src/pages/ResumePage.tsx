import { ContactDialog } from "@/components/ContactDialog"
import { CourseProjectHighlights } from "@/components/CourseProjectHighlights"
import { DirectionsSection } from "@/components/DirectionsSection"
import { GitHubActivityHighlights } from "@/components/GitHubActivityHighlights"
import { GitHubMark } from "@/components/GitHubMark"
import { KnowledgeHighlights } from "@/components/KnowledgeHighlights"
import { Layout } from "@/components/Layout"
import { ProjectHighlights } from "@/components/ProjectHighlights"
import { SmallToolHighlights } from "@/components/SmallToolHighlights"
import { Button } from "@/components/ui/button"
import { WorkbenchHighlights } from "@/components/WorkbenchHighlights"
import { useTranslation } from "react-i18next"

type ValueCard = {
  title: string
  description: string
}

export function ResumePage() {
  const { i18n, t } = useTranslation("resume")
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
    <Layout>
      <div className="resume-section-stack mt-8 flex flex-col sm:mt-16">
        <section className="resume-hero-section grid w-full items-center gap-9 pb-5 pt-2 sm:gap-10 sm:pb-6 sm:pt-4 md:pb-8 md:pt-0 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,31rem)] xl:gap-14 xl:pb-10 min-[1800px]:!grid-cols-[minmax(0,1fr)_31rem] min-[1800px]:!gap-20">
          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="flex flex-wrap gap-2">
              {kickerTags.map((tag) => (
                <span
                  key={tag}
                  className="w-fit rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.45)] bg-[rgb(var(--site-surface-rgb)_/_0.38)] px-3 py-1 text-[0.6875rem] font-black uppercase tracking-wide text-tone-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-1 sm:gap-1.5">
              <h1 className="text-[clamp(3.45rem,15vw,4.25rem)] font-black leading-[0.92] tracking-[-0.035em] text-tone-1 text-pretty sm:text-[clamp(3.65rem,5.8vw,5.65rem)]">
                {t("titleLead")}
              </h1>
              <p className="max-w-full text-[clamp(1.35rem,5.6vw,1.8rem)] font-medium italic leading-tight text-tone-4 text-pretty sm:text-[clamp(1.25rem,2.2vw,2rem)] sm:leading-none xl:whitespace-nowrap">
                {t("titleAccent")}
              </p>
            </div>
            <div className={`flex max-w-3xl flex-col gap-1 text-base font-medium leading-[1.34] text-tone-2 sm:leading-[1.32] lg:max-w-4xl xl:max-w-6xl ${isEnglish ? "sm:text-base" : "sm:text-lg"}`}>
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
                  className="h-12 rounded-full border-[rgb(var(--site-surface-rgb)_/_0.68)] bg-[rgb(var(--site-surface-rgb))] px-7 text-sm font-bold text-black shadow-sm backdrop-blur-md transition-colors hover:bg-[rgb(255_255_252)] dark:border-[rgb(var(--site-surface-rgb)_/_0.18)] dark:bg-[rgb(var(--site-surface-rgb))] dark:text-black dark:hover:bg-[rgb(255_255_252)]"
                >
                  {t("contact")}
                </Button>
              </ContactDialog>
              <Button
                variant="ghost"
                asChild
                className="h-12 rounded-full px-4 text-sm font-bold text-tone-2 transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.30)] hover:text-tone-1 dark:hover:bg-white/10"
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
          <div className="grid w-full max-w-5xl gap-5 justify-self-start sm:grid-cols-2 lg:max-w-none lg:grid-cols-1 lg:gap-5 lg:pt-8 xl:gap-6 xl:pt-12 min-[1800px]:!pt-16">
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
                  <p className="mt-1.5 text-[0.8125rem] font-normal leading-snug text-tone-2 sm:text-[0.875rem]">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <ProjectHighlights />
        <GitHubActivityHighlights />
        <DirectionsSection />
        <CourseProjectHighlights />
        <WorkbenchHighlights />
        <KnowledgeHighlights />
        <SmallToolHighlights />
      </div>
    </Layout>
  )
}

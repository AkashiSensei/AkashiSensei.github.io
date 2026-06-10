import { ContactDialog } from "@/components/ContactDialog"
import { CourseProjectHighlights } from "@/components/CourseProjectHighlights"
import { DirectionsSection } from "@/components/DirectionsSection"
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
      <div className="mt-8 flex flex-col gap-[4svh] pb-[8svh] sm:mt-16 sm:gap-[5svh] sm:pb-[9svh] md:gap-[6svh] md:pb-[10svh] lg:gap-[7svh] lg:pb-[11svh] xl:gap-[8svh] xl:pb-[12svh]">
        <section className="grid min-h-[calc(84svh-10rem)] w-full items-center gap-10 pb-5 pt-2 sm:pb-6 sm:pt-4 md:min-h-[calc(86svh-10rem)] md:pb-8 md:pt-0 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-14 lg:pb-10 xl:grid-cols-[minmax(0,1fr)_31rem] xl:gap-20">
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
              <h1 className="text-[clamp(2.75rem,7vw,5.15rem)] font-black leading-[0.92] tracking-[-0.035em] text-tone-1 text-pretty sm:text-[clamp(3.65rem,5.8vw,5.65rem)]">
                {t("titleLead")}
              </h1>
              <p className="max-w-full whitespace-nowrap text-[clamp(1.05rem,2.8vw,1.85rem)] font-medium italic leading-none text-tone-4 sm:text-[clamp(1.25rem,2.2vw,2rem)]">
                {t("titleAccent")}
              </p>
            </div>
            <div className={`flex max-w-2xl flex-col gap-0.5 text-base font-medium leading-[1.28] text-tone-2 sm:leading-[1.3] lg:max-w-4xl xl:max-w-6xl ${isEnglish ? "sm:text-base" : "sm:text-lg"}`}>
              {descriptionParagraphs.map((paragraph) => (
                <p key={paragraph} className="whitespace-pre-line xl:whitespace-nowrap">
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
          <div className="flex w-full max-w-xl flex-col gap-5 justify-self-start lg:max-w-none lg:gap-6 lg:pt-12 xl:pt-16">
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
        <DirectionsSection />
        <CourseProjectHighlights />
        <WorkbenchHighlights />
        <KnowledgeHighlights />
        <SmallToolHighlights />
      </div>
    </Layout>
  )
}

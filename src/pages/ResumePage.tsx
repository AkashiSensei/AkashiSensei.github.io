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

export function ResumePage() {
  const { t } = useTranslation("home")
  const descriptionParagraphs = t("resume.description").split("\n\n")

  return (
    <Layout>
      <div className="mt-8 flex flex-col gap-12 sm:mt-16">
        <section className="flex max-w-2xl flex-col gap-6 md:gap-7">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {t("resume.title")}
          </h1>
          {descriptionParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="whitespace-pre-line text-lg leading-[1.75] text-foreground/80"
            >
              {paragraph}
            </p>
          ))}
          <div className="flex flex-wrap gap-4">
            <ContactDialog>
              <Button
                variant="outline"
                className="rounded-full border-white/40 bg-white/40 px-6 shadow-sm backdrop-blur-md transition-colors hover:bg-white/60 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
              >
                {t("contact")}
              </Button>
            </ContactDialog>
            <Button
              variant="outline"
              asChild
              className="rounded-full border-white/40 bg-white/40 px-4 shadow-sm backdrop-blur-md transition-colors hover:bg-white/60 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
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
        </section>
        <DirectionsSection />
        <ProjectHighlights />
        <CourseProjectHighlights />
        <WorkbenchHighlights />
        <SmallToolHighlights />
        <KnowledgeHighlights />
      </div>
    </Layout>
  )
}

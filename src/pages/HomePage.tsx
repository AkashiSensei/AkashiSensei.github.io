import { Layout } from "@/components/Layout"
import { AppLink } from "@/components/AppLink"
import { ContactDialog } from "@/components/ContactDialog"
import { GitHubMark } from "@/components/GitHubMark"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"

export function HomePage() {
  const { t } = useTranslation("home")
  const descriptionParagraphs = t("description").split("\n\n")

  return (
    <Layout>
      <section className="flex min-h-[calc(100svh-11rem)] max-w-2xl flex-col justify-center gap-7 py-12 sm:py-16">
        <div className="flex flex-col gap-5">
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p
            className="text-xl font-medium text-foreground/55 md:text-2xl"
            title={t("subtitleTranslation")}
          >
            「明石の出番ですね。」
          </p>
          <div className="flex flex-col gap-5 text-lg text-foreground/75">
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph} className="flex flex-col gap-1.5">
                {paragraph.split("\n").map((line) => (
                  <span key={line} className="leading-[1.62]">
                    {line}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            asChild
            className="h-10 w-fit rounded-full border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] px-5 text-sm shadow-sm backdrop-blur-md transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.62)] dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <AppLink to="/resume" className="inline-flex items-center gap-2">
              {t("resumeCta")}
              <ArrowRight className="h-4 w-4" />
            </AppLink>
          </Button>
          <ContactDialog>
            <Button
              variant="outline"
              className="h-10 rounded-full border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] px-5 text-sm shadow-sm backdrop-blur-md transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.62)] dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
            >
              {t("contact")}
            </Button>
          </ContactDialog>
          <Button
            variant="outline"
            asChild
            className="h-10 rounded-full border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] px-4 text-sm shadow-sm backdrop-blur-md transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.62)] dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20"
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
    </Layout>
  )
}

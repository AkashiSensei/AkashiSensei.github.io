import { useTranslation } from "react-i18next"

import { AppLink } from "@/components/AppLink"
import { BackButton } from "@/components/BackButton"
import { Layout } from "@/components/Layout"
import { SectionHeader } from "@/components/SectionHeader"
import { useAnimationPreference } from "@/components/animation-provider"
import { Button } from "@/components/ui/button"
import { ghostPillActionClassName } from "@/lib/action-button-styles"
import { cn } from "@/lib/utils"

export function NotFoundPage({ fallbackPath }: { fallbackPath?: string }) {
  const { t } = useTranslation("common")
  const { isPlainDisplayMode } = useAnimationPreference()

  if (isPlainDisplayMode) {
    return (
      <Layout mainClassName="plain-home-main">
        <article className="plain-home-document plain-detail-document" aria-labelledby="not-found-title">
          <header className="plain-home-header plain-detail-header">
            {fallbackPath ? <BackButton fallback={fallbackPath} className="plain-index-back" /> : null}
            <p className="plain-home-kicker">404</p>
            <h1 id="not-found-title">{t("notFound.title")}</h1>
            <p className="plain-home-lede">{t("notFound.description")}</p>
            <div className="plain-home-actions">
              <AppLink to="/" className="site-text-link">{t("notFound.homeCta")}</AppLink>
            </div>
          </header>
        </article>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto mt-2 flex w-full max-w-7xl flex-col gap-5 px-2 sm:mt-4 sm:px-4" aria-labelledby="not-found-title">
        {fallbackPath ? <BackButton fallback={fallbackPath} /> : null}
        <SectionHeader
          level={1}
          eyebrow="404"
          title={t("notFound.title")}
          subtitle={t("notFound.description")}
          headingProps={{ id: "not-found-title" }}
          className="px-0 sm:px-0 md:px-0"
        />
        <Button asChild variant="ghost" className={cn(ghostPillActionClassName, "mt-2 h-10 w-fit bg-muted/50 px-5 text-sm")}>
          <AppLink to="/">{t("notFound.homeCta")}</AppLink>
        </Button>
      </section>
    </Layout>
  )
}

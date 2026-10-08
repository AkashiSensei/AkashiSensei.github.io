import { useTranslation } from "react-i18next"
import { AppLink } from "@/components/AppLink"
import { BlogCard } from "@/components/BlogCard"
import { ArchiveSectionHeader } from "@/components/SectionHeader"
import { useAnimationPreference } from "@/components/animation-provider"
import { blogArticles, featuredBlogArticles, getBlogLocale } from "@/lib/blog"
import { cn } from "@/lib/utils"

export function BlogHighlights() {
  const { t, i18n } = useTranslation("blog")
  const { isPlainDisplayMode } = useAnimationPreference()
  const locale = getBlogLocale(i18n.resolvedLanguage ?? i18n.language)
  const viewAllLabel = t("viewAllWithCount", { count: blogArticles.length })
  if (!featuredBlogArticles.length) return null

  return <section id="blog" className={cn(!isPlainDisplayMode && "resume-rhythm-section flex h-auto w-full flex-col justify-center gap-5")}>
    {isPlainDisplayMode ? <>
      <h2><AppLink to="/blog">{t("title")}</AppLink></h2>
      <p>{t("subtitle")}</p>
      <AppLink to="/blog" className="site-text-link mt-2 inline-block text-sm font-normal">{viewAllLabel}</AppLink>
    </> : <ArchiveSectionHeader detailPath="/blog" title={t("title")} subtitle={t("subtitle")} viewAllLabel={viewAllLabel} />}
    <div className={isPlainDisplayMode ? "plain-resume-mini-list items-start !gap-y-10" : "grid items-start gap-5 md:grid-cols-3 md:gap-5 min-[1440px]:!gap-6"}>
      {featuredBlogArticles.map((article, index) => <BlogCard key={article.id} article={article} locale={locale} index={index === 1 ? 0 : index === 0 ? 1 : 2} headingLevel={3} />)}
    </div>
  </section>
}

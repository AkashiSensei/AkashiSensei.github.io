import { useTranslation } from "react-i18next"
import { AppLink } from "@/components/AppLink"
import { blogArticles, getBlogContent, getBlogLocale } from "@/lib/blog"

export function RelatedArticles({ projectId }: { projectId: string }) {
  const { t, i18n } = useTranslation("blog")
  const articles = blogArticles.filter((article) => article.relatedProjects.includes(projectId))
  if (!articles.length) return null
  return <section className="mt-5 flex flex-col gap-3">
    <h2 className="site-detail-heading">{t("relatedArticles")}</h2>
    {articles.map((article) => <AppLink className="site-text-link text-sm text-tone-2" key={article.id} to={`/blog/${article.id}`}>{getBlogContent(article, getBlogLocale(i18n.resolvedLanguage ?? i18n.language)).title}</AppLink>)}
  </section>
}

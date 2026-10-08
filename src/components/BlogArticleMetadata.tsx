import { useTranslation } from "react-i18next"
import type { BlogArticle, BlogContent } from "@/lib/blog"
import "@/styles/blog.css"

export function BlogArticleMetadata({ article, content, variant = "card" }: { article: BlogArticle; content: BlogContent; variant?: "card" | "reader" }) {
  const { t, i18n } = useTranslation("blog")
  const contentLocale = content === article.locales.zh ? "zh" : "en"
  const formattedCount = new Intl.NumberFormat(i18n.resolvedLanguage ?? i18n.language).format(content.readingStats.unitCount)
  const countLabel = t(contentLocale === "zh" ? "characterCount" : "wordCount", { formattedCount })
  const readingTimeLabel = t("readingTime", { minutes: content.readingStats.minutes })
  const publicationLabel = article.publishedAt ? t("publishedAt", { date: article.publishedAt }) : ""

  if (variant === "reader") return <p data-variant="reader" className="blog-meta flex flex-wrap items-baseline gap-x-2 gap-y-1">
    {article.publishedAt ? <>
      <time dateTime={article.publishedAt}>{publicationLabel}</time>
      <span aria-hidden="true">·</span>
    </> : null}
    <span>{countLabel}</span>
    <span aria-hidden="true">·</span>
    <span>{readingTimeLabel}</span>
  </p>

  return <div data-variant="card" className="blog-meta flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
    <p className="flex flex-wrap items-baseline gap-x-2 text-inherit">
      <span>{countLabel}</span>
      <span aria-hidden="true">·</span>
      <span>{readingTimeLabel}</span>
    </p>
    {article.publishedAt ? <time dateTime={article.publishedAt} className="ml-auto text-right">{publicationLabel}</time> : null}
  </div>
}

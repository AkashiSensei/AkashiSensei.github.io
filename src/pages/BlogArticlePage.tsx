import { NotFoundPage } from "@/pages/NotFoundPage"
import { useEffect, useMemo, useRef } from "react"
import { useParams, useSearchParams, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Layout } from "@/components/Layout"
import { BackButton } from "@/components/BackButton"
import { AppLink } from "@/components/AppLink"
import { DocumentTag } from "@/components/DocumentTag"
import { BlogCategoryTag } from "@/components/BlogCategoryTag"
import { BlogArticleMetadata } from "@/components/BlogArticleMetadata"
import { BlogZhihuLink } from "@/components/BlogZhihuLink"
import { BlogMarkdown } from "@/components/BlogMarkdown"
import { BlogFloatingToc } from "@/components/BlogFloatingToc"
import { BlogTableOfContents } from "@/components/BlogTableOfContents"
import { ProjectLinks, ProjectSummary } from "@/components/ProjectSummary"
import { useAnimationPreference } from "@/components/animation-provider"
import { blogArticles, getBlogAuthorNotes, getBlogContent, getBlogLocale } from "@/lib/blog"
import { useBlogReadingSection } from "@/lib/use-blog-reading-section"
import { defaultTagClassName, tagPillClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"
import "@/styles/blog.css"

export function BlogArticlePage() {
  const { articleId } = useParams()
  const [searchParams] = useSearchParams()
  const { hash } = useLocation()
  const { t, i18n } = useTranslation(["blog", "projects", "common"])
  const { isPlainDisplayMode, animationMode } = useAnimationPreference()
  const requestedLanguage = searchParams.get("lang")
  const locale = requestedLanguage === "zh" || requestedLanguage === "en" ? requestedLanguage : getBlogLocale(i18n.resolvedLanguage ?? i18n.language)
  const article = blogArticles.find((item) => item.id === articleId)
  const content = article ? getBlogContent(article, locale) : undefined
  const authorNotes = useMemo(() => article && content
    ? getBlogAuthorNotes(article.id, content === article.locales.zh ? "zh" : "en")
    : [], [article, content])
  const bodyRef = useRef<HTMLDivElement>(null)
  const { headings, activeSection } = useBlogReadingSection(bodyRef, content?.markdown ?? "")

  useEffect(() => {
    if (requestedLanguage === "zh" || requestedLanguage === "en") void i18n.changeLanguage(requestedLanguage)
  }, [requestedLanguage, i18n])

  useEffect(() => {
    if (!hash) return
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [hash, locale, articleId])

  if (!article || !content) return <><title>Akashi — 404</title><NotFoundPage fallbackPath="/blog" /></>

  const contentLocale = content === article.locales.zh ? "zh" : "en"
  const relatedProjects = article.relatedProjects.map((id) => ({ module: "projects" as const, id }))

  return <Layout mainClassName={isPlainDisplayMode ? "plain-home-main" : ""}>
    <title>{`${content.title} — Akashi`}</title>
    <meta name="description" content={content.summary} />
    <article data-display-mode={animationMode} className={`blog-document mx-auto w-full max-w-7xl${isPlainDisplayMode ? "" : " px-2 sm:px-4"}`} lang={contentLocale === "zh" ? "zh-CN" : "en"}>
      <BackButton fallback="/blog" />
      <header className="blog-header">
        <AppLink to="/blog" className="blog-meta site-text-link">{t("blog:title")}</AppLink>
        <h1 className="site-page-title">{content.title}</h1>
        <p className="site-lede">{content.summary}</p>
        <div className="blog-tags"><BlogCategoryTag category={article.category} />{article.tags.map((tag) => isPlainDisplayMode ? <DocumentTag key={tag} label={tag} /> : <span key={tag} className={cn(tagPillClassName, defaultTagClassName)}>{tag}</span>)}</div>
        <BlogArticleMetadata article={article} content={content} variant="reader" />
        <ProjectLinks projects={relatedProjects} plain={isPlainDisplayMode} variant="text" />
        {article.zhihuUrl ? <div className="blog-links">
          <BlogZhihuLink url={article.zhihuUrl} />
        </div> : null}
        {!article.locales[locale] ? <p className="blog-meta">{t("blog:fallback")}</p> : !content.reviewed ? <p className="blog-meta">{t("blog:translationDraft")}</p> : null}
      </header>
      <BlogFloatingToc key={`${article.id}:${contentLocale}`} headings={headings} activeSection={activeSection} />
      <div className="blog-reading-layout">
        <div ref={bodyRef} className="blog-reading-body">
          <BlogMarkdown content={content} locale={contentLocale} authorNotes={authorNotes} />
          <ProjectSummary projects={relatedProjects} plain={isPlainDisplayMode} headingLevel={2} className="mt-20" />
        </div>
        <aside className="blog-desktop-toc"><BlogTableOfContents headings={headings} activeSection={activeSection} /></aside>
      </div>
    </article>
  </Layout>
}

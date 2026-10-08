import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Layout } from "@/components/Layout"
import { BackButton } from "@/components/BackButton"
import { BlogCard } from "@/components/BlogCard"
import { BlogCategoryTag } from "@/components/BlogCategoryTag"
import { SectionHeader } from "@/components/SectionHeader"
import { ExternalLinkIcon } from "@/components/ExternalLinkIcon"
import { ZhihuMark } from "@/components/BrandMarks"
import { useAnimationPreference } from "@/components/animation-provider"
import { blogArticles, getBlogLocale } from "@/lib/blog"
import { useMeasuredMasonry } from "@/hooks/use-measured-masonry"
import { socialPillActionClassName } from "@/lib/action-button-styles"
import { cn } from "@/lib/utils"
import "@/styles/blog.css"

export function BlogPage() {
  const { t, i18n } = useTranslation("blog")
  const { isPlainDisplayMode, animationMode } = useAnimationPreference()
  const locale = getBlogLocale(i18n.resolvedLanguage ?? i18n.language)
  const [category, setCategory] = useState("")
  const categories = [...new Set(blogArticles.map((article) => article.category))]
  const articles = blogArticles.filter((article) => !category || article.category === category)
  const listRef = useMeasuredMasonry(true, `${locale}:${animationMode}:${articles.map(({ id }) => id).join("|")}`)
  return (
    <Layout mainClassName={isPlainDisplayMode ? "plain-home-main" : ""}>
      <div data-display-mode={animationMode} className="mx-auto mt-2 flex w-full max-w-7xl flex-col gap-8 sm:mt-4 sm:gap-12">
        <div className={cn("flex flex-col", !isPlainDisplayMode && "px-2 sm:px-4")}>
          <BackButton />
          <SectionHeader level={1} title={t("title")} subtitle={t("subtitle")} className="px-0 sm:px-0 md:px-0" />
          <div className="mt-4">
            {isPlainDisplayMode ? (
              <a href="https://www.zhihu.com/people/heal-me-please/posts" target="_blank" rel="noreferrer" className="group/external inline-flex items-center gap-1.5 text-sm font-normal text-tone-3 transition-colors hover:text-tone-1">
                <span className="site-text-link">{t("zhihuPosts")}</span>
                <ExternalLinkIcon className="h-4 w-4 shrink-0 transition-transform group-hover/external:-translate-y-0.5 group-hover/external:translate-x-0.5 motion-reduce:transform-none" />
              </a>
            ) : (
              <a href="https://www.zhihu.com/people/heal-me-please/posts" target="_blank" rel="noreferrer" className={socialPillActionClassName}>
                <ZhihuMark className="h-3.5 w-3.5 md:h-4 md:w-4" />
                {t("zhihuPosts")}
              </a>
            )}
          </div>
        </div>
        <div>
          <nav className="blog-filters" aria-label={t("categoriesLabel")}>
            {["", ...categories].map((value) => <BlogCategoryTag key={value} category={value} selected={category === value} onClick={() => setCategory(value)} />)}
          </nav>
          <ol ref={listRef} className={cn("measured-masonry", isPlainDisplayMode && "[&>li]:pb-10")}>
            {articles.map((article, index) => <li key={article.id}><BlogCard article={article} locale={locale} index={index} /></li>)}
          </ol>
        </div>
      </div>
    </Layout>
  )
}

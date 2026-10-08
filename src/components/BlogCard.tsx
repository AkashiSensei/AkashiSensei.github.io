import { AppLink } from "@/components/AppLink"
import { BlogArticleMetadata } from "@/components/BlogArticleMetadata"
import { BlogCategoryTag } from "@/components/BlogCategoryTag"
import { BlogZhihuLink } from "@/components/BlogZhihuLink"
import { DocumentTag } from "@/components/DocumentTag"
import { GlassPanel } from "@/components/GlassPanel"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { useAnimationPreference } from "@/components/animation-provider"
import { getBlogContent, type BlogArticle, type BlogLocale } from "@/lib/blog"
import { getBlogGalleryImages } from "@/lib/blog-images"
import { defaultTagClassName, tagPillClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

export function BlogCard({ article, locale, index, className, headingLevel = 2 }: {
  article: BlogArticle
  locale: BlogLocale
  index: number
  className?: string
  headingLevel?: 2 | 3
}) {
  const { isPlainDisplayMode } = useAnimationPreference()
  const content = getBlogContent(article, locale)
  const images = getBlogGalleryImages(content)
  const Surface = isPlainDisplayMode ? "article" : GlassPanel
  const Heading = headingLevel === 3 ? "h3" : "h2"

  return <Surface className={cn("site-card-link-surface flex min-w-0 flex-col", isPlainDisplayMode ? "gap-3" : "detail-link-pair overflow-hidden transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.70)] dark:hover:bg-white/10", className)}>
    {images.length ? <ProjectImageGallery
      key={`${article.id}:${locale}`}
      images={images.map((image) => ({ ...image, altKey: image.alt || content.title }))}
      labelsAreLocalized
      className="relative z-10"
      cardAspectRatioMode="natural"
      cardAutoCycle
      cardAutoCycleStaggerIndex={index}
      cardScrollable={false}
    /> : null}
    <div className={cn("flex min-w-0 flex-col", isPlainDisplayMode ? "gap-3" : "gap-4 p-4")}>
      <div className="flex min-w-0 flex-col gap-1">
        <BlogArticleMetadata article={article} content={content} />
        <Heading className="site-card-title m-0 font-normal"><AppLink to={`/blog/${article.id}?lang=${locale}`} className={cn("site-card-link site-text-link", !isPlainDisplayMode && "detail-link-trigger detail-link-emphasis")}>{content.title}</AppLink></Heading>
      </div>
      <BlogZhihuLink url={article.zhihuUrl} />
      <div className="flex flex-wrap gap-1.5"><BlogCategoryTag category={article.category} />{article.tags.map((tag) => isPlainDisplayMode ? <DocumentTag key={tag} label={tag} /> : <span key={tag} className={cn(tagPillClassName, defaultTagClassName)}>{tag}</span>)}</div>
      <p className="font-body text-sm leading-relaxed text-tone-2">{content.summary}</p>
    </div>
  </Surface>
}

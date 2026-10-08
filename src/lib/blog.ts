import snapshot from "@/content/blog/generated.json"
import authorNotes from "@/content/blog/author-notes.json"
import { localizeBlogAuthorNotes, type BlogAuthorNote } from "@/lib/blog-author-notes"
import { featuredBlogArticleIds } from "@/data/blog"
import type { ImageBrightness } from "@/lib/image-brightness"
import { sortBlogArticlesByPublication } from "@/lib/blog-order"

export type BlogLocale = "zh" | "en"
export type BlogImage = { src: string; alt: string; width: number; height: number; brightness: ImageBrightness }
export type BlogContent = { title: string; summary: string; reviewed: boolean; readingStats: { unitCount: number; minutes: number }; markdown: string; cover?: BlogImage; images: Record<string, BlogImage> }
export type BlogArticle = { id: string; category: string; publishedAt?: string; zhihuUrl?: string; tags: string[]; relatedProjects: string[]; locales: Partial<Record<BlogLocale, BlogContent>> }
// The importer and snapshot checks validate this generated contract. JSON's
// inferred union adds undefined keys for articles with different image sets.
export const blogArticles = sortBlogArticlesByPublication(snapshot.articles as unknown as BlogArticle[])
export const featuredBlogArticles = featuredBlogArticleIds.flatMap((id) => {
  const article = blogArticles.find((entry) => entry.id === id)
  return article ? [article] : []
})
export function getBlogLocale(language: string): BlogLocale { return language.startsWith("zh") ? "zh" : "en" }
export function getBlogContent(article: BlogArticle, locale: BlogLocale) { return article.locales[locale] ?? article.locales.zh ?? article.locales.en! }
export function getBlogAuthorNotes(articleId: string, locale: BlogLocale) {
  return localizeBlogAuthorNotes(authorNotes as BlogAuthorNote[], articleId, locale)
}

import { BlogHeading } from "@/components/BlogHeading"
import { BlogAuthorNote } from "@/components/BlogAuthorNote"
import { CodeBlock } from "@/components/CodeBlock"
import { memo } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import rehypeHighlight from "rehype-highlight"
import { useTranslation } from "react-i18next"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { ImageBrightnessOverlay } from "@/components/ImageBrightnessOverlay"
import { ExternalLinkIcon } from "@/components/ExternalLinkIcon"
import { remarkBlog } from "@/lib/blog-markdown"
import { remarkBlogAuthorNotes, type LocalizedBlogAuthorNote } from "@/lib/blog-author-notes"
import { getBlogGalleryImages } from "@/lib/blog-images"
import type { BlogContent, BlogImage, BlogLocale } from "@/lib/blog"
import "katex/dist/katex.min.css"

export const BlogMarkdown = memo(function BlogMarkdown({ content, locale, authorNotes = [] }: { content: BlogContent; locale: BlogLocale; authorNotes?: LocalizedBlogAuthorNote[] }) {
  const { t } = useTranslation("blog")
  const images = getBlogGalleryImages(content)
  const renderImage = (image: BlogImage, alt: string, openImage: (index: number, trigger?: HTMLElement) => void, isCover = false) => <span className={isCover ? "blog-image blog-cover" : "blog-image"}>
    <button type="button" className="blog-image-trigger" aria-label={t("enlarge", { image: alt })} onClick={(event) => openImage(images.findIndex((item) => item.src === image.src), event.currentTarget)}>
      <img src={image.src} alt={alt} width={image.width} height={image.height} loading={isCover ? "eager" : "lazy"} />
      <ImageBrightnessOverlay brightness={image.brightness} />
    </button>
    {!isCover && alt ? <span className="blog-image-caption">{alt}</span> : null}
  </span>
  const renderMarkdown = (openImage: (index: number, trigger?: HTMLElement) => void) => <>
    {content.cover ? renderImage(content.cover, content.cover.alt, openImage, true) : null}
    <Markdown
    remarkPlugins={[remarkGfm, remarkMath, remarkBlog, [remarkBlogAuthorNotes, authorNotes]]}
    rehypePlugins={[[rehypeKatex, { trust: false, strict: "warn" }], [rehypeHighlight, { detect: false }]]}
    components={{
      aside: ({ id, children }) => {
        const note = authorNotes.find((item) => `author-note-${item.id}` === id)
        return note ? <BlogAuthorNote note={note} /> : <aside id={id}>{children}</aside>
      },
      h2: ({ id, children }) => <BlogHeading level={2} id={id} locale={locale}>{children}</BlogHeading>,
      h3: ({ id, children }) => <BlogHeading level={3} id={id} locale={locale}>{children}</BlogHeading>,
      h4: ({ id, children }) => <BlogHeading level={4} id={id} locale={locale}>{children}</BlogHeading>,
      h5: ({ id, children }) => <BlogHeading level={5} id={id} locale={locale}>{children}</BlogHeading>,
      h6: ({ id, children }) => <BlogHeading level={6} id={id} locale={locale}>{children}</BlogHeading>,

      a: ({ href, children }) => <a href={href} className="site-text-link">{children}{href?.startsWith("https://") ? <ExternalLinkIcon className="ml-1 inline h-3 w-3" /> : null}</a>,
      pre: CodeBlock,
      table: ({ children }) => <div className="blog-table-scroll" tabIndex={0} role="region" aria-label={t("table")}><table>{children}</table></div>,
      img: ({ src, alt }) => {
        const image = src ? content.images[src] : undefined
        if (!image) return <span>{alt}</span>
        return renderImage(image, alt ?? "", openImage)
      },
    }}
    >{content.markdown}</Markdown>
  </>

  return <div className="blog-prose">{images.length ? <ProjectImageGallery
    images={images.map((image) => ({ ...image, altKey: image.alt }))}
    labelsAreLocalized
    renderTrigger={renderMarkdown}
  /> : renderMarkdown(() => {})}</div>
})

import { ExternalLinkIcon } from "@/components/ExternalLinkIcon"
import { DocumentTag } from "@/components/DocumentTag"
import type { ReactNode } from "react"
import { BackButton } from "@/components/BackButton"
import { Layout } from "@/components/Layout"
import { type PlainIndexImage, type PlainTag } from "@/components/PlainIndexPage"
import { renderPlainRichText } from "@/components/PlainRichText"
import { PlainImageGallery } from "@/components/PlainImageGallery"

export type PlainDetailLink = {
  label: string
  href?: string
  meta?: PlainTag[]
}

export type PlainDetailSection = {
  title: string
  bullets: string[]
}

type PlainDetailPageProps = {
  children?: ReactNode
  asideContent?: ReactNode
  title: string
  summary: string
  kicker?: string
  fallback: string
  images?: PlainIndexImage[]
  meta?: string[]
  tags?: PlainTag[]
  links?: PlainDetailLink[]
  sections?: PlainDetailSection[]
  showSingleSectionTitle?: boolean
  sectionHeadingClassName?: string
  linksTitle?: string
  tagsTitle?: string
}

function getPlainTagLabel(tag: PlainTag) {
  return typeof tag === "string" ? tag : tag.label
}

export function PlainDetailPage({
  title,
  summary,
  kicker,
  fallback,
  images,
  meta,
  tags,
  links,
  sections,
  showSingleSectionTitle = false,
  sectionHeadingClassName,
  linksTitle,
  tagsTitle,
  children,
  asideContent,
}: PlainDetailPageProps) {
  const visibleSections = sections?.filter((section) => section.bullets.length) ?? []
  const hasDetailContent = visibleSections.length > 0 || Boolean(links?.length) || Boolean(tags?.length) || Boolean(asideContent)

  return (
    <Layout mainClassName="plain-home-main">
      <article className="plain-home-document plain-detail-document" aria-labelledby="plain-detail-title">
        <header className="plain-home-header plain-detail-header">
          <BackButton fallback={fallback} className="plain-index-back" />
          {kicker ? <p className="plain-home-kicker">{kicker}</p> : null}
          <h1 id="plain-detail-title">{title}</h1>
          <p className="plain-home-lede">{summary}</p>
          {meta?.length ? (
            <p className="plain-index-meta plain-detail-meta">{meta.join(" / ")}</p>
          ) : null}
        </header>

        {images?.length ? (
          <section className="plain-detail-gallery-section" aria-label={title}>
            <PlainImageGallery images={images} />
          </section>
        ) : null}

        {hasDetailContent ? (
          <section className="plain-detail-layout" aria-label={title}>
            <div className="plain-detail-body">
              {visibleSections.map((section) => (
                <section key={section.title} className="plain-home-subsection">
                  {showSingleSectionTitle || visibleSections.length > 1 ? <h2 className={sectionHeadingClassName}>{section.title}</h2> : null}
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{renderPlainRichText(bullet)}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <aside className="plain-detail-aside">
              {links?.length ? (
                <section>
                  <h2>{linksTitle}</h2>
                  <ul>
                    {links.map((link) => (
                      <li key={link.href ?? link.label}>
                        {link.href ? (
                          <a href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5">
                            {link.label}
                            <ExternalLinkIcon className="shrink-0" />
                          </a>
                        ) : (
                          <span>{link.label}</span>
                        )}
                        {link.meta?.length ? (
                          <span className="plain-detail-link-meta">
                            {link.meta.map((tag) => (
                              <DocumentTag key={getPlainTagLabel(tag)} label={getPlainTagLabel(tag)} />
                            ))}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {tags?.length ? (
                <section>
                  <h2>{tagsTitle}</h2>
                  <ul className="plain-index-tags">
                  {tags.map((tag) => (
                    <DocumentTag as="li" key={getPlainTagLabel(tag)} label={getPlainTagLabel(tag)} />
                  ))}
                </ul>
                </section>
              ) : null}
              {asideContent}
            </aside>
          </section>
        ) : null}
        {children}
      </article>
    </Layout>
  )
}

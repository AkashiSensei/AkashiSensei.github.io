import { BackButton } from "@/components/BackButton"
import { Layout } from "@/components/Layout"
import { type PlainIndexImage, type PlainTag } from "@/components/PlainIndexPage"
import { renderPlainRichText } from "@/components/PlainRichText"
import { cn } from "@/lib/utils"

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
  title: string
  summary: string
  kicker?: string
  fallback: string
  images?: PlainIndexImage[]
  meta?: string[]
  tags?: PlainTag[]
  links?: PlainDetailLink[]
  sections?: PlainDetailSection[]
  linksTitle?: string
  tagsTitle?: string
}

function getPlainTagLabel(tag: PlainTag) {
  return typeof tag === "string" ? tag : tag.label
}

function getPlainTagClassName(tag: PlainTag) {
  return typeof tag === "string" ? undefined : tag.className
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
  linksTitle,
  tagsTitle,
}: PlainDetailPageProps) {
  const visibleSections = sections?.filter((section) => section.bullets.length) ?? []
  const hasDetailContent = visibleSections.length > 0 || Boolean(links?.length) || Boolean(tags?.length)

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
            <div className="plain-detail-image-grid">
              {images.map((image) => (
                <figure key={image.src}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {hasDetailContent ? (
          <section className="plain-detail-layout" aria-label={title}>
            <div className="plain-detail-body">
              {visibleSections.map((section) => (
                <section key={section.title} className="plain-home-subsection">
                  <h2>{section.title}</h2>
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
                          <a href={link.href} target="_blank" rel="noreferrer">
                            {link.label}
                          </a>
                        ) : (
                          <span>{link.label}</span>
                        )}
                        {link.meta?.length ? (
                          <span className="plain-detail-link-meta">
                            {link.meta.map((tag) => (
                              <span
                                key={getPlainTagLabel(tag)}
                                className={cn(
                                  getPlainTagClassName(tag)
                                    && "plain-index-tag-pill rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none",
                                  getPlainTagClassName(tag),
                                )}
                              >
                                {getPlainTagLabel(tag)}
                              </span>
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
                    <li
                      key={getPlainTagLabel(tag)}
                      className={cn(
                        getPlainTagClassName(tag)
                          && "plain-index-tag-pill rounded-full border px-2.5 py-1 text-xs font-semibold",
                        getPlainTagClassName(tag),
                      )}
                    >
                      {getPlainTagLabel(tag)}
                    </li>
                  ))}
                </ul>
                </section>
              ) : null}
            </aside>
          </section>
        ) : null}
      </article>
    </Layout>
  )
}

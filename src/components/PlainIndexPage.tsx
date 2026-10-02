import { PlainImageGallery } from "@/components/PlainImageGallery"
import { DocumentTag } from "@/components/DocumentTag"
import { AppLink } from "@/components/AppLink"
import { BackButton } from "@/components/BackButton"
import { Layout } from "@/components/Layout"
import { renderPlainRichText } from "@/components/PlainRichText"

export type PlainIndexImage = {
  src: string
  alt: string
  title?: string
  width?: number
  height?: number
}

export type PlainTag = string | {
  label: string
  // Optional visual-view metadata; document tags use the shared text style.
  className?: string
}

export type PlainIndexItem = {
  id: string
  title: string
  summary: string
  href?: string
  image?: PlainIndexImage
  meta?: string[]
  tags?: PlainTag[]
  bullets?: string[]
  icons?: {
    id: string
    name: string
    src: string
  }[]
}

function getPlainTagLabel(tag: PlainTag) {
  return typeof tag === "string" ? tag : tag.label
}

type PlainIndexPageProps = {
  title: string
  subtitle: string
  items: PlainIndexItem[]
  backFallback?: string
}

export function PlainIndexPage({
  title,
  subtitle,
  items,
  backFallback = "/resume",
}: PlainIndexPageProps) {
  return (
    <Layout mainClassName="plain-home-main">
      <article className="plain-home-document plain-index-document" aria-labelledby="plain-index-title">
        <header className="plain-home-header plain-index-header">
          <BackButton fallback={backFallback} className="plain-index-back" />
          <h1 id="plain-index-title">{title}</h1>
          <p className="plain-home-lede">{subtitle}</p>
        </header>

        <section className="plain-index-list" aria-label={title}>
          {items.map((item) => (
            <article key={item.id} className="plain-index-item">
              {item.image ? (
                <PlainImageGallery single images={[item.image]} imageClassName="plain-index-image" />
              ) : null}

              <div className="plain-index-item-copy">
                <header className="plain-index-item-header">
                  <h2>
                    {item.href ? <AppLink to={item.href}>{item.title}</AppLink> : item.title}
                  </h2>
                  {item.meta?.length ? (
                    <p className="plain-index-meta">{item.meta.join(" / ")}</p>
                  ) : null}
                </header>

                <p>{item.summary}</p>

                {item.bullets?.length ? (
                  <ul>
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{renderPlainRichText(bullet)}</li>
                    ))}
                  </ul>
                ) : null}

                {item.icons?.length ? (
                  <ul className="plain-index-icon-list" aria-label={item.title}>
                    {item.icons.map((icon) => (
                      <li key={icon.id}>
                        <img src={icon.src} alt="" loading="lazy" />
                        <span>{icon.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {item.tags?.length ? (
                  <ul className="plain-index-tags" aria-label={item.title}>
                    {item.tags.map((tag) => (
                      <DocumentTag as="li" key={getPlainTagLabel(tag)} label={getPlainTagLabel(tag)} />
                    ))}
                  </ul>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </article>
    </Layout>
  )
}

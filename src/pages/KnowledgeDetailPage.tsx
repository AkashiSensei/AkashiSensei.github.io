import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { BackButton } from "@/components/BackButton"
import { useAnimationPreference } from "@/components/animation-provider"
import { DetailImageMasonry } from "@/components/DetailImageMasonry"
import { FeaturePointList } from "@/components/FeaturePointList"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { GlassPanel } from "@/components/GlassPanel"
import { Layout } from "@/components/Layout"
import { LazyImage } from "@/components/LazyImage"
import { PlainDetailPage } from "@/components/PlainDetailPage"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { type KnowledgeEntry } from "@/data/knowledge"
import { getGitHubRepoUpdatedDate } from "@/lib/github-repo-stats"
import { getSemanticTagClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

type KnowledgeDetailPageProps = {
  entries: KnowledgeEntry[]
}

const detailSectionClassName = "px-2 sm:px-4"

const kindClassName: Record<KnowledgeEntry["kind"], string> = {
  blog:
    "border-sky-300/55 bg-sky-100/70 text-sky-800 dark:border-sky-300/25 dark:bg-sky-300/12 dark:text-sky-200",
  paperVault:
    "border-emerald-300/55 bg-emerald-100/70 text-emerald-800 dark:border-emerald-300/25 dark:bg-emerald-300/12 dark:text-emerald-200",
  digest:
    "border-amber-300/55 bg-amber-100/75 text-amber-850 dark:border-amber-300/25 dark:bg-amber-300/12 dark:text-amber-200",
  insights:
    "border-violet-300/50 bg-violet-100/70 text-violet-800 dark:border-violet-300/25 dark:bg-violet-300/12 dark:text-violet-200",
}

const defaultTagClassName =
  "border-[rgb(var(--site-surface-rgb)_/_0.56)] bg-[rgb(var(--site-surface-rgb)_/_0.56)] text-foreground/75 shadow-sm shadow-black/5 backdrop-blur-md dark:border-white/20 dark:bg-white/12 dark:text-foreground/85 dark:shadow-black/20"

function getPoints(value: unknown) {
  return Array.isArray(value) ? value.filter((point): point is string => typeof point === "string") : []
}

function KnowledgeImageWall({
  images,
}: {
  images: NonNullable<KnowledgeEntry["images"]>
}) {
  const { t } = useTranslation(["knowledge", "common"])
  const [previewImage, setPreviewImage] = useState<
    NonNullable<KnowledgeEntry["images"]>[number] | null
  >(null)

  return (
    <>
      <DetailImageMasonry
        images={images}
        renderImage={(image) => {
          const imageAlt = t(image.altKey)

          return (
            <button
              key={image.src}
              type="button"
              className="group/wall-image block w-full overflow-hidden rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.32)] p-0 text-left shadow-sm backdrop-blur-md transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/45 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
              onClick={() => setPreviewImage(image)}
              aria-label={t("imagePreview.open", { image: imageAlt })}
            >
              <LazyImage
                src={image.src}
                alt={imageAlt}
                width={image.width}
                height={image.height}
                placeholderTitle={imageAlt}
                loadingLabel={t("common:imageLoading")}
                brightness={image.brightness}
                containerClassName="w-full"
                imageClassName="h-auto w-full object-contain transition-transform duration-300 group-hover/wall-image:scale-[1.015]"
                style={{ aspectRatio: `${image.width} / ${image.height}` }}
              />
            </button>
          )
        }}
      />

      <Dialog
        open={Boolean(previewImage)}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewImage(null)
          }
        }}
      >
        <DialogContent className="image-preview-dialog flex items-center justify-center overflow-hidden border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.66)] p-2 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-black/45 md:p-4 [&_[data-slot=dialog-close]]:right-3 [&_[data-slot=dialog-close]]:top-3 md:[&_[data-slot=dialog-close]]:right-4 md:[&_[data-slot=dialog-close]]:top-4">
          <DialogTitle className="sr-only">
            {previewImage ? t(previewImage.altKey) : t("imagePreview.title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {previewImage ? t(previewImage.altKey) : t("imagePreview.title")}
          </DialogDescription>
          {previewImage ? (
            <div className="relative flex h-full min-h-0 w-full min-w-0 items-center justify-center overflow-hidden">
              <img
                src={previewImage.src}
                alt={t(previewImage.altKey)}
                className="h-full w-full object-contain"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

export function KnowledgeDetailPage({ entries }: KnowledgeDetailPageProps) {
  const { entryId } = useParams()
  const { i18n, t } = useTranslation(["knowledge", "common"])
  const { isPlainDisplayMode } = useAnimationPreference()
  const entry = entries.find((item) => item.id === entryId)

  if (!entry) {
    if (isPlainDisplayMode) {
      return (
        <PlainDetailPage
          title={t("common:notFound.title")}
          summary={t("common:notFound.description")}
          kicker="404"
          fallback="/knowledge"
        />
      )
    }

    return (
      <Layout>
        <section className="flex min-h-[calc(100svh-11rem)] max-w-xl flex-col justify-center gap-5 py-12">
          <BackButton fallback="/knowledge" />
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/45">
            404
          </p>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {t("common:notFound.title")}
            </h1>
            <p className="text-base leading-relaxed text-foreground/70 sm:text-lg">
              {t("common:notFound.description")}
            </p>
          </div>
        </section>
      </Layout>
    )
  }

  const points = getPoints(t(`items.${entry.id}.points`, { returnObjects: true }))
  const updatedDate = getGitHubRepoUpdatedDate(entry.githubRepo, entry.updatedAt)
  const updatedLabel = updatedDate
    ? new Intl.DateTimeFormat(i18n.language, {
        month: "long",
        year: "numeric",
      }).format(updatedDate)
    : entry.updatedAt

  if (isPlainDisplayMode) {
    return (
      <PlainDetailPage
        title={t(`items.${entry.id}.title`)}
        summary={t(`items.${entry.id}.summary`)}
        kicker={t("title")}
        fallback="/knowledge"
        images={entry.images?.map((image) => ({
          src: image.src,
          alt: t(image.altKey),
          width: image.width,
          height: image.height,
        }))}
        meta={[
          t(`kinds.${entry.kind}`),
          `${t("updatedLabel")} ${updatedLabel}`,
        ]}
        tags={entry.tags.map((tag) => ({
          label: tag,
          className: defaultTagClassName,
        }))}
        links={[
          {
            label: entry.repoName,
            href: entry.url,
            meta: entry.repoTags?.map((repoTag) => ({
              label: t(`repoTags.${repoTag}`),
              className: getSemanticTagClassName(repoTag),
            })),
          },
          ...(entry.externalLinks?.map((link) => ({
            label: t(link.labelKey),
            href: link.url,
            meta: link.badgeKeys?.map((badgeKey) => ({
              label: t(badgeKey),
              className: badgeKey.endsWith(".loginRequired")
                ? "border-rose-400/25 bg-rose-400/10 text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200"
                : "border-amber-400/30 bg-amber-400/12 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200",
            })),
          })) ?? []),
        ]}
        sections={[
          {
            title: t("common:details.highlights"),
            bullets: points,
          },
        ]}
        linksTitle={t("common:details.links")}
        tagsTitle={t("common:details.tags")}
      />
    )
  }

  return (
    <Layout>
      <article className="mx-auto mt-4 flex w-full max-w-7xl flex-col gap-10 sm:mt-8 sm:gap-14">
        <div className={cn("flex flex-col pb-1 pt-1 sm:pb-2 sm:pt-2", detailSectionClassName)}>
          <BackButton fallback="/knowledge" />

          <header className="flex w-full flex-col gap-5">
            <p className="text-sm font-semibold text-foreground/55 dark:text-foreground/65">
              {t("title")}
            </p>
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                {t(`items.${entry.id}.title`)}
              </h1>
              <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 pt-1 sm:pt-2">
                <span
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-base font-semibold leading-none",
                    kindClassName[entry.kind],
                  )}
                >
                  {t(`kinds.${entry.kind}`)}
                </span>
                <span className="ml-auto text-right text-base font-semibold text-foreground/45 dark:text-foreground/55">
                  {t("updatedLabel")} {updatedLabel}
                </span>
              </div>
              <p className="text-lg leading-relaxed text-foreground/80 dark:text-foreground/90 lg:text-xl">
                {t(`items.${entry.id}.summary`)}
              </p>
            </div>
          </header>
        </div>

        {entry.images?.length ? (
          <section className={detailSectionClassName}>
            <div className="overflow-hidden rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.32)] shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] md:hidden">
              <ProjectImageGallery
                images={entry.images}
                translationNamespace="knowledge"
              />
            </div>
            <KnowledgeImageWall images={entry.images} />
          </section>
        ) : null}

        <div className={cn("grid gap-7 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_30rem] xl:grid-cols-[minmax(0,1fr)_34rem]", detailSectionClassName)}>
          <section className="order-2 flex min-w-0 flex-col lg:order-1 lg:-mt-1">
            <FeaturePointList points={points} className="gap-3 text-base" />
          </section>

          <aside className="order-1 flex min-w-0 flex-col gap-3 lg:order-2">
            <GlassPanel className="flex flex-col gap-2.5 p-4">
              <a
                href={entry.url}
                target="_blank"
                rel="noreferrer"
                className="group/repo flex min-w-0 flex-nowrap items-center gap-1.5 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground dark:text-foreground/80"
              >
                {entry.repoTags?.map((repoTag) => (
                  <span
                    key={repoTag}
                    className={cn(
                      "shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none",
                      getSemanticTagClassName(repoTag),
                    )}
                  >
                    {t(`repoTags.${repoTag}`)}
                  </span>
                ))}
                <span className="min-w-0 max-w-[8rem] truncate sm:max-w-[10rem] md:max-w-[14rem] lg:max-w-[20rem] xl:max-w-[24rem]">
                  {entry.repoName}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5" />
                <GitHubRepoStats repo={entry.githubRepo} />
              </a>
              {entry.externalLinks?.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group/external flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-sm font-normal text-foreground/62 transition-colors hover:text-foreground/90 dark:text-foreground/72 dark:hover:text-foreground"
                >
                  {link.badgeKeys?.map((badgeKey) => (
                    <span
                      key={badgeKey}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none whitespace-nowrap",
                        badgeKey.endsWith(".loginRequired")
                          ? "border-rose-400/25 bg-rose-400/10 text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200"
                          : "border-amber-400/30 bg-amber-400/12 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200",
                      )}
                    >
                      {t(badgeKey)}
                    </span>
                  ))}
                  <span>{t(link.labelKey)}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover/external:-translate-y-0.5 group-hover/external:translate-x-0.5" />
                </a>
              ))}
            </GlassPanel>

            <div className="flex flex-wrap gap-1.5 px-1 py-1">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-semibold",
                    defaultTagClassName,
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </article>
    </Layout>
  )
}

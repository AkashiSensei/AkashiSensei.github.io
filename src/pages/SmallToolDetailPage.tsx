import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { BackButton } from "@/components/BackButton"
import { FeaturePointList } from "@/components/FeaturePointList"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { GlassPanel } from "@/components/GlassPanel"
import { Layout } from "@/components/Layout"
import { LazyImage } from "@/components/LazyImage"
import { SmallToolImageGallery } from "@/components/SmallToolImageGallery"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { type SmallTool } from "@/data/tools"
import { cn } from "@/lib/utils"

type SmallToolDetailPageProps = {
  tools: SmallTool[]
}

const roleClassName = {
  author:
    "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-300/15 dark:text-emerald-200",
  contributor:
    "border-sky-300/60 bg-sky-100/70 text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/15 dark:text-sky-200",
} satisfies Record<SmallTool["role"], string>

const detailSectionClassName = "px-2 sm:px-4"

function getPoints(value: unknown) {
  return Array.isArray(value) ? value.filter((point): point is string => typeof point === "string") : []
}

function SmallToolImageWall({
  images,
}: {
  images: NonNullable<SmallTool["screenshots"]>
}) {
  const { t } = useTranslation("common")
  const [previewImage, setPreviewImage] = useState<
    NonNullable<SmallTool["screenshots"]>[number] | null
  >(null)

  return (
    <>
      <div className="hidden md:block">
        <div className="columns-2 gap-3 xl:columns-3">
          {images.map((image) => (
            <button
              key={image.src}
              type="button"
              className="group/wall-image mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/40 bg-white/30 p-0 text-left shadow-sm backdrop-blur-md transition-colors hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/45 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
              onClick={() => setPreviewImage(image)}
              aria-label={image.alt}
            >
              <LazyImage
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                placeholderTitle={image.alt}
                loadingLabel={t("imageLoading")}
                containerClassName="w-full"
                imageClassName="h-auto w-full object-contain transition-transform duration-300 group-hover/wall-image:scale-[1.015]"
                style={{ aspectRatio: `${image.width} / ${image.height}` }}
              />
            </button>
          ))}
        </div>
      </div>

      <Dialog
        open={Boolean(previewImage)}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewImage(null)
          }
        }}
      >
        <DialogContent className="flex h-[calc(100dvh-8rem)] max-h-[calc(100dvh-8rem)] w-[calc(100vw-1rem)] max-w-[120rem] items-center justify-center overflow-hidden border-white/40 bg-white/60 p-2 shadow-lg backdrop-blur-xl sm:max-w-[120rem] dark:border-white/10 dark:bg-black/45 md:h-[calc(100dvh-12rem)] md:max-h-[calc(100dvh-12rem)] md:w-[calc(100vw-4rem)] md:p-4 [&_[data-slot=dialog-close]]:right-3 [&_[data-slot=dialog-close]]:top-3 md:[&_[data-slot=dialog-close]]:right-4 md:[&_[data-slot=dialog-close]]:top-4">
          <DialogTitle className="sr-only">
            {previewImage?.alt ?? t("imageLoading")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {previewImage?.alt ?? t("imageLoading")}
          </DialogDescription>
          {previewImage ? (
            <img
              src={previewImage.src}
              alt={previewImage.alt}
              className="max-h-full max-w-full object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

export function SmallToolDetailPage({ tools }: SmallToolDetailPageProps) {
  const { toolId } = useParams()
  const { t } = useTranslation(["tools", "common"])
  const tool = tools.find((entry) => entry.id === toolId)

  if (!tool) {
    return (
      <Layout>
        <section className="flex min-h-[calc(100svh-11rem)] max-w-xl flex-col justify-center gap-5 py-12">
          <BackButton fallback="/tools" />
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

  const points = getPoints(t(`items.${tool.id}.points`, { returnObjects: true }))

  return (
    <Layout>
      <article className="mt-4 flex w-full max-w-5xl flex-col gap-10 sm:mt-8 sm:gap-14">
        <div className={cn("flex flex-col pb-1 pt-1 sm:pb-2 sm:pt-2", detailSectionClassName)}>
          <BackButton fallback="/tools" />

          <header className="flex max-w-4xl flex-col gap-5">
            <p className="text-sm font-semibold text-foreground/55 dark:text-foreground/65">
              {t("title")}
            </p>
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                {t(`items.${tool.id}.title`)}
              </h1>
              <p className="text-base leading-relaxed text-foreground/80 dark:text-foreground/90 sm:text-lg">
                {t(`items.${tool.id}.summary`)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
                  roleClassName[tool.role],
                )}
              >
                {t(`labels.${tool.role}`)}
              </span>
              {tool.status ? (
                <span className="rounded-full border border-white/45 bg-white/25 px-2.5 py-1 text-xs font-semibold text-foreground/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/70">
                  {t(`labels.${tool.status}`)}
                </span>
              ) : null}
              {tool.archived ? (
                <span className="rounded-full border border-zinc-300/70 bg-zinc-100/80 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:border-zinc-300/25 dark:bg-zinc-300/10 dark:text-zinc-200">
                  {t("labels.archived")}
                </span>
              ) : null}
            </div>
          </header>
        </div>

        {tool.screenshots?.length ? (
          <section className={detailSectionClassName}>
            <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/30 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] md:hidden">
              <SmallToolImageGallery images={tool.screenshots} />
            </div>
            <SmallToolImageWall images={tool.screenshots} />
          </section>
        ) : tool.screenshot ? (
          <section className={detailSectionClassName}>
            <div className="overflow-hidden rounded-2xl border border-white/40 bg-white/30 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
              <LazyImage
                src={tool.screenshot.src}
                alt={tool.screenshot.alt}
                placeholderTitle={tool.screenshot.alt}
                loadingLabel={t("common:imageLoading")}
                containerClassName="aspect-[16/9] w-full"
                imageClassName="h-full w-full object-contain"
              />
            </div>
          </section>
        ) : null}

        <div className={cn("grid gap-7 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]", detailSectionClassName)}>
          <section className="order-2 flex min-w-0 flex-col lg:order-1 lg:pt-3">
            <FeaturePointList
              points={points}
              highlightedIndexes={tool.highlightPointIndexes}
              className="gap-3 text-base"
            />
          </section>

          <aside className="order-1 flex min-w-0 flex-col gap-3 lg:order-2">
            <GlassPanel className="flex flex-col p-4">
              {tool.repoUrl && tool.repoName ? (
                <a
                  href={tool.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/repo flex min-w-0 items-center gap-1.5 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground dark:text-foreground/80"
                >
                  <span className="min-w-0 truncate">{tool.repoName}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5" />
                  <GitHubRepoStats repo={tool.githubRepo} />
                </a>
              ) : (
                <span className="text-sm font-semibold text-foreground/65 dark:text-foreground/75">
                  {tool.repoName ?? t("labels.privateTool")}
                </span>
              )}
            </GlassPanel>
          </aside>
        </div>
      </article>
    </Layout>
  )
}

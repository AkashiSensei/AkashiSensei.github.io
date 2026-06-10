import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"

import { BackButton } from "@/components/BackButton"
import { FeaturePointList } from "@/components/FeaturePointList"
import { GitHubRepoStats } from "@/components/GitHubRepoStats"
import { GlassPanel } from "@/components/GlassPanel"
import { ImageBrightnessOverlay } from "@/components/ImageBrightnessOverlay"
import { Layout } from "@/components/Layout"
import { LazyImage } from "@/components/LazyImage"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Project } from "@/data/projects"
import { getSemanticTagClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

type ProjectDetailPageProps = {
  projects: Project[]
  translationNamespace?: "projects" | "courseProjects"
  fallbackPath?: string
}

const lifecycleStatusClassName = {
  starting:
    "border-sky-300/60 bg-sky-100/70 text-sky-800 dark:border-sky-300/30 dark:bg-sky-300/15 dark:text-sky-200",
  ongoing:
    "border-emerald-300/60 bg-emerald-100/70 text-emerald-800 dark:border-emerald-300/30 dark:bg-emerald-300/15 dark:text-emerald-200",
  completed:
    "border-zinc-300/70 bg-zinc-100/80 text-zinc-700 dark:border-zinc-300/25 dark:bg-zinc-300/10 dark:text-zinc-200",
} satisfies Record<Project["lifecycleStatus"], string>

const detailTagClassName =
  "border-[rgb(var(--site-surface-rgb)_/_0.56)] bg-[rgb(var(--site-surface-rgb)_/_0.56)] text-foreground/75 shadow-sm shadow-black/5 backdrop-blur-md dark:border-white/20 dark:bg-white/12 dark:text-foreground/85 dark:shadow-black/20"

const detailSectionClassName = "px-2 sm:px-4"

function getPoints(value: unknown) {
  return Array.isArray(value) ? value.filter((point): point is string => typeof point === "string") : []
}

function ProjectImageWall({
  images,
  translationNamespace,
}: {
  images: Project["images"]
  translationNamespace: "projects" | "courseProjects"
}) {
  const { t } = useTranslation([translationNamespace, "common"])
  const [previewImage, setPreviewImage] = useState<
    NonNullable<Project["images"]>[number] | null
  >(null)

  if (!images?.length) {
    return null
  }

  return (
    <>
      <div className="hidden md:block">
        <div className="columns-2 gap-3 xl:columns-3">
          {images.map((image) => {
            const imageAlt = t(image.altKey)

            return (
              <button
                key={image.src}
                type="button"
                className="group/wall-image mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.32)] p-0 text-left shadow-sm backdrop-blur-md transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/45 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
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
          })}
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
        <DialogContent className="flex h-[calc(100dvh-8rem)] max-h-[calc(100dvh-8rem)] w-[calc(100vw-1rem)] max-w-[120rem] items-center justify-center overflow-hidden border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.66)] p-2 shadow-lg backdrop-blur-xl sm:max-w-[120rem] dark:border-white/10 dark:bg-black/45 md:h-[calc(100dvh-12rem)] md:max-h-[calc(100dvh-12rem)] md:w-[calc(100vw-4rem)] md:p-4 [&_[data-slot=dialog-close]]:right-3 [&_[data-slot=dialog-close]]:top-3 md:[&_[data-slot=dialog-close]]:right-4 md:[&_[data-slot=dialog-close]]:top-4">
          <DialogTitle className="sr-only">
            {previewImage ? t(previewImage.altKey) : t("imagePreview.title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {previewImage ? t(previewImage.altKey) : t("imagePreview.title")}
          </DialogDescription>
          {previewImage ? (
            <div className="relative flex max-h-full max-w-full overflow-hidden">
              <img
                src={previewImage.src}
                alt={t(previewImage.altKey)}
                className="max-h-full max-w-full object-contain"
              />
              <ImageBrightnessOverlay brightness={previewImage.brightness} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

export function ProjectDetailPage({
  projects,
  translationNamespace = "projects",
  fallbackPath = "/projects",
}: ProjectDetailPageProps) {
  const { projectId } = useParams()
  const { t } = useTranslation([translationNamespace, "common"])
  const project = projects.find((entry) => entry.id === projectId)

  if (!project) {
    return (
      <Layout>
        <section className="flex min-h-[calc(100svh-11rem)] max-w-xl flex-col justify-center gap-5 py-12">
          <BackButton fallback={fallbackPath} />
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

  const title = t(`items.${project.id}.title`)
  const points = getPoints(t(`items.${project.id}.points`, { returnObjects: true }))
  const repoLinks =
    project.links ??
    (project.externalUrl || project.repoName
      ? [
          {
            label: project.repoName,
            url: project.externalUrl,
            githubRepo: project.githubRepo,
            repoTags: project.repoTags,
          },
        ]
      : [])

  return (
    <Layout>
      <article className="mt-4 flex w-full max-w-5xl flex-col gap-10 sm:mt-8 sm:gap-14">
        <div className={cn("flex flex-col pb-1 pt-1 sm:pb-2 sm:pt-2", detailSectionClassName)}>
          <BackButton fallback={fallbackPath} />

          <header className="flex max-w-4xl flex-col gap-5">
            <p className="text-sm font-semibold text-foreground/55 dark:text-foreground/65">
              {t("title")}
            </p>
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                {title}
              </h1>
              <p className="text-base leading-relaxed text-foreground/80 dark:text-foreground/90 sm:text-lg">
                {t(`items.${project.id}.summary`)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
                  lifecycleStatusClassName[project.lifecycleStatus],
                )}
              >
                {t(`lifecycleStatus.${project.lifecycleStatus}`)}
              </span>
              {project.status?.map((status) => (
                <span
                  key={status}
                  className="rounded-full border border-[rgb(var(--site-surface-rgb)_/_0.45)] bg-[rgb(var(--site-surface-rgb)_/_0.28)] px-2.5 py-1 text-xs font-semibold text-foreground/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground/70"
                >
                  {t(`status.${status}`)}
                </span>
              ))}
            </div>
          </header>
        </div>

        {project.images?.length ? (
          <section className={detailSectionClassName}>
            <div className="overflow-hidden rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.32)] shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] md:hidden">
              <ProjectImageGallery
                images={project.images}
                translationNamespace={translationNamespace}
              />
            </div>
            <ProjectImageWall
              images={project.images}
              translationNamespace={translationNamespace}
            />
          </section>
        ) : project.screenshot ? (
          <section className={detailSectionClassName}>
            <div className="overflow-hidden rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.32)] shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
              <LazyImage
                src={project.screenshot.src}
                alt={t(project.screenshot.altKey)}
                placeholderTitle={t(project.screenshot.altKey)}
                loadingLabel={t("common:imageLoading")}
                brightness={project.screenshot.brightness}
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
              highlightedIndexes={project.highlightPointIndexes}
              className="gap-3 text-base"
            />
          </section>

          <aside className="order-1 flex min-w-0 flex-col gap-3 lg:order-2">
            {repoLinks.length ? (
              <GlassPanel className="flex flex-col p-4">
                <div className="flex flex-col gap-2">
                  {repoLinks.map((link) => (
                    <a
                      key={link.url ?? link.label}
                      href={link.url}
                      target={link.url ? "_blank" : undefined}
                      rel={link.url ? "noreferrer" : undefined}
                      className={cn(
                        "group/repo flex min-w-0 flex-wrap items-center gap-1.5 text-sm font-semibold text-foreground/70 transition-colors dark:text-foreground/80",
                        link.url && "hover:text-foreground",
                      )}
                    >
                      {link.repoTags?.map((repoTag) => (
                        <span
                          key={repoTag}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold leading-none",
                            getSemanticTagClassName(repoTag),
                            "whitespace-nowrap",
                          )}
                        >
                          {t(`repoTags.${repoTag}`)}
                        </span>
                      ))}
                      <span className="min-w-0 truncate">{link.label}</span>
                      {link.url ? (
                        <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5" />
                      ) : null}
                      <GitHubRepoStats repo={link.githubRepo} />
                    </a>
                  ))}
                </div>
              </GlassPanel>
            ) : null}

            <div className="flex flex-wrap gap-1.5 px-1 py-1">
              {project.tags.map((tag, tagIndex) => {
                const isCourseProjectTimeTag =
                  translationNamespace === "courseProjects" && tagIndex < 2
                const tagLabel = isCourseProjectTimeTag
                  ? t(`semesterTags.${tag}`, { defaultValue: tag })
                  : tag

                return (
                  <span
                    key={tag}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-semibold",
                      detailTagClassName,
                    )}
                  >
                    {tagLabel}
                  </span>
                )
              })}
            </div>
          </aside>
        </div>
      </article>
    </Layout>
  )
}

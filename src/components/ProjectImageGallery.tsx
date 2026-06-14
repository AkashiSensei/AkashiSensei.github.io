import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { ImageBrightnessOverlay } from "@/components/ImageBrightnessOverlay"
import { LazyImage } from "@/components/LazyImage"
import { type ProjectImage } from "@/data/projects"
import { cn } from "@/lib/utils"

type ProjectImageGalleryProps = {
  cardAspectRatio?: string
  cardAutoCycle?: boolean
  cardAutoCycleStaggerIndex?: number
  images: ProjectImage[]
  cardScrollable?: boolean
  cardImageFit?: "contain" | "cover"
  className?: string
  translationNamespace?: "projects" | "courseProjects" | "knowledge"
}

const CARD_AUTO_CYCLE_INTERVAL_MS = 6800
const CARD_AUTO_CYCLE_STAGGER_MS = 1300
const MIN_CARD_IMAGE_ASPECT_RATIO = 4 / 5
const MAX_CARD_IMAGE_ASPECT_RATIO = 16 / 9
const CARD_IMAGE_GALLERY_MAX_HEIGHT = "min(72vh, 32rem)"

function getBoundedImageAspectRatio(image: ProjectImage) {
  const rawRatio = image.width / image.height
  const boundedRatio = Number.isFinite(rawRatio) && rawRatio > 0
    ? Math.min(
        Math.max(rawRatio, MIN_CARD_IMAGE_ASPECT_RATIO),
        MAX_CARD_IMAGE_ASPECT_RATIO,
      )
    : 16 / 10

  return `${boundedRatio.toFixed(4)} / 1`
}

function scrollGalleryToIndex(
  gallery: HTMLDivElement | null,
  imageIndex: number,
  behavior: ScrollBehavior = "smooth",
) {
  if (!gallery) {
    return
  }

  gallery.scrollTo({
    left: gallery.clientWidth * imageIndex,
    behavior,
  })
}

function positionThumbnailIndicator(
  indicator: HTMLDivElement | null,
  thumbnail: HTMLButtonElement | null,
  animate = true,
) {
  if (!indicator || !thumbnail) {
    return
  }

  if (!animate) {
    indicator.style.transition = "none"
  }

  indicator.style.width = `${thumbnail.offsetWidth}px`
  indicator.style.height = `${thumbnail.offsetHeight}px`
  indicator.style.transform = `translate3d(${thumbnail.offsetLeft}px, ${thumbnail.offsetTop}px, 0)`
  indicator.style.opacity = "1"

  if (!animate) {
    window.requestAnimationFrame(() => {
      indicator.style.transition = ""
    })
  }
}

export function ProjectImageGallery({
  cardAspectRatio,
  cardAutoCycle = false,
  cardAutoCycleStaggerIndex = 0,
  cardImageFit = "contain",
  cardScrollable = true,
  images,
  className,
  translationNamespace = "projects",
}: ProjectImageGalleryProps) {
  const { t } = useTranslation([translationNamespace, "common"])
  const galleryRef = useRef<HTMLDivElement>(null)
  const previewGalleryRef = useRef<HTMLDivElement>(null)
  const initialPreviewImageIndexRef = useRef<number | null>(null)
  const programmaticPreviewTargetRef = useRef<number | null>(null)
  const programmaticPreviewTimeoutRef = useRef<number | null>(null)
  const thumbnailRailRef = useRef<HTMLDivElement>(null)
  const thumbnailIndicatorRef = useRef<HTMLDivElement>(null)
  const thumbnailScrollBehaviorRef = useRef<ScrollBehavior>("smooth")
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [captionImageIndex, setCaptionImageIndex] = useState(0)
  const [captionVisible, setCaptionVisible] = useState(true)
  const [previewOpen, setPreviewOpen] = useState(false)
  const firstImage = images[0]
  const selectedImageIndex = images.length > 0
    ? Math.min(selectedIndex, images.length - 1)
    : 0

  function clearProgrammaticPreviewTarget() {
    if (programmaticPreviewTimeoutRef.current !== null) {
      window.clearTimeout(programmaticPreviewTimeoutRef.current)
      programmaticPreviewTimeoutRef.current = null
    }

    programmaticPreviewTargetRef.current = null
  }

  function scrollPreviewGalleryToIndex(
    imageIndex: number,
    behavior: ScrollBehavior = "smooth",
  ) {
    if (behavior === "smooth") {
      programmaticPreviewTargetRef.current = imageIndex

      if (programmaticPreviewTimeoutRef.current !== null) {
        window.clearTimeout(programmaticPreviewTimeoutRef.current)
      }

      programmaticPreviewTimeoutRef.current = window.setTimeout(() => {
        programmaticPreviewTargetRef.current = null
        programmaticPreviewTimeoutRef.current = null
      }, 1000)
    } else {
      clearProgrammaticPreviewTarget()
    }

    scrollGalleryToIndex(previewGalleryRef.current, imageIndex, behavior)
  }

  function scrollCardGalleryToIndex(
    imageIndex: number,
    behavior: ScrollBehavior = "smooth",
  ) {
    scrollGalleryToIndex(galleryRef.current, imageIndex, behavior)
  }

  useLayoutEffect(() => {
    if (!previewOpen || initialPreviewImageIndexRef.current === null) {
      return
    }

    if (programmaticPreviewTimeoutRef.current !== null) {
      window.clearTimeout(programmaticPreviewTimeoutRef.current)
      programmaticPreviewTimeoutRef.current = null
    }

    programmaticPreviewTargetRef.current = null
    scrollGalleryToIndex(
      previewGalleryRef.current,
      initialPreviewImageIndexRef.current,
      "auto",
    )
    initialPreviewImageIndexRef.current = null
  }, [previewOpen])

  useLayoutEffect(() => {
    if (!previewOpen) {
      return
    }

    const behavior = thumbnailScrollBehaviorRef.current
    const animate = behavior !== "auto"

    const syncThumbnailSelection = () => {
      const selectedThumbnail = thumbnailRefs.current[selectedImageIndex]

      selectedThumbnail?.scrollIntoView({
        behavior,
        block: "nearest",
        inline: "center",
      })
      positionThumbnailIndicator(
        thumbnailIndicatorRef.current,
        selectedThumbnail,
        animate,
      )
    }

    syncThumbnailSelection()
    let secondFrameId: number | null = null
    const firstFrameId = window.requestAnimationFrame(() => {
      syncThumbnailSelection()
      secondFrameId = window.requestAnimationFrame(syncThumbnailSelection)
    })
    const timeoutId = window.setTimeout(syncThumbnailSelection, 80)

    thumbnailScrollBehaviorRef.current = "smooth"

    return () => {
      window.cancelAnimationFrame(firstFrameId)
      if (secondFrameId !== null) {
        window.cancelAnimationFrame(secondFrameId)
      }
      window.clearTimeout(timeoutId)
    }
  }, [previewOpen, selectedImageIndex])

  useEffect(() => {
    if (!previewOpen) {
      return
    }

    const handleResize = () => {
      positionThumbnailIndicator(
        thumbnailIndicatorRef.current,
        thumbnailRefs.current[selectedImageIndex],
      )
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [previewOpen, selectedImageIndex])

  useEffect(() => {
    if (!previewOpen || images.length <= 1) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return
      }

      event.preventDefault()
      setSelectedIndex((currentIndex) => {
        const boundedIndex = Math.min(currentIndex, images.length - 1)
        const nextIndex = event.key === "ArrowLeft"
          ? (boundedIndex - 1 + images.length) % images.length
          : (boundedIndex + 1) % images.length

        scrollGalleryToIndex(galleryRef.current, nextIndex)
        programmaticPreviewTargetRef.current = nextIndex

        if (programmaticPreviewTimeoutRef.current !== null) {
          window.clearTimeout(programmaticPreviewTimeoutRef.current)
        }

        programmaticPreviewTimeoutRef.current = window.setTimeout(() => {
          programmaticPreviewTargetRef.current = null
          programmaticPreviewTimeoutRef.current = null
        }, 1000)

        scrollGalleryToIndex(previewGalleryRef.current, nextIndex)

        return nextIndex
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [images.length, previewOpen])

  useEffect(() => {
    if (!cardAutoCycle || previewOpen || images.length <= 1) {
      return undefined
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined
    }

    const showNextImage = () => {
      setSelectedIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % images.length

        setCaptionImageIndex(nextIndex)
        scrollGalleryToIndex(galleryRef.current, nextIndex)

        return nextIndex
      })
    }

    let intervalId: number | undefined
    const timeoutId = window.setTimeout(
      () => {
        showNextImage()
        intervalId = window.setInterval(
          showNextImage,
          CARD_AUTO_CYCLE_INTERVAL_MS,
        )
      },
      CARD_AUTO_CYCLE_INTERVAL_MS +
        cardAutoCycleStaggerIndex * CARD_AUTO_CYCLE_STAGGER_MS,
    )

    return () => {
      window.clearTimeout(timeoutId)
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [cardAutoCycle, cardAutoCycleStaggerIndex, images.length, previewOpen])

  useEffect(() => {
    if (!previewOpen) {
      return
    }

    const hideTimeoutId = window.setTimeout(() => {
      setCaptionVisible(false)
    }, 0)
    const timeoutId = window.setTimeout(() => {
      setCaptionImageIndex(selectedImageIndex)
      window.requestAnimationFrame(() => setCaptionVisible(true))
    }, 500)

    return () => {
      window.clearTimeout(hideTimeoutId)
      window.clearTimeout(timeoutId)
    }
  }, [previewOpen, selectedImageIndex])

  useEffect(() => {
    return () => clearProgrammaticPreviewTarget()
  }, [])

  if (!firstImage) {
    return null
  }

  const selectedImage = images[selectedImageIndex] ?? firstImage
  const captionImage = images[Math.min(captionImageIndex, images.length - 1)]
    ?? selectedImage
  const hasMultipleImages = images.length > 1
  const shouldRenderCardRail = cardScrollable || (cardAutoCycle && hasMultipleImages)
  const cardImages = shouldRenderCardRail ? images : [selectedImage]

  const openPreview = (imageIndex: number) => {
    initialPreviewImageIndexRef.current = imageIndex
    thumbnailScrollBehaviorRef.current = "auto"
    setSelectedIndex(imageIndex)
    setCaptionImageIndex(imageIndex)
    setCaptionVisible(false)
    setPreviewOpen(true)
  }

  const selectPreviewImage = (imageIndex: number) => {
    thumbnailScrollBehaviorRef.current = "smooth"
    setSelectedIndex(imageIndex)
    scrollCardGalleryToIndex(imageIndex)
    scrollPreviewGalleryToIndex(imageIndex)
  }

  const handleCardGalleryScroll = () => {
    if (previewOpen) {
      return
    }

    const gallery = galleryRef.current

    if (!gallery || gallery.clientWidth === 0) {
      return
    }

    const nextIndex = Math.round(gallery.scrollLeft / gallery.clientWidth)

    if (
      nextIndex < 0
      || nextIndex >= images.length
      || nextIndex === selectedImageIndex
    ) {
      return
    }

    setSelectedIndex(nextIndex)
    setCaptionImageIndex(nextIndex)
  }

  const handlePreviewScroll = () => {
    const previewGallery = previewGalleryRef.current

    if (!previewGallery || previewGallery.clientWidth === 0) {
      return
    }

    const programmaticTarget = programmaticPreviewTargetRef.current

    if (programmaticTarget !== null) {
      const targetLeft = previewGallery.clientWidth * programmaticTarget

      if (Math.abs(previewGallery.scrollLeft - targetLeft) <= 2) {
        clearProgrammaticPreviewTarget()
      }

      return
    }

    const nextIndex = Math.round(
      previewGallery.scrollLeft / previewGallery.clientWidth,
    )

    if (
      nextIndex < 0
      || nextIndex >= images.length
      || nextIndex === selectedImageIndex
    ) {
      return
    }

    setSelectedIndex(nextIndex)
    scrollCardGalleryToIndex(nextIndex)
  }

  return (
    <>
      <div
        ref={galleryRef}
        className={cn(
          "flex w-full min-w-0 max-w-full shrink-0 overscroll-y-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          cardScrollable
            ? "max-h-[72svh] snap-x snap-mandatory overflow-x-auto md:max-h-none"
            : shouldRenderCardRail
              ? "max-h-full snap-x snap-mandatory overflow-hidden"
              : "max-h-full overflow-hidden",
          className,
        )}
        style={{
          aspectRatio: cardAspectRatio ?? getBoundedImageAspectRatio(firstImage),
          maxHeight: cardAspectRatio ? undefined : CARD_IMAGE_GALLERY_MAX_HEIGHT,
          touchAction: cardScrollable ? "pan-x" : "pan-y",
        }}
        onScroll={cardScrollable ? handleCardGalleryScroll : undefined}
      >
        {cardImages.map((image, renderedImageIndex) => {
          const imageIndex = shouldRenderCardRail
            ? renderedImageIndex
            : selectedImageIndex

          return (
            <div
              key={image.src}
              role="button"
              tabIndex={cardScrollable || imageIndex === selectedImageIndex ? 0 : -1}
              aria-hidden={!cardScrollable && imageIndex !== selectedImageIndex}
              className="relative flex h-full min-w-0 basis-full shrink-0 snap-start items-center justify-center overflow-hidden p-0"
              style={{ touchAction: cardScrollable ? "pan-x" : "pan-y" }}
              onClick={() => openPreview(imageIndex)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") {
                  return
                }

                event.preventDefault()
                openPreview(imageIndex)
              }}
              aria-label={t("imagePreview.open", { image: t(image.altKey) })}
            >
              <LazyImage
                src={image.src}
                alt={t(image.altKey)}
                placeholderTitle={t(image.altKey)}
                loadingLabel={t("common:imageLoading")}
                brightness={image.brightness}
                containerClassName="relative z-10 h-full w-full min-w-0 max-w-full"
                imageClassName={cn(
                  "block h-full w-full max-w-full",
                  cardImageFit === "cover" ? "object-cover" : "object-contain",
                )}
                draggable={false}
                style={{ touchAction: cardScrollable ? "pan-x" : "pan-y" }}
              />
            </div>
          )
        })}
      </div>

      <Dialog
        open={previewOpen}
        onOpenChange={(open) => {
          if (!open) {
            clearProgrammaticPreviewTarget()
          }

          setPreviewOpen(open)
        }}
      >
        <DialogContent
          className="flex h-[calc(100dvh-8rem)] max-h-[calc(100dvh-8rem)] w-[calc(100vw-1rem)] max-w-[120rem] flex-col gap-2 overflow-hidden border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.66)] p-2 shadow-lg backdrop-blur-xl sm:max-w-[120rem] dark:border-white/10 dark:bg-black/45 md:h-[calc(100dvh-12rem)] md:max-h-[calc(100dvh-12rem)] md:w-[calc(100vw-4rem)] md:p-3 [&_[data-slot=dialog-close]]:right-3 [&_[data-slot=dialog-close]]:top-3 md:[&_[data-slot=dialog-close]]:right-4 md:[&_[data-slot=dialog-close]]:top-4"
        >
          <DialogTitle className="sr-only">
            {selectedImage ? t(selectedImage.altKey) : t("imagePreview.title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {selectedImageIndex + 1} / {images.length}
          </DialogDescription>
          <div
            ref={previewGalleryRef}
            className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={handlePreviewScroll}
          >
            {images.map((image) => (
              <div
                key={image.src}
                className="flex h-full min-w-0 basis-full shrink-0 snap-start items-center justify-center px-2 pb-1 pt-10 md:px-4 md:pt-12"
              >
                <div className="relative flex min-h-0 min-w-0 max-h-full max-w-full items-center justify-center overflow-hidden">
                  <img
                    src={image.src}
                    alt={t(image.altKey)}
                    className="h-auto w-auto max-h-full max-w-full object-contain"
                  />
                  <ImageBrightnessOverlay brightness={image.brightness} />
                </div>
              </div>
            ))}
          </div>
          <p
            className="flex h-6 shrink-0 items-center justify-center px-8 text-center text-sm font-medium leading-6 text-foreground/65 dark:text-white/90 md:h-8 md:text-lg md:leading-8"
            aria-live="polite"
          >
            <span
              className={cn(
                "block max-w-full truncate transition-opacity duration-200",
                captionVisible ? "opacity-100" : "opacity-0",
              )}
            >
              {t(captionImage.altKey)}
            </span>
          </p>
          {hasMultipleImages ? (
            <div
              ref={thumbnailRailRef}
              className="relative flex w-full max-w-full gap-1.5 overflow-x-auto rounded-lg border border-foreground/10 bg-[rgb(var(--site-surface-rgb)_/_0.38)] p-1.5 [scrollbar-width:none] dark:border-white/10 dark:bg-black/25 md:gap-2 md:p-2 [&::-webkit-scrollbar]:hidden"
            >
              <div
                ref={thumbnailIndicatorRef}
                className="pointer-events-none absolute left-0 top-0 z-10 rounded-md border border-foreground/65 opacity-0 ring-2 ring-foreground/25 transition-[transform,width,height,opacity] duration-300 ease-out dark:border-white/80 dark:ring-white/25"
                aria-hidden="true"
              />
              {images.map((image, imageIndex) => {
                const imageAlt = t(image.altKey)
                const isSelected = selectedImageIndex === imageIndex

                return (
                  <button
                    key={image.src}
                    ref={(node) => {
                      thumbnailRefs.current[imageIndex] = node
                    }}
                    type="button"
                    className={cn(
                      "h-14 w-20 shrink-0 overflow-hidden rounded-md border border-foreground/15 bg-background/60 p-0.5 transition md:h-20 md:w-32",
                      isSelected
                        ? "opacity-100"
                        : "opacity-70 hover:border-foreground/35 hover:opacity-100",
                    )}
                    onClick={() => selectPreviewImage(imageIndex)}
                    aria-label={t("imagePreview.open", { image: imageAlt })}
                    aria-pressed={isSelected}
                  >
                    <span className="relative block h-full w-full overflow-hidden rounded-[0.2rem]">
                      <img
                        src={image.src}
                        alt={imageAlt}
                        loading="lazy"
                        className="h-full w-full object-contain"
                      />
                      <ImageBrightnessOverlay brightness={image.brightness} />
                    </span>
                  </button>
                )
              })}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

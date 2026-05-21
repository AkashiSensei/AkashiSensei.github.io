import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { type ProjectImage } from "@/data/projects"
import { cn } from "@/lib/utils"

type ProjectImageGalleryProps = {
  images: ProjectImage[]
  className?: string
}

export function ProjectImageGallery({ images, className }: ProjectImageGalleryProps) {
  const { t } = useTranslation("projects")
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null)
  const firstImage = images[0]

  if (!firstImage) {
    return null
  }

  return (
    <>
      <div
        className={cn(
          "flex w-full shrink-0 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
        style={{ aspectRatio: `${firstImage.width} / ${firstImage.height}` }}
      >
        {images.map((image) => (
          <button
            key={image.src}
            type="button"
            className="flex h-full basis-full shrink-0 snap-start items-center justify-center overflow-hidden p-0"
            onClick={() => setSelectedImage(image)}
            aria-label={t("imagePreview.open", { image: t(image.altKey) })}
          >
            <img
              src={image.src}
              alt={t(image.altKey)}
              loading="lazy"
              className="block h-full w-full object-contain"
            />
          </button>
        ))}
      </div>

      <Dialog
        open={Boolean(selectedImage)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedImage(null)
          }
        }}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] overflow-hidden bg-background/95 p-2 sm:max-w-6xl">
          <DialogTitle className="sr-only">
            {selectedImage ? t(selectedImage.altKey) : t("imagePreview.title")}
          </DialogTitle>
          {selectedImage ? (
            <img
              src={selectedImage.src}
              alt={t(selectedImage.altKey)}
              className="max-h-[calc(100vh-4rem)] w-full object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

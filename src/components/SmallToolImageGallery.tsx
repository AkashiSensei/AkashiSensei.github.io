import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { LazyImage } from "@/components/LazyImage"
import { type SmallTool } from "@/data/tools"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

type SmallToolScreenshot = NonNullable<SmallTool["screenshots"]>[number]

type SmallToolImageGalleryProps = {
  images: SmallToolScreenshot[]
  className?: string
}

export function SmallToolImageGallery({
  images,
  className,
}: SmallToolImageGalleryProps) {
  const { t } = useTranslation("common")
  const [selectedImage, setSelectedImage] = useState<SmallToolScreenshot | null>(null)
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
            aria-label={image.alt}
          >
            <LazyImage
              src={image.src}
              alt={image.alt}
              placeholderTitle={image.alt}
              loadingLabel={t("imageLoading")}
              containerClassName="h-full w-full"
              imageClassName="block h-full w-full object-contain"
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
            {selectedImage?.alt ?? firstImage.alt}
          </DialogTitle>
          {selectedImage ? (
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[calc(100vh-4rem)] w-full object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}

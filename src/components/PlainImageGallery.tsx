import { useTranslation } from "react-i18next"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import type { PlainIndexImage } from "@/components/PlainIndexPage"

export function PlainImageGallery({ images, single = false, imageClassName }: {
  images: PlainIndexImage[]
  single?: boolean
  imageClassName?: string
}) {
  const { t } = useTranslation("projects")

  return <ProjectImageGallery
    images={images.map((image) => ({
      src: image.src,
      altKey: image.title ?? image.alt,
      width: image.width ?? 1,
      height: image.height ?? 1,
    }))}
    labelsAreLocalized
    renderTrigger={(openImage) => {
      const triggers = images.map((image, index) => {
        const trigger = <button
          type="button"
          className="plain-image-trigger"
          aria-label={t("imagePreview.open", { image: image.alt })}
          onClick={(event) => openImage(index, event.currentTarget)}
        >
          <img src={image.src} alt={image.alt} width={image.width} height={image.height}
            loading="lazy" className={imageClassName} />
        </button>

        return single ? <span className="plain-image-preview" key={image.src}>{trigger}</span> : (
          <figure key={image.src}>
            {trigger}
            {image.title ? <figcaption>{image.title}</figcaption> : null}
          </figure>
        )
      })
      return single ? triggers : <div className="plain-detail-image-grid">{triggers}</div>
    }}
  />
}

import { useTranslation } from "react-i18next"
import { ImageBrightnessOverlay } from "@/components/ImageBrightnessOverlay"
import { ProjectImageGallery } from "@/components/ProjectImageGallery"
import { localizeQuestionImage, type resolveQuestionImage } from "@/lib/question-images"

export function QuestionImageBubble({ image: reference, side = "question" }: {
  image: NonNullable<ReturnType<typeof resolveQuestionImage>>
  side?: "question" | "answer"
}) {
  const { t, i18n } = useTranslation(["projects", "courseProjects", "questions"])
  const image = localizeQuestionImage(reference, i18n.resolvedLanguage ?? i18n.language)
  const label = t(`${image.namespace}:${image.altKey}`)
  return <figure className={`question-message question-message-${side} question-message-image`}>
    <ProjectImageGallery images={[{ ...image, altKey: label }]} labelsAreLocalized
      renderTrigger={(openImage) => <button type="button"
        className={`question-bubble ${side === "question" ? "question-bubble-question " : ""}question-bubble-image question-image-trigger`}
        aria-label={t("projects:imagePreview.open", { image: label })}
        onClick={(event) => openImage(0, event.currentTarget)}>
        <span className="question-image-surface block">
          <img src={image.src} alt={label} width={image.width} height={image.height} />
          <ImageBrightnessOverlay brightness={image.brightness} />
        </span>
      </button>} />
  </figure>
}

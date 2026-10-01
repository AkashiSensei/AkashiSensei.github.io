import { useTranslation } from "react-i18next"
import { ImageBrightnessOverlay } from "@/components/ImageBrightnessOverlay"
import type { resolveQuestionImage } from "@/lib/question-images"

export function QuestionImageBubble({ image }: { image: NonNullable<ReturnType<typeof resolveQuestionImage>> }) {
  const { t } = useTranslation(["projects", "courseProjects"])
  return <figure className="question-message question-message-question question-message-image">
    <div className="question-bubble question-bubble-question question-bubble-image">
      <div className="question-image-surface">
        <img src={image.src} alt={t(`${image.namespace}:${image.altKey}`)} width={image.width} height={image.height} />
        <ImageBrightnessOverlay brightness={image.brightness} />
      </div>
    </div>
  </figure>
}

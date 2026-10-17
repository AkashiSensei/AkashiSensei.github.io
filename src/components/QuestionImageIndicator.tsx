import { ImageIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

export function QuestionImageIndicator({ hasImages }: { hasImages: boolean }) {
  const { t } = useTranslation("questions")
  if (!hasImages) return null
  return <>
    <span className="question-image-indicator" aria-hidden="true"><ImageIcon size={20} /></span>
    <span className="sr-only">{t("hasImages")}</span>
  </>
}

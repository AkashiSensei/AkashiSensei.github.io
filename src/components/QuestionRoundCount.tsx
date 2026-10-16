import { useTranslation } from "react-i18next"

export function QuestionRoundCount({ count }: { count: number }) {
  const { t } = useTranslation("questions")
  if (count <= 1) return null
  return <>
    <span className="question-round-count" aria-hidden="true">{count}</span>
    <span className="sr-only">{t("pairCount", { count })}</span>
  </>
}

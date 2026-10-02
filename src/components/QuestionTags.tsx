import { useTranslation } from "react-i18next"
import { questionTags } from "@/data/questions"
import { DocumentTag } from "@/components/DocumentTag"
import { defaultTagClassName, tagPillClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

export function QuestionTags({ ids, highlighted = [], plain = false }: { ids: string[]; highlighted?: string[]; plain?: boolean }) {
  const { t } = useTranslation("questions")
  if (!ids.length) return null
  return <ul className={cn("question-thread-tags", plain && "plain-index-tags")} aria-label={t("topicTags")} lang="en">
    {ids.map((id) => plain
      ? <DocumentTag as="li" key={id} label={questionTags[id]} highlighted={highlighted.includes(id)} />
      : <li className={cn("question-thread-tag", tagPillClassName, defaultTagClassName)} key={id}
        data-highlighted={highlighted.includes(id) || undefined}>{questionTags[id]}</li>)}
  </ul>
}

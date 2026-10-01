import { useTranslation } from "react-i18next"
import { MessageSquare } from "lucide-react"
import { type QuestionThread, questionTags } from "@/data/questions"
import { useQuestionCopy } from "@/hooks/use-question-copy"
import { useQuestionDialog } from "@/hooks/use-question-dialog"
import { QuestionProjectLinks } from "@/components/QuestionProjectLinks"
import { QuestionText } from "@/components/QuestionText"
import { QuestionTags } from "@/components/QuestionTags"
import { useQuestionMasonry } from "@/hooks/use-question-masonry"

export function QuestionList({ threads, showProjects = true, showAnswer = false, variant = "default", highlightedTags = [], masonry = false, headingLevel = 2 }: {
  threads: QuestionThread[]; showProjects?: boolean; showAnswer?: boolean; variant?: "default" | "catalog" | "document"; highlightedTags?: string[]; masonry?: boolean; headingLevel?: 2 | 3
}) {
  const { t } = useTranslation("questions")
  const copy = useQuestionCopy()
  const { openQuestion } = useQuestionDialog()
  const isDocument = variant === "document"
  const DocumentHeading = headingLevel === 3 ? "h3" : "h2"
  const isCatalog = variant === "catalog" || isDocument
  const isMasonry = isCatalog && masonry
  const listRef = useQuestionMasonry(isMasonry, threads.map((thread) => thread.id).join("|"))
  return <ol ref={listRef} className={`question-list${isCatalog ? " question-list-catalog" : ""}${isDocument ? " question-list-document" : ""}${isMasonry ? " question-list-masonry" : ""}`}>
    {threads.map((thread) => {
      const content = copy(thread)
      const first = content.rounds[thread.rounds[0]]
      if (isCatalog) return <li key={thread.id} className="question-list-item">
        <QuestionTags ids={thread.tagIds} highlighted={highlightedTags} plain={isDocument} />
        {isDocument ? <DocumentHeading className="question-document-heading">
          <button type="button" className="question-document-trigger" lang={content.lang}
            onClick={(event) => openQuestion(thread.id, event.currentTarget)}>
            <QuestionText text={first.question} />
          </button>
        </DocumentHeading> : <button type="button" className="question-bubble question-bubble-question question-catalog-trigger"
          onClick={(event) => openQuestion(thread.id, event.currentTarget)}>
          <span className="question-catalog-title" lang={content.lang}><QuestionText text={first.question} /></span>
        </button>}
      </li>
      return <li key={thread.id} className="question-list-item">
        <button type="button" className="question-list-trigger" onClick={(event) => openQuestion(thread.id, event.currentTarget)}>
          <span lang={content.lang}><QuestionText text={first.question} /></span>
          <MessageSquare size={16} aria-hidden="true" />
        </button>
        {showAnswer && first.answer && <p className="question-answer-preview" lang={content.lang}><QuestionText text={first.answer} /></p>}
        <div className="question-list-meta">
          <span>{t("rounds", { count: thread.rounds.length })}</span>
          <div className="question-tags">{thread.tagIds.map((id) => <span key={id}>{questionTags[id]}</span>)}</div>
        </div>
        {showProjects && <QuestionProjectLinks projects={thread.relatedProjects} />}
      </li>
    })}
  </ol>
}

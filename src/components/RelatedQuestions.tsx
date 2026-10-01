import { useId, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { QuestionList } from "@/components/QuestionList"
import { Button } from "@/components/ui/button"
import { filterQuestions, questionProjectKey, questionThreads, type QuestionProject, type QuestionThread } from "@/data/questions"
import { relatedQuestionPage } from "@/lib/questions"
import { projectDetailHeadingClassName } from "@/lib/project-detail-styles"

function RelatedQuestionPages({ threads }: { threads: QuestionThread[] }) {
  const { t } = useTranslation("questions")
  const [page, setPage] = useState(0)
  const listId = useId()
  const headingId = useId()
  const { items, pageIndex, pageCount } = relatedQuestionPage(threads, page)

  return <section className="related-questions" aria-labelledby={headingId}>
    <header className="related-questions-header">
      <h2 id={headingId} className={projectDetailHeadingClassName}>{t("related")}</h2>
      {pageCount > 1 && <nav className="question-pagination" aria-label={t("relatedPagination")}>
        <Button type="button" variant="ghost" size="icon" aria-label={t("previousPage")}
          aria-controls={listId} disabled={pageIndex === 0} onClick={() => setPage(pageIndex - 1)}>
          <ArrowLeft aria-hidden="true" />
        </Button>
        <span role="status" aria-atomic="true" aria-label={t("pageStatus", { current: pageIndex + 1, total: pageCount })}>
          {pageIndex + 1} / {pageCount}
        </span>
        <Button type="button" variant="ghost" size="icon" aria-label={t("nextPage")}
          aria-controls={listId} disabled={pageIndex === pageCount - 1} onClick={() => setPage(pageIndex + 1)}>
          <ArrowRight aria-hidden="true" />
        </Button>
      </nav>}
    </header>
    <div id={listId}>
      <QuestionList threads={items} variant="catalog" showProjects={false} />
    </div>
  </section>
}

export function RelatedQuestions({ project }: { project: QuestionProject }) {
  const key = questionProjectKey(project)
  const threads = filterQuestions(questionThreads, [], key).reverse()
  if (!threads.length) return null
  // Switching projects starts at its latest related questions.
  return <RelatedQuestionPages key={key} threads={threads} />
}

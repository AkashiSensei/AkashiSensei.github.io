import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { BackButton } from "@/components/BackButton"
import { Layout } from "@/components/Layout"
import { QuestionList } from "@/components/QuestionList"
import { Button } from "@/components/ui/button"
import { useAnimationPreference } from "@/components/animation-provider"
import { filterQuestions, questionTags, questionThreads } from "@/data/questions"
import { normalizeQuestionTags, toggleQuestionTag } from "@/lib/questions"
import { defaultTagClassName, tagPillClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"
import { filledPillActionClassName } from "@/lib/action-button-styles"

const tagsByCount = Object.keys(questionTags).sort((a, b) =>
  questionThreads.filter((q) => q.tagIds.includes(b)).length - questionThreads.filter((q) => q.tagIds.includes(a)).length,
)

export function QuestionsPage() {
  const { t } = useTranslation("questions")
  const { isPlainDisplayMode } = useAnimationPreference()
  const [params, setParams] = useSearchParams()
  const tags = normalizeQuestionTags(params.getAll("tag"), tagsByCount)
  // New threads are appended to the canonical data; reverse only this filtered view.
  const results = filterQuestions(questionThreads, tags).reverse()
  const allSelected = tags.length === 0
  const selectTags = (selected: string[]) => {
    const next = new URLSearchParams(params)
    next.delete("tag")
    next.delete("project")
    for (const tag of selected) next.append("tag", tag)
    setParams(next, { replace: true })
  }

  return <Layout mainClassName={isPlainDisplayMode ? "plain-home-main" : undefined}>
    <article className={cn("questions-page", isPlainDisplayMode && "questions-page-plain plain-home-document plain-index-document")}>
      <header className={isPlainDisplayMode ? "plain-home-header plain-index-header" : undefined}>
        <BackButton className={isPlainDisplayMode ? "plain-index-back" : undefined} />
        <div className="questions-page-header">
          <div className="flex min-w-0 flex-col gap-2">
            <h1 className={isPlainDisplayMode ? undefined : "section-title"} tabIndex={-1} data-question-fallback>{t("title")}</h1>
            <p className={isPlainDisplayMode ? "plain-home-lede" : "section-subtitle"}>{t("subtitle")}</p>
          </div>
          {!allSelected && <Button type="button" variant="outline" className={cn(isPlainDisplayMode ? "question-document-reset rounded-full" : filledPillActionClassName, "h-9 shrink-0 px-4 text-sm")} onClick={() => selectTags([])}>{t("resetSelection")}</Button>}
        </div>
      </header>
      <fieldset className="question-filters">
        <legend className="sr-only">{t("tags")}</legend>
        <div className="question-filter-tags" lang="en">{tagsByCount.map((id) => <button key={id} type="button"
          className={cn(tagPillClassName, defaultTagClassName)}
          aria-pressed={allSelected || tags.includes(id)}
          onClick={() => selectTags(toggleQuestionTag(tags, id, tagsByCount))}>{questionTags[id]}</button>)}</div>
      </fieldset>
      <div className="question-results">
        {results.length
          ? <QuestionList threads={results} showProjects={false} variant={isPlainDisplayMode ? "document" : "catalog"} highlightedTags={tags} masonry />
          : <div className="question-empty"><h2>{t("empty")}</h2><p>{t("emptyHint")}</p></div>}
      </div>
    </article>
  </Layout>
}

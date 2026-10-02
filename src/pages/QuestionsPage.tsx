import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { BackButton } from "@/components/BackButton"
import { Layout } from "@/components/Layout"
import { SectionHeader } from "@/components/SectionHeader"
import { QuestionList } from "@/components/QuestionList"
import { Button } from "@/components/ui/button"
import { useAnimationPreference } from "@/components/animation-provider"
import { filterQuestions, questionTags, questionThreads } from "@/data/questions"
import { normalizeQuestionTags, toggleQuestionTag } from "@/lib/questions"
import { defaultTagClassName, tagPillClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"
import { filledPillActionClassName } from "@/lib/action-button-styles"
import { formatDocumentTag } from "@/lib/tag-label"

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
    <article className={cn("questions-page", isPlainDisplayMode
      ? "questions-page-plain plain-home-document plain-index-document"
      : "mx-auto mt-2 flex w-full max-w-7xl flex-col sm:mt-4")}>
      {isPlainDisplayMode ? <header className="plain-home-header plain-index-header">
        <BackButton className="plain-index-back" />
        <div className="questions-page-header">
          <div className="flex min-w-0 flex-col gap-2">
            <h1 tabIndex={-1} data-question-fallback>{t("title")}</h1>
            <p className="plain-home-lede">{t("subtitle")}</p>
          </div>
          {!allSelected && <button type="button" className="question-document-reset site-text-link shrink-0 cursor-pointer text-sm" onClick={() => selectTags([])}>{t("resetSelection")}</button>}
        </div>
      </header> : <div className="mb-8 flex flex-col px-2 sm:mb-12 sm:px-4">
        <BackButton />
        <SectionHeader
          level={1}
          title={t("title")}
          subtitle={t("subtitle")}
          className="px-0 sm:px-0 md:px-0"
          headingProps={{ tabIndex: -1, "data-question-fallback": true }}
          action={!allSelected ? <Button type="button" variant="outline"
            className={cn(filledPillActionClassName, "h-9 shrink-0 px-4 text-sm")}
            onClick={() => selectTags([])}>{t("resetSelection")}</Button> : undefined}
        />
      </div>}
      <fieldset className="question-filters">
        <legend className="sr-only">{t("tags")}</legend>
        <div className="question-filter-tags" lang="en">{tagsByCount.map((id) => <button key={id} type="button"
          className={isPlainDisplayMode ? "document-tag question-document-filter" : cn(tagPillClassName, defaultTagClassName)}
          aria-pressed={allSelected || tags.includes(id)}
          onClick={() => selectTags(toggleQuestionTag(tags, id, tagsByCount))}>{isPlainDisplayMode ? formatDocumentTag(questionTags[id]) : questionTags[id]}</button>)}</div>
      </fieldset>
      <div className="question-results">
        {results.length
          ? <QuestionList threads={results} showProjects={false} variant={isPlainDisplayMode ? "document" : "catalog"} highlightedTags={tags} masonry />
          : <div className="question-empty"><h2>{t("empty")}</h2><p>{t("emptyHint")}</p></div>}
      </div>
    </article>
  </Layout>
}

import { useId, useMemo, useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"

import { BackButton } from "@/components/BackButton"
import { CourseProjectTagFilter } from "@/components/CourseProjectTagFilter"
import { Layout } from "@/components/Layout"
import { PlainProjectIndexPage } from "@/components/PlainProjectIndexPage"
import { ProjectGrid } from "@/components/ProjectGrid"
import { SectionHeader } from "@/components/SectionHeader"
import { TagFilter, TagFilterEmpty, TagFilterReset } from "@/components/TagFilter"
import { useAnimationPreference } from "@/components/animation-provider"
import { Button } from "@/components/ui/button"
import type { Project } from "@/data/projects"
import { filterByTags, normalizeTagSelection, tagSearchParams, tagsByFrequency } from "@/lib/tag-filter"
import { courseTagGroups, courseTagSearchParams, courseTagSelection, filterCourseProjects } from "@/lib/course-project-filter"
import { filledPillActionClassName } from "@/lib/action-button-styles"
import { cn } from "@/lib/utils"

export function ProjectIndexPage({ projects, translationNamespace = "projects" }: {
  projects: Project[]
  translationNamespace?: "projects" | "courseProjects"
}) {
  const { t } = useTranslation([translationNamespace, "common"])
  const { isPlainDisplayMode } = useAnimationPreference()
  const [params, setParams] = useSearchParams()
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const filterPanelId = useId()
  const available = useMemo(() => tagsByFrequency(projects), [projects])
  const courseGroups = useMemo(() => courseTagGroups(projects), [projects])
  const isCoursework = translationNamespace === "courseProjects"
  const selected = isCoursework
    ? courseTagSelection(params.getAll("tag"), courseGroups).tags
    : normalizeTagSelection(params.getAll("tag"), available)
  const results = isCoursework ? filterCourseProjects(projects, selected, courseGroups) : filterByTags(projects, selected)
  const selectTags = (tags: string[]) => setParams(
    isCoursework ? courseTagSearchParams(params, tags, courseGroups) : tagSearchParams(params, tags, available),
    { replace: true },
  )
  const reset = selected.length ? <TagFilterReset onReset={() => selectTags([])} /> : undefined
  const headerReset = reset ? <div className="project-tag-filter-desktop-reset">{reset}</div> : undefined
  const tagFilters = isCoursework ? <CourseProjectTagFilter groups={courseGroups} selected={selected} onChange={selectTags} /> : <TagFilter
    available={available}
    selected={selected}
    label={t("common:tagFilter.label")}
    getLabel={(tag) => tag}
    onChange={selectTags}
  />
  const toggleProps = {
    type: "button" as const,
    "aria-expanded": filtersExpanded,
    "aria-controls": filterPanelId,
    onClick: () => setFiltersExpanded((expanded) => !expanded),
  }
  const toggleLabel = t(filtersExpanded ? "common:tagFilter.collapse" : "common:tagFilter.expand")
  const toggleContent = <>{toggleLabel}<ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" /></>
  const filters = <div className="project-tag-filter">
    <div className="project-tag-filter-mobile-actions">
      {isPlainDisplayMode
        ? <button {...toggleProps} className="project-tag-filter-toggle site-text-link cursor-pointer gap-2 text-sm">{toggleContent}</button>
        : <Button {...toggleProps} variant="outline" className={cn(filledPillActionClassName, "project-tag-filter-toggle h-9 gap-2 px-4 text-sm")}>{toggleContent}</Button>}
      {reset}
    </div>
    <div id={filterPanelId} className="project-tag-filter-content" data-expanded={filtersExpanded || undefined}>
      {tagFilters}
    </div>
  </div>

  if (isPlainDisplayMode) {
    return <PlainProjectIndexPage
      projects={results}
      translationNamespace={translationNamespace}
      highlightedTags={selected}
      filters={filters}
      action={headerReset}
    />
  }

  return <Layout>
    <div className="project-index-page mx-auto mt-2 flex w-full max-w-7xl flex-col sm:mt-4">
      <div className="mb-8 flex flex-col px-2 sm:mb-12 sm:px-4">
        <BackButton />
        <SectionHeader level={1} title={t("title")} subtitle={t("subtitle")} className="px-0 sm:px-0 md:px-0" action={headerReset} />
      </div>
      {filters}
      {results.length
        ? <ProjectGrid projects={results} translationNamespace={translationNamespace} highlightedTags={selected} />
        : <TagFilterEmpty />}
    </div>
  </Layout>
}

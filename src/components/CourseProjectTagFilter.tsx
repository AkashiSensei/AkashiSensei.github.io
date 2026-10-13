import { useTranslation } from "react-i18next"

import { TagFilter } from "@/components/TagFilter"
import { useAnimationPreference } from "@/components/animation-provider"
import { courseTagSelection, toggleCourseTimeTag, type CourseTagGroups } from "@/lib/course-project-filter"
import { getCourseProjectSemesterTagClassName } from "@/lib/tag-styles"

export function CourseProjectTagFilter({ groups, selected, onChange }: {
  groups: CourseTagGroups
  selected: string[]
  onChange: (tags: string[]) => void
}) {
  const { t } = useTranslation("courseProjects")
  const { isPlainDisplayMode } = useAnimationPreference()
  const selection = courseTagSelection(selected, groups)

  return <div className="tag-filter-stack" data-plain={isPlainDisplayMode || undefined}>
    <TagFilter
      available={groups.timePairs.flat()}
      groups={groups.timePairs}
      selected={selection.timeTags}
      label={t("filters.time")}
      getLabel={(tag) => t(`semesterTags.${tag}`, { defaultValue: tag })}
      getTagClassName={(tag) => getCourseProjectSemesterTagClassName(groups.timePairs.find((pair) => pair.includes(tag))?.[1])}
      onToggle={(tag) => onChange(toggleCourseTimeTag(selected, tag, groups))}
      onChange={onChange}
    />
    <TagFilter
      available={groups.technicalTags}
      selected={selection.technicalTags}
      label={t("filters.technology")}
      getLabel={(tag) => tag}
      onChange={(tags) => onChange([...selection.timeTags, ...tags])}
    />
  </div>
}

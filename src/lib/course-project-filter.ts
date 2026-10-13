import { normalizeTagSelection, tagsByFrequency, toggleTagSelection } from "./tag-filter.ts"

type TaggedEntry = { tags: string[] }
export type CourseTagGroups = {
  timePairs: [string, string][]
  technicalTags: string[]
}

const semesterSeasons: Record<string, string> = { 春: "spring", 夏: "summer", 秋: "fall", 冬: "winter" }

function semesterUrlTag(semester: string) {
  return semester.replace(/^(\d{4})([春夏秋冬])$/, (_, year: string, season: string) => `${semesterSeasons[season]}-${year}`)
}

export function courseTagGroups(items: TaggedEntry[]): CourseTagGroups {
  const pairs = new Map<string, [string, string]>()
  for (const { tags } of items) {
    if (tags[0] && tags[1]) pairs.set(tags[1], [tags[0], tags[1]])
  }
  return {
    timePairs: [...pairs.values()],
    technicalTags: tagsByFrequency(items.map(({ tags }) => ({ tags: tags.slice(2) }))),
  }
}

export function courseTagSelection(selected: string[], groups: CourseTagGroups) {
  // English URL IDs and either canonical label from older links select the same pair.
  const semesters = normalizeTagSelection(
    groups.timePairs.filter((pair) => selected.includes(semesterUrlTag(pair[1])) || pair.some((tag) => selected.includes(tag))).map((pair) => pair[1]),
    groups.timePairs.map((pair) => pair[1]),
  )
  const timeTags = groups.timePairs.filter((pair) => semesters.includes(pair[1])).flat()
  const technicalTags = normalizeTagSelection(selected, groups.technicalTags)
  return { semesters, timeTags, technicalTags, tags: [...timeTags, ...technicalTags] }
}

export function courseTagSearchParams(params: URLSearchParams, selected: string[], groups: CourseTagGroups) {
  const { semesters, technicalTags } = courseTagSelection(selected, groups)
  const next = new URLSearchParams(params)
  next.delete("tag")
  // A time pair is one selection, so one stable semester ID represents both labels.
  for (const tag of [...semesters.map(semesterUrlTag), ...technicalTags]) next.append("tag", tag)
  return next
}

export function toggleCourseTimeTag(selected: string[], tag: string, groups: CourseTagGroups) {
  const current = courseTagSelection(selected, groups)
  const pair = groups.timePairs.find((pair) => pair.includes(tag))
  if (!pair) return current.tags
  const semesters = toggleTagSelection(current.semesters, pair[1], groups.timePairs.map((pair) => pair[1]))
  return [...groups.timePairs.filter((pair) => semesters.includes(pair[1])).flat(), ...current.technicalTags]
}

export function filterCourseProjects<T extends TaggedEntry>(items: T[], selected: string[], groups: CourseTagGroups) {
  const { semesters, technicalTags } = courseTagSelection(selected, groups)
  return items.filter(({ tags }) =>
    (!semesters.length || semesters.includes(tags[1])) &&
    (!technicalTags.length || technicalTags.some((tag) => tags.slice(2).includes(tag))),
  )
}

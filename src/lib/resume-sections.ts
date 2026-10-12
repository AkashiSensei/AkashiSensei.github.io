export const resumeSections = [
  { id: "resume-intro", labelKey: "resume:sectionNavigation.intro" },
  { id: "education", labelKey: "resume:education.title" },
  { id: "projects", labelKey: "projects:title" },
  { id: "interests", labelKey: "directions:title" },
  { id: "github-activity", labelKey: "resume:githubActivity.title" },
  { id: "course-projects", labelKey: "courseProjects:title" },
  { id: "questions", labelKey: "questions:title" },
  { id: "blog", labelKey: "blog:title" },
  { id: "workbench", labelKey: "workbench:title" },
  { id: "knowledge", labelKey: "knowledge:title" },
  { id: "tools", labelKey: "tools:title" },
] as const

export function getResumeSections(isPlainDisplayMode: boolean) {
  return resumeSections.filter((section) => !isPlainDisplayMode || section.id !== "github-activity")
}

// A reading line near the top keeps long chapters current until the next chapter
// enters the reading area. The last chapter stays current through the footer.
export function getActiveResumeSectionIndex(tops: number[], scrollY: number, viewportHeight: number) {
  if (tops.length === 0) return -1
  const readingY = scrollY + Math.min(120, viewportHeight * 0.2)
  let activeIndex = 0
  for (let index = 1; index < tops.length; index += 1) {
    if (tops[index] > readingY) break
    activeIndex = index
  }
  return activeIndex
}

export function getResumeSectionScrollY(section: HTMLElement) {
  const top = section.getBoundingClientRect().top + window.scrollY
  const offset = Number.parseFloat(window.getComputedStyle(section).scrollMarginTop) || 0
  return Math.max(0, top - offset)
}

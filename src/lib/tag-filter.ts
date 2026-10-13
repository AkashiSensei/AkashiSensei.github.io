// An empty selection represents the default all-highlighted state.
export function normalizeTagSelection(selected: string[], available: string[]) {
  const valid = [...new Set(selected)].filter((tag) => available.includes(tag))
  return valid.length === available.length ? [] : valid
}

export function toggleTagSelection(selected: string[], tag: string, available: string[]) {
  const current = normalizeTagSelection(selected, available)
  if (!available.includes(tag)) return current
  return normalizeTagSelection(
    current.includes(tag) ? current.filter((value) => value !== tag) : [...current, tag],
    available,
  )
}

export function tagsByFrequency(items: { tags: string[] }[]) {
  const counts = new Map<string, number>()
  for (const item of items) {
    for (const tag of new Set(item.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  // Stable sorting retains first appearance for tags with the same count.
  return [...counts.keys()].sort((a, b) => counts.get(b)! - counts.get(a)!)
}

export function filterByTags<T extends { tags: string[] }>(items: T[], selected: string[]) {
  return items.filter((item) => !selected.length || selected.some((tag) => item.tags.includes(tag)))
}

export function tagSearchParams(params: URLSearchParams, selected: string[], available: string[]) {
  const next = new URLSearchParams(params)
  next.delete("tag")
  for (const tag of normalizeTagSelection(selected, available)) next.append("tag", tag)
  return next
}

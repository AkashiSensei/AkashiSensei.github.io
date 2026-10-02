export type ProjectPointSections = {
  projectIntroPoints: string[]
  personalWorkPoints: string[]
  points: string[]
  highlightedIndexes: number[]
}

function getStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((point): point is string => typeof point === "string")
    : []
}

export function getProjectPointSections(value: unknown): ProjectPointSections {
  if (Array.isArray(value)) {
    const points = getStringArray(value)

    return {
      projectIntroPoints: points,
      personalWorkPoints: [],
      points,
      highlightedIndexes: [],
    }
  }

  if (!(value && typeof value === "object")) {
    return {
      projectIntroPoints: [],
      personalWorkPoints: [],
      points: [],
      highlightedIndexes: [],
    }
  }

  const record = value as Record<string, unknown>
  const projectIntroPoints = getStringArray(record.projectIntro)
  const personalWorkPoints = getStringArray(record.personalWork)
  const points = [...projectIntroPoints, ...personalWorkPoints]

  return {
    projectIntroPoints,
    personalWorkPoints,
    points,
    highlightedIndexes: personalWorkPoints.map(
      (_, index) => projectIntroPoints.length + index,
    ),
  }
}

export function sliceProjectPointSections(
  sections: ProjectPointSections,
  limit: number,
): Pick<ProjectPointSections, "points" | "highlightedIndexes"> {
  const count = Math.max(0, Math.floor(limit))
  const highlightedSet = new Set(sections.highlightedIndexes)
  const indexes = sections.points.map((_, index) => index)
  const highlighted = indexes.filter((index) => highlightedSet.has(index))
  const ordinary = indexes.filter((index) => !highlightedSet.has(index))
  // Reserve at least half the preview for contributions, retaining source order.
  const reserved = Math.min(highlighted.length, Math.ceil(count / 2))
  const selectedOrdinary = ordinary.slice(0, count - reserved)
  const selected = new Set([
    ...selectedOrdinary,
    ...highlighted.slice(0, count - selectedOrdinary.length),
  ])
  const selectedIndexes = indexes.filter((index) => selected.has(index))

  return {
    points: selectedIndexes.map((index) => sections.points[index]),
    highlightedIndexes: selectedIndexes.flatMap((index, visibleIndex) =>
      highlightedSet.has(index) ? [visibleIndex] : [],
    ),
  }
}

export const listingUnsectionedPointLimit = 3
export const listingSectionPointLimit = 2

export function sliceListingPointSections(
  sections: ProjectPointSections,
): ProjectPointSections {
  const hasSectionSplit =
    sections.projectIntroPoints.length > 0 &&
    sections.personalWorkPoints.length > 0

  if (hasSectionSplit) {
    const projectIntroPoints = sections.projectIntroPoints.slice(
      0,
      listingSectionPointLimit,
    )
    const personalWorkPoints = sections.personalWorkPoints.slice(
      0,
      listingSectionPointLimit,
    )
    const points = [...projectIntroPoints, ...personalWorkPoints]

    return {
      projectIntroPoints,
      personalWorkPoints,
      points,
      highlightedIndexes: personalWorkPoints.map(
        (_, index) => projectIntroPoints.length + index,
      ),
    }
  }

  const points = sections.points.slice(0, listingUnsectionedPointLimit)

  return {
    projectIntroPoints: sections.projectIntroPoints.slice(
      0,
      listingUnsectionedPointLimit,
    ),
    personalWorkPoints: sections.personalWorkPoints.slice(
      0,
      listingUnsectionedPointLimit,
    ),
    points,
    highlightedIndexes: sections.highlightedIndexes.filter(
      (index) => index < points.length,
    ),
  }
}

export function getListingPointSections(value: unknown) {
  return sliceListingPointSections(getProjectPointSections(value))
}

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

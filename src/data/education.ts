export type EducationEmblem = {
  src: string
  width: number
  height: number
}

export type EducationCollege = {
  id: string
  emblem?: EducationEmblem
}

export type EducationEntry = {
  id: string
  startYear: number
  endYear?: number
  colleges: EducationCollege[]
  schoolEmblem?: EducationEmblem
}

const beihangEmblem: EducationEmblem = {
  src: "/assets/education/buaa-logo.webp",
  width: 720,
  height: 720,
}

const softwareCollege: EducationCollege = {
  id: "software",
  emblem: {
    src: "/assets/education/se-logo.webp",
    width: 654,
    height: 629,
  },
}

const reliabilityCollege: EducationCollege = {
  id: "reliability",
  emblem: {
    src: "/assets/education/rse-logo.webp",
    width: 1214,
    height: 926,
  },
}

export const educationEntries: EducationEntry[] = [
  {
    id: "se-master",
    startYear: 2025,
    schoolEmblem: beihangEmblem,
    colleges: [softwareCollege],
  },
  {
    id: "se-bachelor",
    startYear: 2020,
    endYear: 2025,
    schoolEmblem: beihangEmblem,
    colleges: [softwareCollege, reliabilityCollege],
  },
]

export const educationTimelineEntries = [...educationEntries].sort(
  (left, right) => left.startYear - right.startYear || (left.endYear ?? Number.POSITIVE_INFINITY) - (right.endYear ?? Number.POSITIVE_INFINITY),
)

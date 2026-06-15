export type TagTone =
  | "amber"
  | "cyan"
  | "emerald"
  | "rose"
  | "sky"
  | "teal"
  | "violet"

export const semanticTagTone = {
  backend: "cyan",
  customized: "teal",
  fork: "violet",
  frontend: "sky",
  main: "amber",
  private: "rose",
  public: "emerald",
} as const satisfies Record<string, TagTone>

export const tagToneClassName: Record<TagTone, string> = {
  amber:
    "border-amber-400/30 bg-amber-400/12 text-amber-800 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-200",
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-700 dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200",
  emerald:
    "border-emerald-400/25 bg-emerald-400/10 text-emerald-700 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-200",
  rose:
    "border-rose-400/25 bg-rose-400/10 text-rose-700 dark:border-rose-300/20 dark:bg-rose-300/10 dark:text-rose-200",
  sky: "border-sky-400/25 bg-sky-400/10 text-sky-700 dark:border-sky-300/20 dark:bg-sky-300/10 dark:text-sky-200",
  teal: "border-teal-400/25 bg-teal-400/10 text-teal-700 dark:border-teal-300/20 dark:bg-teal-300/10 dark:text-teal-200",
  violet:
    "border-violet-400/25 bg-violet-400/10 text-violet-700 dark:border-violet-300/20 dark:bg-violet-300/10 dark:text-violet-200",
}

export function getSemanticTagClassName(semantic: keyof typeof semanticTagTone) {
  return tagToneClassName[semanticTagTone[semantic]]
}

const courseProjectSemesterTagClassName: Record<string, string> = {
  "2026春":
    "border-emerald-300/45 bg-emerald-100/70 text-emerald-800 shadow-sm shadow-emerald-900/5 dark:border-emerald-300/25 dark:bg-emerald-300/12 dark:text-emerald-200",
  "2025秋":
    "border-amber-300/50 bg-amber-100/75 text-amber-850 shadow-sm shadow-amber-900/5 dark:border-amber-300/25 dark:bg-amber-300/12 dark:text-amber-200",
  "2025春":
    "border-cyan-300/45 bg-cyan-100/70 text-cyan-800 shadow-sm shadow-cyan-900/5 dark:border-cyan-300/25 dark:bg-cyan-300/12 dark:text-cyan-200",
  "2024夏":
    "border-rose-300/45 bg-rose-100/70 text-rose-800 shadow-sm shadow-rose-900/5 dark:border-rose-300/25 dark:bg-rose-300/12 dark:text-rose-200",
  "2024春":
    "border-sky-300/45 bg-sky-100/70 text-sky-800 shadow-sm shadow-sky-900/5 dark:border-sky-300/25 dark:bg-sky-300/12 dark:text-sky-200",
  "2023秋":
    "border-violet-300/45 bg-violet-100/70 text-violet-800 shadow-sm shadow-violet-900/5 dark:border-violet-300/25 dark:bg-violet-300/12 dark:text-violet-200",
  "2023春":
    "border-teal-300/45 bg-teal-100/70 text-teal-800 shadow-sm shadow-teal-900/5 dark:border-teal-300/25 dark:bg-teal-300/12 dark:text-teal-200",
  "2022秋":
    "border-fuchsia-300/45 bg-fuchsia-100/70 text-fuchsia-800 shadow-sm shadow-fuchsia-900/5 dark:border-fuchsia-300/25 dark:bg-fuchsia-300/12 dark:text-fuchsia-200",
}

const fallbackCourseProjectSemesterTagClassName =
  "border-indigo-300/45 bg-indigo-100/70 text-indigo-800 shadow-sm shadow-indigo-900/5 dark:border-indigo-300/25 dark:bg-indigo-300/12 dark:text-indigo-200"

export function getCourseProjectSemesterTagClassName(semester?: string) {
  return semester
    ? courseProjectSemesterTagClassName[semester] ??
        fallbackCourseProjectSemesterTagClassName
    : fallbackCourseProjectSemesterTagClassName
}

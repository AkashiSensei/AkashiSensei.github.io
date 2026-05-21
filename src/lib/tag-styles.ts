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

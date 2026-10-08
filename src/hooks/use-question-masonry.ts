import { useMeasuredMasonry } from "@/hooks/use-measured-masonry"

export function useQuestionMasonry(enabled: boolean, itemKey: string) {
  return useMeasuredMasonry(enabled, itemKey, "--question-columns")
}

import { formatDocumentTag } from "@/lib/tag-label"
import { useAnimationPreference } from "@/components/animation-provider"

export function DocumentTag({ label, as: Tag = "span", highlighted = false }: {
  label: string
  as?: "span" | "li"
  highlighted?: boolean
}) {
  const { isPlainDisplayMode } = useAnimationPreference()
  return <Tag className="document-tag" data-highlighted={(isPlainDisplayMode && highlighted) || undefined}>{formatDocumentTag(label)}</Tag>
}

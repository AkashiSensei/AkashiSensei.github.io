import { formatDocumentTag } from "@/lib/tag-label"

export function DocumentTag({ label, as: Tag = "span", highlighted = false }: {
  label: string
  as?: "span" | "li"
  highlighted?: boolean
}) {
  return <Tag className="document-tag" data-highlighted={highlighted || undefined}>{formatDocumentTag(label)}</Tag>
}

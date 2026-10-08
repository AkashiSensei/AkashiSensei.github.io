import { useTranslation } from "react-i18next"
import { DocumentTag } from "@/components/DocumentTag"
import { useAnimationPreference } from "@/components/animation-provider"
import { getBlogCategoryTagClassName, tagPillClassName } from "@/lib/tag-styles"
import { formatDocumentTag } from "@/lib/tag-label"
import { cn } from "@/lib/utils"

export function BlogCategoryTag({ category, selected = false, onClick }: {
  category: string
  selected?: boolean
  onClick?: () => void
}) {
  const { t } = useTranslation("blog")
  const { isPlainDisplayMode } = useAnimationPreference()
  const label = category ? t(`categories.${category}`, { defaultValue: category }) : t("all")
  const pillClassName = cn(tagPillClassName, getBlogCategoryTagClassName(category))
  if (onClick) return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={isPlainDisplayMode
      ? "document-tag site-text-link text-sm"
      : cn(pillClassName, "px-3.5 py-1.5 text-sm", selected && "ring-1 ring-current shadow-sm")}
    >{isPlainDisplayMode && category ? formatDocumentTag(label) : label}</button>
  )
  return isPlainDisplayMode ? <DocumentTag label={label} /> : (
    <span className={pillClassName}>{label}</span>
  )
}

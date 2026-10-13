import { useTranslation } from "react-i18next"

import { useAnimationPreference } from "@/components/animation-provider"
import { Button } from "@/components/ui/button"
import { filledPillActionClassName } from "@/lib/action-button-styles"
import { toggleTagSelection } from "@/lib/tag-filter"
import { formatDocumentTag } from "@/lib/tag-label"
import { defaultTagClassName, tagPillClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"
import "./tag-filter.css"

export function TagFilter({ available, selected, label, getLabel, onChange, lang, groups, getTagClassName, onToggle }: {
  available: string[]
  selected: string[]
  label: string
  getLabel: (tag: string) => string
  onChange: (selected: string[]) => void
  lang?: string
  groups?: string[][]
  getTagClassName?: (tag: string) => string
  onToggle?: (tag: string) => void
}) {
  const { isPlainDisplayMode } = useAnimationPreference()
  const renderTag = (tag: string) => <button
    key={tag}
    type="button"
    className={isPlainDisplayMode ? "document-tag" : cn(tagPillClassName, getTagClassName?.(tag) ?? defaultTagClassName)}
    data-preserve-tone={(!isPlainDisplayMode && !!getTagClassName) || undefined}
    aria-pressed={!selected.length || selected.includes(tag)}
    onClick={() => onToggle ? onToggle(tag) : onChange(toggleTagSelection(selected, tag, available))}
  >{isPlainDisplayMode ? formatDocumentTag(getLabel(tag)) : getLabel(tag)}</button>

  return <fieldset className="tag-filter" data-plain={isPlainDisplayMode || undefined}>
    <legend className="sr-only">{label}</legend>
    <div className="tag-filter-options" lang={lang}>
      {groups
        ? groups.map((group) => <span className="tag-filter-pair" key={group.join(":")}>{group.map(renderTag)}</span>)
        : available.map(renderTag)}
    </div>
  </fieldset>
}

export function TagFilterReset({ onReset, label }: { onReset: () => void; label?: string }) {
  const { t } = useTranslation("common")
  const { isPlainDisplayMode } = useAnimationPreference()
  const text = label ?? t("tagFilter.reset")
  return isPlainDisplayMode
    ? <button type="button" className="site-text-link shrink-0 cursor-pointer text-sm" onClick={onReset}>{text}</button>
    : <Button type="button" variant="outline" className={cn(filledPillActionClassName, "h-9 shrink-0 px-4 text-sm")} onClick={onReset}>{text}</Button>
}

export function TagFilterEmpty() {
  const { t } = useTranslation("common")
  return <div className="tag-filter-empty" role="status">
    <h2>{t("tagFilter.empty")}</h2>
    <p>{t("tagFilter.emptyHint")}</p>
  </div>
}

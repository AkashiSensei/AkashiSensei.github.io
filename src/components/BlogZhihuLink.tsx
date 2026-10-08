import { useTranslation } from "react-i18next"
import { useAnimationPreference } from "@/components/animation-provider"
import { DocumentTag } from "@/components/DocumentTag"
import { ExternalLinkIcon } from "@/components/ExternalLinkIcon"
import { tagToneClassName } from "@/lib/tag-styles"
import { cn } from "@/lib/utils"

export function BlogZhihuLink({ url }: { url?: string }) {
  const { t } = useTranslation("blog")
  const { isPlainDisplayMode } = useAnimationPreference()
  const languageLabel = t("zhihuLanguage")
  if (!url) return null
  return <a href={url} target="_blank" rel="noreferrer" className="group/repo relative z-10 inline-flex w-fit max-w-full items-center gap-1.5 text-sm font-normal text-tone-3 transition-colors hover:text-tone-1">
    {isPlainDisplayMode ? <DocumentTag label={languageLabel} /> : <span className={cn("shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.6875rem] font-normal leading-none", tagToneClassName.amber)}>{languageLabel}</span>}
    <span className="site-text-link">{t("zhihuSource")}</span>
    <ExternalLinkIcon className="h-4 w-4 shrink-0 transition-transform group-hover/repo:-translate-y-0.5 group-hover/repo:translate-x-0.5 motion-reduce:transform-none" />
  </a>
}

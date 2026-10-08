import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useAnimationPreference } from "@/components/animation-provider"
import type { BlogHeading } from "@/lib/blog-markdown"
import { cn } from "@/lib/utils"

export function BlogTableOfContents({ headings, activeSection, className, showTitle = true, onNavigate }: {
  headings: BlogHeading[]
  activeSection?: string
  className?: string
  showTitle?: boolean
  onNavigate?: () => void
}) {
  const { t } = useTranslation("blog")
  const { isPlainDisplayMode } = useAnimationPreference()
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = navRef.current
    const link = nav?.querySelector<HTMLElement>('[aria-current="location"]')
    if (!nav || !link || !nav.clientHeight) return
    const revealCurrent = () => {
      const bounds = nav.getBoundingClientRect()
      const position = link.getBoundingClientRect()
      // Scroll only the TOC container, never the article or its scrolling root.
      if (position.top < bounds.top) nav.scrollTop += position.top - bounds.top
      else if (position.bottom > bounds.bottom) nav.scrollTop += position.bottom - bounds.bottom
    }
    revealCurrent()
    // Keep the current item visible as its font grows or the panel reflows.
    const resize = new ResizeObserver(revealCurrent)
    resize.observe(nav)
    resize.observe(link)
    return () => resize.disconnect()
  }, [activeSection, headings, isPlainDisplayMode])

  return <nav ref={navRef} aria-label={t("toc")} className={cn("blog-toc", className)}>
    {showTitle ? <p className="blog-meta">{t("toc")}</p> : null}
    <ol>{headings.map((heading) => <li key={heading.id} data-depth={heading.depth}>
      <a href={`#${heading.id}`} className={isPlainDisplayMode ? "site-text-link" : undefined}
        aria-current={activeSection === heading.id ? "location" : undefined} onClick={onNavigate}>{heading.text}</a>
    </li>)}</ol>
  </nav>
}

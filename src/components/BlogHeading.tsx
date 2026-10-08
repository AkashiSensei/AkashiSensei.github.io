import { useEffect, useRef, useState, type ReactNode } from "react"
import { Check, Link2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { copyTextToClipboard } from "@/lib/clipboard"
import { getBlogHeadingUrl } from "@/lib/blog-links"
import type { BlogLocale } from "@/lib/blog"

export function BlogHeading({ level, id, children, locale }: {
  level: 2 | 3 | 4 | 5 | 6
  id?: string
  children: ReactNode
  locale: BlogLocale
}) {
  const Tag = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6"
  const { t } = useTranslation(["blog", "common"])
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mounted = useRef(false)
  const attempt = useRef(0)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (resetTimer.current !== null) clearTimeout(resetTimer.current)
    }
  }, [])

  async function copyLink() {
    if (!id) return
    const request = ++attempt.current
    if (resetTimer.current !== null) clearTimeout(resetTimer.current)
    let result: "copied" | "failed" = "copied"
    try {
      await copyTextToClipboard(getBlogHeadingUrl(window.location.href, id, locale))
    } catch {
      result = "failed"
    }
    if (!mounted.current || request !== attempt.current) return
    setCopyState(result)
    resetTimer.current = setTimeout(() => setCopyState("idle"), 1800)
  }

  const status = copyState === "idle" ? "" : t(copyState === "copied" ? "common:contactDialog.copied" : "common:contactDialog.copyFailed")
  return <Tag id={id}>
    {children}
    {id ? <>
      <button
        type="button"
        className="blog-heading-link"
        onClick={() => void copyLink()}
        aria-label={t("blog:copySectionLink")}
        title={status || t("blog:copySectionLink")}
      >
        {copyState === "copied" ? <Check strokeWidth={1.5} aria-hidden="true" /> : <Link2 strokeWidth={1.5} aria-hidden="true" />}
      </button>
      <span aria-live="polite" aria-atomic="true" className={copyState === "failed" ? "blog-heading-copy-status" : "sr-only"}>{status}</span>
    </> : null}
  </Tag>
}

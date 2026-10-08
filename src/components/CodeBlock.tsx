import { useEffect, useRef, useState, type ReactNode } from "react"
import { Check, Copy } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { ghostPillActionClassName } from "@/lib/action-button-styles"
import { copyTextToClipboard } from "@/lib/clipboard"
import { cn } from "@/lib/utils"

export function CodeBlock({ children }: { children?: ReactNode }) {
  const { t } = useTranslation(["blog", "common"])
  const codeRef = useRef<HTMLPreElement>(null)
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

  async function copyCode() {
    const text = codeRef.current?.textContent
    if (text == null) return
    const request = ++attempt.current
    if (resetTimer.current !== null) clearTimeout(resetTimer.current)
    let result: "copied" | "failed" = "copied"
    try {
      await copyTextToClipboard(text)
    } catch {
      result = "failed"
    }
    if (!mounted.current || request !== attempt.current) return
    setCopyState(result)
    resetTimer.current = setTimeout(() => setCopyState("idle"), 1800)
  }

  const label = t(`common:contactDialog.${copyState === "idle" ? "copy" : copyState === "copied" ? "copied" : "copyFailed"}`)
  return (
    <div className="site-code-block">
      <div className="site-code-toolbar">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(ghostPillActionClassName, "h-8 gap-1.5 px-3 text-xs")}
          onClick={() => void copyCode()}
          aria-label={copyState === "idle" ? t("blog:copyCode") : label}
          title={t("blog:copyCode")}
        >
          {copyState === "copied" ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          <span>{label}</span>
        </Button>
        <span className="sr-only" aria-live="polite" aria-atomic="true">{copyState === "idle" ? "" : label}</span>
      </div>
      <pre ref={codeRef}>{children}</pre>
    </div>
  )
}

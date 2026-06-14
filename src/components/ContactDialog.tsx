import { type ReactNode, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Check, Copy, Mail } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SpotlightCard } from "@/components/SpotlightCard"

export function ContactDialog({ children }: { children: ReactNode }) {
  const { t } = useTranslation("common")
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle")
  const resetCopyStateTimeoutRef = useRef<number | null>(null)
  const emailAddress = "fengzhiyuyi2013@gmail.com"

  useEffect(() => {
    return () => {
      if (resetCopyStateTimeoutRef.current !== null) {
        window.clearTimeout(resetCopyStateTimeoutRef.current)
      }
    }
  }, [])

  const copyEmailAddress = async () => {
    if (resetCopyStateTimeoutRef.current !== null) {
      window.clearTimeout(resetCopyStateTimeoutRef.current)
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(emailAddress)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = emailAddress
        textArea.setAttribute("readonly", "")
        textArea.style.position = "fixed"
        textArea.style.top = "-9999px"
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }

      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }

    resetCopyStateTimeoutRef.current = window.setTimeout(() => {
      setCopyState("idle")
      resetCopyStateTimeoutRef.current = null
    }, 1800)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <SpotlightCard asChild>
        <DialogContent className="lit-glass-card rounded-3xl border-[rgb(var(--site-surface-rgb)_/_0.62)] bg-[rgb(var(--site-surface-rgb)_/_0.66)] shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">{t("contactDialog.title")}</DialogTitle>
            <DialogDescription className="text-foreground/70">
              {t("contactDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2 mt-2">
            <SpotlightCard
              asChild
              spotlightColor="rgba(255, 255, 255, 0.22)"
            >
              <button
                type="button"
                onClick={copyEmailAddress}
                className="lit-glass-card group flex w-full items-center gap-4 rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] p-4 text-left transition-colors hover:bg-[rgb(var(--site-surface-rgb)_/_0.62)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/45 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                title={t("contactDialog.copyEmail")}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 group-hover:bg-foreground/10 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="font-semibold text-foreground/90">{t("contactDialog.email")}</span>
                  <span className="truncate text-sm text-foreground/60">{emailAddress}</span>
                </div>
                <span
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-medium text-foreground/70 transition-colors group-hover:bg-foreground/10"
                  aria-live="polite"
                >
                  {copyState === "copied" ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      {t("contactDialog.copied")}
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      {copyState === "failed"
                        ? t("contactDialog.copyFailed")
                        : t("contactDialog.copy")}
                    </>
                  )}
                </span>
              </button>
            </SpotlightCard>
          </div>
          <p className="text-sm text-foreground/60 leading-relaxed pt-2">
            {t("contactDialog.privacyNote")}
          </p>
        </DialogContent>
      </SpotlightCard>
    </Dialog>
  )
}

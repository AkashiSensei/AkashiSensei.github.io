import { ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"

type BackButtonProps = {
  className?: string
  fallback?: string
}

function hasBrowserHistoryEntry() {
  const historyState = window.history.state as { idx?: unknown } | null

  if (typeof historyState?.idx === "number") {
    return historyState.idx > 0
  }

  return window.history.length > 1
}

export function BackButton({ className, fallback = "/resume" }: BackButtonProps) {
  const navigate = useNavigate()
  const { t } = useTranslation("common")

  return (
    <button
      type="button"
      className={cn(
        "group relative -ml-6 -mt-4 mb-0 inline-flex w-fit shrink-0 cursor-pointer items-center justify-center rounded-2xl px-6 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      aria-label={t("a11y.goBack")}
      onClick={() => {
        if (hasBrowserHistoryEntry()) {
          navigate(-1)
          return
        }

        navigate(fallback, { replace: true })
      }}
    >
      <ArrowLeft aria-hidden="true" className="pointer-events-none h-10 w-10 shrink-0 text-foreground/40 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-foreground/80 group-focus-visible:text-foreground/80" />
    </button>
  )
}

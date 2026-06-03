import { ArrowLeft } from "lucide-react"
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

  return (
    <button
      type="button"
      className={cn(
        "group mb-4 inline-flex w-fit items-center justify-center transition-all",
        className,
      )}
      aria-label="Go back"
      onClick={() => {
        if (hasBrowserHistoryEntry()) {
          navigate(-1)
          return
        }

        navigate(fallback, { replace: true })
      }}
    >
      <ArrowLeft className="h-10 w-10 text-foreground/40 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-foreground/80" />
    </button>
  )
}

import { type ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

export function GlassPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "lit-glass-card rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.42)] bg-[rgb(var(--site-surface-rgb)_/_0.42)] shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5",
        className,
      )}
      {...props}
    />
  )
}

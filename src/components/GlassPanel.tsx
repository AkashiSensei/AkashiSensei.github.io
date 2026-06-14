import { type ComponentPropsWithoutRef } from "react"

import { SpotlightCard } from "@/components/SpotlightCard"
import { cn } from "@/lib/utils"

export function GlassPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <SpotlightCard
      className={cn(
        "lit-glass-card rounded-2xl border border-[rgb(var(--site-surface-rgb)_/_0.52)] bg-[rgb(var(--site-surface-rgb)_/_0.58)] shadow-[0_24px_72px_-48px_rgb(15_23_42_/_0.46)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-sm",
        className,
      )}
      {...props}
    />
  )
}

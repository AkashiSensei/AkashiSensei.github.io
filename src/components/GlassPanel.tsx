import { type ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

export function GlassPanel({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-sm backdrop-blur-md",
        className,
      )}
      {...props}
    />
  )
}

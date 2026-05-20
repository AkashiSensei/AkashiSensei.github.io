import { type ComponentProps } from "react"

import { cn } from "@/lib/utils"
import { navigate } from "@/lib/navigation"

type AppLinkProps = Omit<ComponentProps<"a">, "href"> & {
  to: string
}

export function AppLink({ to, onClick, className, children, ...props }: AppLinkProps) {
  return (
    <a
      {...props}
      href={to}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) {
          return
        }
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey
        ) {
          return
        }
        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

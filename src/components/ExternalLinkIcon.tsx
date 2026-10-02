import { ArrowUpRight } from "lucide-react"
import type { ComponentProps } from "react"

export function ExternalLinkIcon(props: ComponentProps<typeof ArrowUpRight>) {
  return <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} {...props} />
}

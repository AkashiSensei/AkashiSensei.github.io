import { Link, type LinkProps } from "react-router-dom"

import { cn } from "@/lib/utils"

export function AppLink({ className, ...props }: LinkProps) {
  return <Link {...props} className={cn(className)} />
}

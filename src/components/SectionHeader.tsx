import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"

import { AppLink } from "@/components/AppLink"
import { cn } from "@/lib/utils"

export function SectionHeader({ title, subtitle, action, level = 2, className }: {
  title: string
  subtitle: string
  action?: ReactNode
  level?: 1 | 2
  className?: string
}) {
  const Heading = level === 1 ? "h1" : "h2"
  return (
    <header className={cn("section-heading", className)}>
      <div className="section-heading-row">
        <Heading className="section-title">{title}</Heading>
        {action}
      </div>
      <p className="section-subtitle">{subtitle}</p>
    </header>
  )
}

export function ArchiveSectionHeader({ detailPath, title, subtitle, viewAllLabel }: {
  detailPath: string
  title: string
  subtitle: string
  viewAllLabel: string
}) {
  return (
    <SectionHeader title={title} subtitle={subtitle} action={
      <AppLink to={detailPath} className="section-action">
        <span>{viewAllLabel}</span>
        <ArrowRight aria-hidden="true" />
      </AppLink>
    } />
  )
}

export function SectionNote({ children, className }: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("section-note", className)}>{children}</div>
}

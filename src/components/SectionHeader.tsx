import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { ArrowRight } from "lucide-react"

import { AppLink } from "@/components/AppLink"
import { cn } from "@/lib/utils"

export function SectionHeader({ title, subtitle, eyebrow, action, level = 2, className, headingProps }: {
  title: string
  subtitle: string
  eyebrow?: string
  action?: ReactNode
  level?: 1 | 2
  className?: string
  headingProps?: ComponentPropsWithoutRef<"h1"> & { [key: `data-${string}`]: string | number | boolean | undefined }
}) {
  const Heading = level === 1 ? "h1" : "h2"
  return (
    <header className={cn("section-heading", className)}>
      {eyebrow ? (
        <p className="text-xs font-normal uppercase tracking-[0.22em] text-tone-5">
          {eyebrow}
        </p>
      ) : null}
      <div className="section-heading-row">
        <Heading {...headingProps} className={cn(level === 1 ? "site-page-title" : "section-title", headingProps?.className)}>{title}</Heading>
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

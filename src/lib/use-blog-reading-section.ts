import { useEffect, useMemo, useState, type RefObject } from "react"
import { observeBlogReadingSection } from "@/lib/blog-reading"
import { getBlogHeadings } from "@/lib/blog-markdown"

export function useBlogReadingSection(bodyRef: RefObject<HTMLDivElement | null>, markdown: string) {
  const headings = useMemo(() => getBlogHeadings(markdown), [markdown])
  const [activeSection, setActiveSection] = useState<string>()

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    return observeBlogReadingSection(body, headings.map(({ id }) => id), setActiveSection)
  }, [bodyRef, headings])

  return { headings, activeSection }
}

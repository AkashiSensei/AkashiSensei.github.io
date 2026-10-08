import { useEffect, useRef, useState } from "react"
import { Popover } from "radix-ui"
import { ListTree, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { BlogTableOfContents } from "@/components/BlogTableOfContents"
import { GlassPanel } from "@/components/GlassPanel"
import { SpotlightCard } from "@/components/SpotlightCard"
import { useAnimationPreference } from "@/components/animation-provider"
import type { BlogHeading } from "@/lib/blog-markdown"
import { navigationGlassSurfaceClassName } from "@/lib/glass-surface-styles"
import { cn } from "@/lib/utils"

export function BlogFloatingToc({ headings, activeSection }: { headings: BlogHeading[]; activeSection?: string }) {
  const { t } = useTranslation("blog")
  const { animationMode } = useAnimationPreference()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (orientation: landscape)")
    const closeOnDesktop = (event: MediaQueryListEvent) => { if (event.matches) setOpen(false) }
    desktop.addEventListener("change", closeOnDesktop)
    return () => desktop.removeEventListener("change", closeOnDesktop)
  }, [])

  if (!headings.length) return null

  return <Popover.Root open={open} onOpenChange={setOpen}>
    <div className="blog-floating-toc">
      <SpotlightCard asChild className={cn(navigationGlassSurfaceClassName, "flex size-11 cursor-pointer items-center justify-center rounded-full text-tone-2 transition-colors hover:text-tone-1")}>
        <Popover.Trigger asChild>
          <button type="button" aria-label={t(open ? "blog:closeToc" : "blog:openToc")} title={t("blog:toc")}>
            {open ? <X aria-hidden="true" className="size-4" /> : <ListTree aria-hidden="true" className="size-4" />}
          </button>
        </Popover.Trigger>
      </SpotlightCard>
    </div>
    <Popover.Portal>
      <Popover.Content ref={panelRef} side="top" align="end" sideOffset={12} collisionPadding={16}
        aria-label={t("toc")} data-display-mode={animationMode} className="blog-floating-toc-panel"
        onOpenAutoFocus={(event) => {
          const current = panelRef.current?.querySelector<HTMLElement>('[aria-current="location"]')
          if (current) { event.preventDefault(); current.focus({ preventScroll: true }) }
        }}>
        <GlassPanel className="flex max-h-[inherit] flex-col overflow-hidden p-5">
          <BlogTableOfContents headings={headings} activeSection={activeSection} showTitle={false}
            className="min-h-0 min-w-0 overflow-y-auto overscroll-contain" onNavigate={() => setOpen(false)} />
        </GlassPanel>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
}

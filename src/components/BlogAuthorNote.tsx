import { MessageSquareText } from "lucide-react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useTranslation } from "react-i18next"
import { useAnimationPreference } from "@/components/animation-provider"
import { formatBlogAuthorNoteDate, type LocalizedBlogAuthorNote } from "@/lib/blog-author-notes"

export function BlogAuthorNote({ note }: { note: LocalizedBlogAuthorNote }) {
  const { t } = useTranslation(["blog", "common"])
  const { isPlainDisplayMode } = useAnimationPreference()

  return <aside id={`author-note-${note.id}`} aria-label={t("blog:authorNote")} className="scroll-mt-28">
    <div className={isPlainDisplayMode ? "flex flex-col gap-3 border-l border-site-accent-border pl-4" : "flex flex-col gap-3 rounded-2xl border border-site-accent-border bg-site-accent-surface p-3 shadow-sm sm:p-4"}>
      <div className="blog-meta flex flex-wrap items-center gap-x-2 gap-y-1">
        <MessageSquareText aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span className="font-normal text-tone-2">{t("common:site.displayName")}</span>
        <span>{t("blog:authorNote")}</span>
        {note.publishedAt ? <time className="ml-auto" dateTime={note.publishedAt}>{formatBlogAuthorNoteDate(note.publishedAt)}</time> : null}
      </div>
      <div className="flex flex-col gap-3 font-body text-sm leading-relaxed text-tone-2">
        <Markdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children }) => <a href={href} className="site-text-link">{children}</a> }}>{note.markdown}</Markdown>
      </div>
    </div>
  </aside>
}

import { toString } from "mdast-util-to-string"
import type { Paragraph, Root } from "mdast"
import type { BlogLocale } from "./blog"

export type BlogAuthorNoteAnchor = { kind: "section-end" | "after-paragraph"; text: string }
export type BlogAuthorNoteContent = { anchor: BlogAuthorNoteAnchor; markdown: string }
export type BlogAuthorNote = {
  id: string
  articleId: string
  publishedAt?: string
  locales: Partial<Record<BlogLocale, BlogAuthorNoteContent>>
}
export type LocalizedBlogAuthorNote = Omit<BlogAuthorNote, "locales"> & BlogAuthorNoteContent

// Compare date-only years directly; timezone conversion must not shift the day.
export function formatBlogAuthorNoteDate(publishedAt: string, currentYear = new Date().getFullYear()) {
  return publishedAt.slice(0, 4) === String(currentYear) ? publishedAt.slice(5) : publishedAt
}

export function localizeBlogAuthorNotes(notes: BlogAuthorNote[], articleId: string, locale: BlogLocale): LocalizedBlogAuthorNote[] {
  return notes.flatMap(({ locales, ...note }) => {
    const content = locales[locale]
    return note.articleId === articleId && content ? [{ ...note, ...content }] : []
  })
}

// Run after remarkBlog so comments neither consume heading IDs nor enter the TOC.
// Match complete top-level text, never substrings inside code, quotes or lists.
export function remarkBlogAuthorNotes(notes: LocalizedBlogAuthorNote[] = []) {
  return (tree: Root) => {
    const insertions = new Map<number, LocalizedBlogAuthorNote[]>()
    for (const note of notes) {
      const candidates = tree.children.flatMap((node, index) => {
        const type = note.anchor.kind === "section-end" ? "heading" : "paragraph"
        return node.type === type && toString(node).trim() === note.anchor.text.trim() ? [index] : []
      })
      // If the source changes or the anchor is ambiguous, keep the note visible
      // at the end rather than attaching it to the wrong passage or dropping it.
      let after = tree.children.length - 1
      if (candidates.length === 1) {
        after = candidates[0]
        const start = tree.children[after]
        if (note.anchor.kind === "section-end" && start.type === "heading") {
          while (after + 1 < tree.children.length) {
            const next = tree.children[after + 1]
            if (next.type === "heading" && next.depth <= start.depth) break
            after++
          }
        }
      }
      insertions.set(after, [...(insertions.get(after) ?? []), note])
    }
    const markers = (index: number): Paragraph[] => (insertions.get(index) ?? []).map((note) => ({
      type: "paragraph", children: [], data: { hName: "aside", hProperties: { id: `author-note-${note.id}` } },
    }))
    tree.children = tree.children.length
      ? tree.children.flatMap((node, index) => [node, ...markers(index)])
      : markers(-1)
  }
}

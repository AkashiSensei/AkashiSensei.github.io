import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { visit } from "unist-util-visit"
import { toString } from "mdast-util-to-string"
import type { Heading, Paragraph, Root } from "mdast"

export type BlogHeading = { id: string; text: string; depth: number }

// Both the reader and its TOC run this same transform. Raw HTML stays disabled;
// only the line-break syntax already used in article tables is converted.
export function remarkBlog() {
  return (tree: Root) => {
    const promoted = new WeakSet<Heading>()
    tree.children = tree.children.flatMap((node): Root["children"] => {
      if (node.type !== "paragraph") return [node]
      const blocks: Root["children"] = []
      // Decide before trimming separators, so consecutive bold-only lines all qualify.
      const boldLines = node.children.map((child, position) => {
        const before = node.children[position - 1]
        const after = node.children[position + 1]
        return child.type === "strong" && toString(child).trim()
          && child.position?.start.line === child.position?.end.line
          && (!before || (before.type === "text" && /\n[ \t]*$/.test(before.value)))
          && (!after || (after.type === "text" && /^[ \t]*\r?\n/.test(after.value)))
      })
      let pending: Paragraph["children"] = []
      const flush = () => {
        if (pending.some((child) => child.type !== "text" || child.value.trim())) blocks.push({ ...node, children: pending })
        pending = []
      }
      node.children.forEach((child, position) => {
        const after = node.children[position + 1]
        if (!boldLines[position] || child.type !== "strong") {
          pending.push(child)
          return
        }
        const previous = pending.at(-1)
        if (previous?.type === "text") previous.value = previous.value.replace(/\r?\n[ \t]*$/, "")
        flush()
        const heading: Heading = { type: "heading", depth: 3, children: child.children, position: child.position }
        promoted.add(heading)
        blocks.push(heading)
        if (after?.type === "text") after.value = after.value.replace(/^[ \t]*\r?\n/, "")
      })
      flush()
      return blocks
    })
    let index = 0
    let boldIndex = 0
    visit(tree, (node, position, parent) => {
      if (node.type === "heading") {
        node.depth = Math.min(node.depth + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6
        // Adding implicit headings must not renumber previously shared section-N links.
        const id = promoted.has(node) ? `section-bold-${++boldIndex}` : `section-${++index}`
        node.data = { ...node.data, hProperties: { id } }
      }
      if (node.type === "html" && /^<br\s*\/?\s*>$/i.test(node.value.trim()) && parent && position !== undefined) {
        parent.children[position] = { type: "break" }
      }
    })
  }
}

export function getBlogHeadings(markdown: string): BlogHeading[] {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath).use(remarkBlog)
  const tree = processor.runSync(processor.parse(markdown)) as Root
  const headings: BlogHeading[] = []
  visit(tree, "heading", (node) => {
    headings.push({ id: String(node.data?.hProperties?.id), text: toString(node), depth: node.depth })
  })
  return headings
}

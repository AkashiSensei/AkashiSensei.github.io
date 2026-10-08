import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdtemp, writeFile, symlink, rm, mkdir } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import sharp from 'sharp'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { getBlogHeadingUrl } from '../src/lib/blog-links.ts'
import { getReadingSection, observeBlogReadingSection } from '../src/lib/blog-reading.ts'
import { getBlogGalleryImages } from '../src/lib/blog-images.ts'
import { sortBlogArticlesByPublication } from '../src/lib/blog-order.ts'
import { featuredBlogArticleIds } from '../src/data/blog.ts'
import { remarkBlog, getBlogHeadings } from '../src/lib/blog-markdown.ts'
import { formatBlogAuthorNoteDate, localizeBlogAuthorNotes, remarkBlogAuthorNotes } from '../src/lib/blog-author-notes.ts'
import { resolveSourceFile, extractTitle, importArticle, getArticleReadingStats } from '../scripts/import-blog.mjs'

const snapshot = JSON.parse(await readFile(new URL('../src/content/blog/generated.json', import.meta.url), 'utf8'))
const selection = JSON.parse(await readFile(new URL('../src/content/blog/publish.json', import.meta.url), 'utf8'))
const authorNotes = JSON.parse(await readFile(new URL('../src/content/blog/author-notes.json', import.meta.url), 'utf8'))

test('resume article curation has unique published IDs with both language variants', () => {
  assert.equal(new Set(featuredBlogArticleIds).size, featuredBlogArticleIds.length)
  for (const id of featuredBlogArticleIds) {
    const article = snapshot.articles.find((entry) => entry.id === id)
    assert.ok(article, `Missing featured article: ${id}`)
    assert.ok(article.locales.zh && article.locales.en)
  }
})

function render(markdown, notes = []) {
  return renderToStaticMarkup(React.createElement(Markdown, {
    remarkPlugins: [remarkGfm, remarkMath, remarkBlog, [remarkBlogAuthorNotes, notes]],
    rehypePlugins: [[rehypeKatex, { trust: false }], [rehypeHighlight, { detect: false }]],
    children: markdown,
  }))
}

test('author notes reference published articles, keep unique IDs, and resolve in both languages', () => {
  assert.equal(new Set(authorNotes.map(({ id }) => id)).size, authorNotes.length)
  for (const note of authorNotes) {
    assert.match(note.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    if (note.publishedAt) {
      assert.match(note.publishedAt, /^\d{4}-\d{2}-\d{2}$/)
      assert.equal(new Date(`${note.publishedAt}T00:00:00Z`).toISOString().slice(0, 10), note.publishedAt)
    }
    const article = snapshot.articles.find(({ id }) => id === note.articleId)
    assert.ok(article)
    for (const locale of ['zh', 'en']) {
      const content = note.locales[locale]
      assert.ok(content.markdown.trim())
      const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).use(remarkBlog).runSync(
        unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(article.locales[locale].markdown),
      )
      const nodes = tree.children.filter(({ type }) => type === (content.anchor.kind === 'section-end' ? 'heading' : 'paragraph'))
      assert.equal(nodes.filter((node) => toString(node).trim() === content.anchor.text.trim()).length, 1)
      const localized = localizeBlogAuthorNotes(authorNotes, article.id, locale)
      assert.ok(localized.some(({ id, markdown }) => id === note.id && markdown === content.markdown))
    }
  }
})

test('author note dates retain their original year after year-end and never shift calendar days', () => {
  const publishedAt = authorNotes.find(({ id }) => id === 'keyring-storage-update').publishedAt
  assert.equal(publishedAt, '2026-09-28')
  assert.equal(formatBlogAuthorNoteDate(publishedAt, 2026), '09-28')
  assert.equal(formatBlogAuthorNoteDate(publishedAt, 2027), '2026-09-28')
  assert.equal(formatBlogAuthorNoteDate(publishedAt, 2028), '2026-09-28')
  assert.equal(formatBlogAuthorNoteDate(publishedAt, 2025), '2026-09-28')
  assert.equal(formatBlogAuthorNoteDate('2026-12-31', 2027), '2026-12-31')
  assert.equal(formatBlogAuthorNoteDate('2027-01-01', 2027), '01-01')
  assert.equal(formatBlogAuthorNoteDate('2024-02-29', 2024), '02-29')
})

test('author updates follow their target sections in both languages without changing shared heading IDs', () => {
  const cases = [
    { articleId: 'cli-tool-design', noteId: 'keyring-storage-update', previous: { zh: '目前以站点、用户名、登录方式为键存储这些凭据。', en: 'Currently, the key is based on site, username, and login method.' }, following: { zh: '登录与鉴权', en: 'Login and authentication' } },
    { articleId: 'qclaw-first-look', noteId: 'qclaw-shutdown-update', previous: { zh: '而不是把它玩的花里胡哨，折腾出来一些我根本不需要的东西。', en: 'I did not want to play with fancy features and build things I do not actually need.' }, following: { zh: '使用体验', en: 'User experience' } },
  ]
  for (const entry of cases) for (const locale of ['zh', 'en']) {
    const article = snapshot.articles.find(({ id }) => id === entry.articleId)
    const markdown = article.locales[locale].markdown
    const notes = localizeBlogAuthorNotes(authorNotes, article.id, locale)
    const html = render(markdown, notes)
    const marker = html.indexOf(`<aside id="author-note-${entry.noteId}"`)
    const previous = entry.previous[locale]
    const following = getBlogHeadings(markdown).find(({ text }) => text === entry.following[locale])
    assert.ok(following)
    assert.ok(marker > html.indexOf(previous) && html.indexOf(previous) >= 0)
    assert.ok(marker < html.indexOf(`<h${following.depth} id="${following.id}"`))
    assert.equal(html.split(`author-note-${entry.noteId}`).length - 1, 1)
    assert.deepEqual([...html.matchAll(/<h[2-6] id="([^"]+)"/g)].map((match) => match[1]), getBlogHeadings(markdown).map(({ id }) => id))
    assert.equal(render(markdown).includes('author-note-'), false)
  }
  assert.deepEqual(localizeBlogAuthorNotes(authorNotes, 'another-article', 'zh'), [])
})

test('note placement includes subsections, preserves order, and ignores quoted or code anchors', () => {
  const markdown = '# Intro\n\n## Storage\n\nParagraph with `keyring`.\n\n### Detail\n\nMore detail.\n\n## Login\n\nEnd.'
  const base = { articleId: 'fixture', markdown: 'Update.' }
  const notes = [
    { ...base, id: 'first', anchor: { kind: 'section-end', text: 'Storage' } },
    { ...base, id: 'second', anchor: { kind: 'section-end', text: 'Storage' } },
    { ...base, id: 'inline', anchor: { kind: 'after-paragraph', text: 'Paragraph with keyring.' } },
  ]
  const html = render(markdown, notes)
  assert.ok(html.indexOf('Paragraph with') < html.indexOf('author-note-inline'))
  assert.ok(html.indexOf('author-note-inline') < html.indexOf('>Detail</h4>'))
  assert.ok(html.indexOf('More detail.') < html.indexOf('author-note-first'))
  assert.ok(html.indexOf('author-note-first') < html.indexOf('author-note-second'))
  assert.ok(html.indexOf('author-note-second') < html.indexOf('>Login</h3>'))
  const missing = { ...base, id: 'missing', anchor: { kind: 'after-paragraph', text: 'Target' } }
  const quoted = render('> Target\n\n```text\nTarget\n```\n\nLast.', [missing])
  assert.ok(quoted.indexOf('Last.') < quoted.indexOf('author-note-missing'))
  const ambiguous = render('Target\n\nTarget\n\nLast.', [missing])
  assert.ok(ambiguous.indexOf('Last.') < ambiguous.indexOf('author-note-missing'))
  assert.ok(render('', [missing]).includes('author-note-missing'))
})

test('publication order is newest-first, stable for tied or missing dates, and preserves canonical input', () => {
  const articles = [
    { id: 'undated' },
    { id: 'older', publishedAt: '2026-04-13' },
    { id: 'newer', publishedAt: '2026-10-08' },
    { id: 'same-day', publishedAt: '2026-10-08' },
    { id: 'another-undated' },
  ]
  assert.deepEqual(sortBlogArticlesByPublication(articles).map(({ id }) => id), ['newer', 'same-day', 'older', 'undated', 'another-undated'])
  assert.deepEqual(articles.map(({ id }) => id), ['undated', 'older', 'newer', 'same-day', 'another-undated'])
  assert.deepEqual(sortBlogArticlesByPublication([]), [])
})

test('article title is separated without removing introductory paragraphs', () => {
  const { title, markdown } = extractTitle('Volcano\n\n![Cover](images/cover.png)\n\nIntro\n\n# Scheduling')
  assert.equal(title, 'Volcano')
  assert.ok(markdown.startsWith('![Cover]'))
  assert.ok(markdown.includes('Intro'))
})

test('Chinese reading statistics count Han characters and terms without markup, URLs, images, code blocks or formulas', () => {
  const markdown = '# 标题\n\n你好，**世界**！PodGroup 与 `Queue`，300。\n\n[链接](https://example.com/words-not-counted)\n\n![不计的图片说明](images/cover.png)\n\n```text\n这里不计入字数 Code goes here\n```\n\n$$\nE=mc^2\n$$'
  assert.deepEqual(getArticleReadingStats(markdown, 'zh'), { unitCount: 12, minutes: 1 })
  assert.deepEqual(getArticleReadingStats('𠮷', 'zh'), { unitCount: 1, minutes: 1 })
})

test('English reading statistics preserve inline words, contractions and table text while excluding non-prose', () => {
  const markdown = "## Re**ad**ing\n\nHello [world](https://example.com/not-counted), it's a well-tested `PodGroup`.\n\n| Name | Value |\n| - | - |\n| queue | 123 |\n\n![Ignored words](images/cover.png)\n\n```js\nconst ignored = 'more words';\n```\n\n$$\n\\sum_{i=1}^n i\n$$"
  assert.deepEqual(getArticleReadingStats(markdown, 'en'), { unitCount: 11, minutes: 1 })
  assert.deepEqual(getArticleReadingStats('one<br>two', 'en'), { unitCount: 2, minutes: 1 })
})

test('reading time rounds up at language-specific boundaries and gives zero for empty prose', () => {
  for (const locale of ['zh', 'en']) assert.deepEqual(getArticleReadingStats('![Only an image](cover.png)\n\n```text\nOnly code\n```\n\n$x$', locale), { unitCount: 0, minutes: 0 })
  assert.deepEqual(getArticleReadingStats('字'.repeat(300), 'zh'), { unitCount: 300, minutes: 1 })
  assert.deepEqual(getArticleReadingStats('字'.repeat(301), 'zh'), { unitCount: 301, minutes: 2 })
  assert.deepEqual(getArticleReadingStats('word '.repeat(200), 'en'), { unitCount: 200, minutes: 1 })
  assert.deepEqual(getArticleReadingStats('word '.repeat(201), 'en'), { unitCount: 201, minutes: 2 })
})

test('TOC follows actual headings, preserves inline text, and has unique links', () => {
  const markdown = '# One `Pod`\n\n## Repeat\n\n## Repeat\n\n```text\n# Not a heading\n```'
  const headings = getBlogHeadings(markdown)
  assert.deepEqual(headings.map((item) => item.text), ['One Pod', 'Repeat', 'Repeat'])
  assert.deepEqual(headings.map((item) => item.depth), [2, 3, 3])
  const html = render(markdown)
  for (const heading of headings) assert.ok(html.includes(`id="${heading.id}"`))
  assert.equal(new Set(headings.map((item) => item.id)).size, headings.length)
  assert.ok(!html.includes('<h1'))
})

test('standalone bold lines and ### use the same third-level heading role without renumbering explicit anchors', () => {
  const markdown = '# Chapter\n\nBefore\n**Choice `Pod` $x$**\nAfter\n\n## Allocation\n\n### Choice\n\n**Choice**\n**Next**'
  const headings = getBlogHeadings(markdown)
  assert.deepEqual(headings.map(({ id, depth }) => ({ id, depth })), [
    { id: 'section-1', depth: 2 },
    { id: 'section-bold-1', depth: 4 },
    { id: 'section-2', depth: 3 },
    { id: 'section-3', depth: 4 },
    { id: 'section-bold-2', depth: 4 },
    { id: 'section-bold-3', depth: 4 },
  ])
  const html = render(markdown)
  assert.match(html, /<p>Before<\/p>\s*<h4 id="section-bold-1">Choice <code>Pod<\/code>/)
  assert.match(html, /<\/h4>\s*<p>After<\/p>/)
  assert.match(html, /<h4 id="section-3">Choice<\/h4>/)
  assert.match(html, /<h4 id="section-bold-2">Choice<\/h4>/)
  assert.ok(html.includes('class="katex"'))
  assert.equal(new Set(headings.map(({ id }) => id)).size, headings.length)
})

test('inline emphasis, nested blocks, tables, code, and multiline bold paragraphs retain their meaning', () => {
  const markdown = 'Normal **emphasis**.\n\n**Bold** followed by text\n\n> **Quote**\n\n- **List**\n\n| A |\n| - |\n| **Cell** |\n\n**Multiple\nlines**\n\n```md\n**Literal**\n### Literal\n```'
  assert.deepEqual(getBlogHeadings(markdown), [])
  const html = render(markdown)
  for (const text of ['emphasis', 'Bold', 'Quote', 'List', 'Cell']) assert.ok(html.includes(`<strong>${text}</strong>`))
  assert.ok(!html.includes('<h4'))
})

test('inline and display formulas render as KaTeX with accessible MathML', () => {
  const html = render('Inline $E=mc^2$.\n\n$$\n\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}\n$$')
  assert.ok(html.includes('class="katex"'))
  assert.ok(html.includes('katex-display'))
  assert.ok(html.includes('<math'))
  assert.ok(html.includes('<mfrac>'))
})

test('GFM tables retain explicit breaks without interpreting HTML', () => {
  const html = render('| A | B |\n| - | - |\n| First<br>Second | ~~old~~ |\n\n<script>alert(1)</script>')
  assert.ok(html.includes('<table>'))
  assert.match(html, /First<br\/>\s*Second/)
  assert.ok(html.includes('<del>old</del>'))
  assert.ok(!html.includes('<script>'))
})

test('code preserves literal HTML and line breaks while highlighting YAML', () => {
  const html = render('```yaml\nactions: enqueue, allocate\n```\n\n```text\n<br>\n# Literal\n```')
  assert.ok(html.includes('hljs-attr'))
  assert.ok(html.includes('&lt;br&gt;'))
  assert.ok(html.includes('# Literal'))
})

test('dangerous Markdown links and trusted TeX extensions stay disabled', () => {
  const html = render('[Bad](javascript:alert%281%29)\n\n$\\href{javascript:alert(1)}{bad}$')
  assert.ok(!html.includes('href="javascript:'))
})

test('publication selection, bilingual content, and all runtime image files are valid', async () => {
  assert.deepEqual(snapshot.articles.map((item) => item.id), selection.map((item) => item.id))
  for (const article of snapshot.articles) {
    assert.equal(article.source.contentHash.length, 64)
    const entry = selection.find((item) => item.id === article.id)
    assert.equal(article.publishedAt, entry.publishedAt)
    assert.equal(article.zhihuUrl, entry.zhihuUrl)
    for (const [locale, config] of Object.entries(entry.locales)) {
      const content = article.locales[locale]
      assert.ok(content.title)
      assert.ok(content.markdown)
      assert.deepEqual(content.readingStats, getArticleReadingStats(content.markdown, locale))
      const tree = unified().use(remarkParse).parse(content.markdown)
      const refs = []
      visit(tree, 'image', (node) => refs.push(node.url))
      if (config.cover) {
        assert.ok(content.cover)
        assert.ok(!content.markdown.includes(content.cover.src))
      }
      for (const src of refs) assert.ok(content.images[src])
      const gallery = getBlogGalleryImages(content)
      if (content.cover) assert.equal(gallery[0].src, content.cover.src)
      assert.equal(gallery.length, new Set([...(content.cover ? [content.cover.src] : []), ...refs]).size)
      for (const asset of gallery) {
        const src = asset.src
        assert.match(src, /^\/assets\/blog\/[^/]+\/[^/]+\.webp$/)
        assert.equal(encodeURI(src), src, 'runtime asset URLs must remain stable through Markdown URL normalization')
        const metadata = await sharp(path.join('public', src)).metadata()
        assert.equal(metadata.format, 'webp')
        assert.equal(metadata.width, asset.width)
        assert.equal(metadata.height, asset.height)
      }
    }
  }
})

test('independent localized covers import without Markdown references and affect the source fingerprint', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'blog-cover-'))
  const root = path.join(temp, 'source')
  const publicRoot = path.join(temp, 'public')
  const entry = {
    id: 'fixture', directory: 'article', category: 'infra', publishedAt: '2026-10-08', zhihuUrl: 'https://zhuanlan.zhihu.com/p/123', tags: [], relatedProjects: [],
    locales: {
      zh: { file: 'zh.md', title: '站点展示标题', summary: '摘要', reviewed: true, cover: { file: 'images/cover.png', alt: '封面' } },
      en: { file: 'en.md', summary: 'Summary', reviewed: false, cover: { file: 'images/cover.png', alt: 'Cover' } },
    },
  }
  try {
    await mkdir(path.join(root, 'article/images'), { recursive: true })
    await sharp({ create: { width: 30, height: 20, channels: 3, background: 'white' } }).png().toFile(path.join(root, 'article/images/cover.png'))
    await sharp({ create: { width: 15, height: 10, channels: 3, background: 'black' } }).png().toFile(path.join(root, 'article/images/中文 with spaces.png'))
    for (const locale of ['zh', 'en']) await writeFile(path.join(root, `article/${locale}.md`), `Title ${locale}\n\nText\n\n![Body](images/中文%20with%20spaces.png)\n\n![Repeated](images/中文%20with%20spaces.png)`)
    const article = await importArticle(root, entry, { publicRoot })
    assert.equal(article.publishedAt, entry.publishedAt)
    assert.equal(article.zhihuUrl, entry.zhihuUrl)
    for (const zhihuUrl of ['javascript:alert(1)', 'https://example.com/p/123', 'https://zhuanlan.zhihu.com/p/123?tracking=1']) {
      await assert.rejects(importArticle(root, { ...entry, zhihuUrl }, { publicRoot }), /Invalid Zhihu article URL/)
    }
    for (const publishedAt of ['2026-02-30', '2026-13-01', '2026-10-08T12:00:00', '', null]) {
      await assert.rejects(importArticle(root, { ...entry, publishedAt }, { publicRoot }), /Invalid publication date/)
    }
    for (const [locale, content] of Object.entries(article.locales)) {
      assert.equal(content.title, entry.locales[locale].title ?? `Title ${locale}`)
      assert.ok(content.markdown.startsWith('Text\n')) // Source title is still stripped when its display title is overridden.
      assert.equal(content.cover.alt, entry.locales[locale].cover.alt)
      assert.equal(content.cover.brightness, 'high')
      assert.equal(Object.keys(content.images).length, 1)
      const body = Object.values(content.images)[0]
      assert.equal(encodeURI(body.src), body.src)
      assert.ok(render(content.markdown).includes(`src="${body.src}"`))
      assert.ok(!content.markdown.includes('cover.png'))
      assert.ok(!content.markdown.includes(content.cover.src))
      const gallery = getBlogGalleryImages(content)
      assert.equal(gallery.length, 2)
      assert.equal(gallery[0].src, content.cover.src)
      for (const image of gallery) assert.equal((await sharp(path.join(publicRoot, image.src)).metadata()).format, 'webp')
    }
    assert.equal(article.locales.zh.cover.src, article.locales.en.cover.src)
    assert.equal(article.locales.zh.cover.sha256, article.locales.en.cover.sha256)
    await sharp({ create: { width: 30, height: 20, channels: 3, background: 'red' } }).png().toFile(path.join(root, 'article/images/cover.png'))
    const changed = await importArticle(root, entry, { publicRoot })
    assert.notEqual(changed.source.contentHash, article.source.contentHash)
    assert.notEqual(changed.locales.zh.cover.sha256, article.locales.zh.cover.sha256)
    await writeFile(path.join(temp, 'outside.png'), 'Outside')
    const escaping = structuredClone(entry)
    escaping.locales.zh.cover.file = '../../outside.png'
    await assert.rejects(importArticle(root, escaping, { publicRoot }), /outside blog source/)
  } finally { await rm(temp, { recursive: true, force: true }) }
})

test('gallery order is cover-first, deduplicates legacy cover references, and supports missing images', () => {
  const cover = { src: '/cover.webp', alt: 'Cover', width: 30, height: 20, brightness: 'normal' }
  const body = { ...cover, src: '/body.webp' }
  const content = { title: 'Title', summary: '', reviewed: true, markdown: '', cover, images: { [body.src]: body, [cover.src]: cover } }
  assert.deepEqual(getBlogGalleryImages(content).map(({ src }) => src), ['/cover.webp', '/body.webp'])
  assert.deepEqual(getBlogGalleryImages({ ...content, cover: undefined, images: { [body.src]: body } }), [body])
  assert.deepEqual(getBlogGalleryImages({ ...content, images: {} }), [cover])
  assert.deepEqual(getBlogGalleryImages({ ...content, cover: undefined, images: {} }), [])
})

test('content import rejects traversal and symlink escapes', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'blog-path-'))
  const root = path.join(temp, 'source')
  const { mkdir } = await import('node:fs/promises')
  try {
    await mkdir(root)
    await writeFile(path.join(temp, 'outside.md'), 'Outside')
    await symlink(path.join(temp, 'outside.md'), path.join(root, 'link.md'))
    await assert.rejects(resolveSourceFile(root, '../outside.md'), /outside blog source/)
    await assert.rejects(resolveSourceFile(root, 'link.md'), /outside blog source/)
  } finally { await rm(temp, { recursive: true, force: true }) }
})


test('section sharing replaces the old anchor and pins the actual reading language', () => {
  const link = getBlogHeadingUrl('https://akashisensei.github.io/blog/volcano-job-scheduling-admission?lang=zh&from=resume#section-2', 'section-11', 'en')
  assert.equal(link, 'https://akashisensei.github.io/blog/volcano-job-scheduling-admission?lang=en&from=resume#section-11')
  assert.equal(getBlogHeadingUrl('http://localhost:5173/blog/volcano-job-scheduling-admission', 'section-11', 'zh'), 'http://localhost:5173/blog/volcano-job-scheduling-admission?lang=zh#section-11')
})

test('reading position follows scrolling, long sections, reverse jumps, and page end', () => {
  const headings = [
    { id: 'section-1', top: 300 },
    { id: 'section-2', top: 2000 },
    { id: 'section-3', top: 2200 },
  ]
  const atScroll = (scroll, end = false) => getReadingSection(headings.map((heading) => ({ ...heading, top: heading.top - scroll })), 112, end)
  assert.equal(atScroll(0), undefined) // Introduction before the first section.
  assert.equal(atScroll(188), 'section-1') // Matches the anchor's scroll margin.
  assert.equal(atScroll(1800), 'section-1') // Heading is offscreen; still in its long section.
  assert.equal(atScroll(1900), 'section-2')
  assert.equal(atScroll(2100), 'section-3') // Large jumps need no intermediate intersection.
  assert.equal(atScroll(1900), 'section-2') // Upward scrolling updates the current section.
  assert.equal(atScroll(1800, true), 'section-3') // Final short section cannot always reach the reading line.
  assert.equal(getReadingSection([], 112, true), undefined)
})

test('reading tracker survives replaced Markdown nodes and reads the actual scrolling root', () => {
  const names = ['window', 'document', 'getComputedStyle', 'ResizeObserver', 'MutationObserver']
  const saved = new Map(names.map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]))
  const listeners = new Map()
  const frames = new Map()
  const observers = []
  const root = { scrollTop: 0, scrollHeight: 6000, clientHeight: 800 }
  let frameId = 0
  const flush = () => {
    const callbacks = [...frames.values()]
    frames.clear()
    callbacks.forEach(callback => callback())
  }
  class Observer {
    disconnected = false
    constructor(callback) { this.callback = callback; observers.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  const heading = (id, position) => ({
    id, position, isConnected: true, visible: true,
    getClientRects() { return this.isConnected && this.visible ? [{}] : [] },
    getBoundingClientRect() { return { top: this.isConnected ? this.position - root.scrollTop : 0 } },
  })
  const originals = [heading('section-1', 300), heading('section-2', 1200), heading('section-3', 3000)]
  let current = originals
  const body = { querySelectorAll: () => current }
  const states = []
  let stop
  try {
    Object.defineProperties(globalThis, {
      window: { configurable: true, value: {
        innerHeight: 800,
        addEventListener: (name, callback) => listeners.set(name, callback),
        removeEventListener: name => listeners.delete(name),
        requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId },
        cancelAnimationFrame: id => frames.delete(id),
      } },
      // A different documentElement height must not force the conclusion active.
      document: { configurable: true, value: { scrollingElement: root, documentElement: { scrollHeight: 800 } } },
      getComputedStyle: { configurable: true, value: () => ({ scrollMarginTop: '112px' }) },
      ResizeObserver: { configurable: true, value: Observer },
      MutationObserver: { configurable: true, value: Observer },
    })
    stop = observeBlogReadingSection(body, originals.map(({ id }) => id), section => states.push(section))
    flush()
    assert.equal(states.at(-1), undefined)
    root.scrollTop = 600
    listeners.get('scroll')()
    flush()
    assert.equal(states.at(-1), 'section-1')

    originals.forEach(element => { element.isConnected = false })
    // This is the original failure: detached nodes all report top = 0.
    assert.equal(getReadingSection(originals.map(element => ({ id: element.id, ...element.getBoundingClientRect() })), 113), 'section-3')
    current = [heading('section-1', 300), heading('section-2', 1200), heading('section-3', 3000)]
    observers[1].callback()
    flush()
    assert.equal(states.at(-1), 'section-1')

    root.scrollTop = 1300
    listeners.get('scroll')()
    flush()
    assert.equal(states.at(-1), 'section-2')
    current[1].position = 2100 // Image/font/layout changes move headings.
    observers[0].callback()
    flush()
    assert.equal(states.at(-1), 'section-1')
    root.scrollTop = 2900
    listeners.get('hashchange')()
    flush()
    assert.equal(states.at(-1), 'section-3')
    root.scrollTop = 600
    listeners.get('scroll')()
    flush()
    assert.equal(states.at(-1), 'section-1')
    root.scrollTop = 5200
    listeners.get('scroll')()
    flush()
    assert.equal(states.at(-1), 'section-3')
    current.forEach(element => { element.visible = false })
    observers[1].callback()
    flush()
    assert.equal(states.at(-1), undefined)
    listeners.get('resize')()
    stop()
    assert.equal(frames.size, 0)
    assert.equal(listeners.size, 0)
    assert(observers.every(observer => observer.disconnected))
  } finally {
    stop?.()
    for (const [name, descriptor] of saved) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor)
      else delete globalThis[name]
    }
  }
})

import { readFile, writeFile, mkdir, realpath } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { visit } from 'unist-util-visit'

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(site, 'src/content/blog/generated.json')
const manifest = JSON.parse(await readFile(path.join(site, 'src/content/blog/publish.json'), 'utf8'))
const parser = unified().use(remarkParse).use(remarkGfm).use(remarkMath)

function readableBodyText(node) {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value
  if (node.type === 'break' || node.type === 'inlineMath' || node.type === 'image' || node.type === 'imageReference') return ' '
  if (node.type === 'html') return /^<br\s*\/?\s*>$/i.test(node.value.trim()) ? ' ' : ''
  if (!node.children) return ''
  const inline = ['paragraph', 'heading', 'tableCell', 'strong', 'emphasis', 'delete', 'link', 'linkReference'].includes(node.type)
  return node.children.map(readableBodyText).join(inline ? '' : '\n')
}

function readingStatsFromTree(tree, locale) {
  const text = readableBodyText(tree)
  const han = locale === 'zh' ? (text.match(/\p{Script=Han}/gu) ?? []).length : 0
  const words = (locale === 'zh' ? text.replace(/\p{Script=Han}/gu, ' ') : text)
    .match(/[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu) ?? []
  const unitCount = han + words.length
  return { unitCount, minutes: Math.ceil(unitCount / (locale === 'zh' ? 300 : 200)) }
}

export function getArticleReadingStats(markdown, locale) {
  return readingStatsFromTree(parser.parse(markdown), locale)
}

function validatePublicationMetadata(entry) {
  for (const config of Object.values(entry.locales)) {
    if (config.title !== undefined && (typeof config.title !== 'string' || !config.title.trim())) throw new Error(`Invalid display title: ${entry.id}`)
  }
  if (entry.zhihuUrl !== undefined && (typeof entry.zhihuUrl !== 'string' || !/^https:\/\/zhuanlan\.zhihu\.com\/p\/\d+$/.test(entry.zhihuUrl))) {
    throw new Error(`Invalid Zhihu article URL: ${entry.id}`)
  }
  if (entry.publishedAt === undefined) return
  const date = entry.publishedAt
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) {
    throw new Error(`Invalid publication date for ${entry.id}: expected YYYY-MM-DD`)
  }
}

export async function resolveSourceFile(root, relative) {
  const source = await realpath(path.resolve(root, relative))
  const fromRoot = path.relative(await realpath(root), source)
  if (fromRoot.startsWith('..') || path.isAbsolute(fromRoot)) throw new Error(`Path outside blog source: ${relative}`)
  return source
}

export function extractTitle(markdown) {
  const match = markdown.trimStart().match(/^(?:#\s+)?([^\n]+)\n+/)
  if (!match || /^[!<]/.test(match[1])) throw new Error('Missing article title')
  return { title: match[1].trim(), markdown: markdown.trimStart().slice(match[0].length) }
}

async function validateSnapshot() {
  const snapshot = JSON.parse(await readFile(output, 'utf8'))
  if (snapshot.articles.length !== manifest.length) throw new Error('Blog snapshot differs from publication list; reimport it')
  for (const entry of manifest) {
    validatePublicationMetadata(entry)
    const article = snapshot.articles.find((item) => item.id === entry.id)
    if (!article || JSON.stringify(article.selection) !== JSON.stringify(entry)) throw new Error(`Stale blog snapshot: ${entry.id}`)
    if (article.publishedAt !== entry.publishedAt) throw new Error(`Stale publication date: ${entry.id}`)
    if (article.zhihuUrl !== entry.zhihuUrl) throw new Error(`Stale Zhihu article URL: ${entry.id}`)
    for (const locale of Object.keys(entry.locales)) {
      const content = article.locales[locale]
      if (!content?.title || !content.markdown) throw new Error(`Missing ${entry.id}/${locale}`)
      if (entry.locales[locale].title !== undefined && content.title !== entry.locales[locale].title) throw new Error(`Stale display title: ${entry.id}/${locale}`)
      if (JSON.stringify(content.readingStats) !== JSON.stringify(getArticleReadingStats(content.markdown, locale))) throw new Error(`Stale reading statistics: ${entry.id}/${locale}; reimport it`)
      if (entry.locales[locale].cover && !content.cover) throw new Error(`Missing cover: ${entry.id}/${locale}`)
      for (const asset of [...Object.values(content.images), ...(content.cover ? [content.cover] : [])]) {
        if (!asset.src.startsWith(`/assets/blog/${entry.id}/`) || !asset.src.endsWith('.webp')) throw new Error('Invalid generated asset path')
        const bytes = await readFile(path.join(site, 'public', asset.src))
        if (createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error(`Corrupt blog image: ${asset.src}`)
      }
    }
  }
  console.log(`Validated ${snapshot.articles.length} blog article snapshot(s)`)
}

export async function importArticle(sourceRoot, entry, { publicRoot = path.join(site, 'public'), baseCommit = null } = {}) {
  validatePublicationMetadata(entry)
  const root = await realpath(sourceRoot)
  if (!/^[a-z0-9-]+$/.test(entry.id)) throw new Error(`Invalid article ID: ${entry.id}`)
  const locales = {}
  const fingerprint = createHash('sha256')
  const converted = new Map()
  const destinations = new Map()
  const importImage = async (imageFile, alt) => {
    const bytes = await readFile(imageFile)
    fingerprint.update(path.relative(root, imageFile)).update(bytes)
    if (!converted.has(imageFile)) {
      const basename = path.basename(imageFile, path.extname(imageFile))
      // Markdown and browser URL normalization must agree with metadata keys.
      // Keep existing safe names; use stable ASCII names for spaces/non-ASCII.
      const safeName = /^[a-z0-9._-]+$/i.test(basename) ? basename : `${basename.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '') || 'image'}-${createHash('sha256').update(path.relative(root, imageFile)).digest('hex').slice(0, 12)}`
      const name = `${safeName}.webp`
      const src = `/assets/blog/${entry.id}/${name}`
      if (destinations.has(src) && destinations.get(src) !== imageFile) throw new Error(`Conflicting blog image names: ${src}`)
      destinations.set(src, imageFile)
      const webp = await sharp(bytes).webp({ quality: 90, effort: 6 }).toBuffer()
      const metadata = await sharp(webp).metadata()
      const { data, info } = await sharp(webp).resize(48, 48, { fit: 'inside' }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
      let bright = 0
      for (let index = 0; index < data.length; index += info.channels) {
        if (data[index] > 225 && data[index + 1] > 225 && data[index + 2] > 225) bright++
      }
      const brightness = bright / (info.width * info.height) > 0.4 ? 'high' : 'normal'
      await mkdir(path.join(publicRoot, 'assets/blog', entry.id), { recursive: true })
      await writeFile(path.join(publicRoot, src), webp)
      converted.set(imageFile, { src, width: metadata.width, height: metadata.height, brightness, sha256: createHash('sha256').update(webp).digest('hex') })
    }
    return { ...converted.get(imageFile), alt }
  }
  for (const [locale, config] of Object.entries(entry.locales)) {
    const articleFile = await resolveSourceFile(root, path.join(entry.directory, config.file))
    const source = await readFile(articleFile, 'utf8')
    fingerprint.update(locale).update(source)
    const { title: sourceTitle, markdown } = extractTitle(source)
    const title = config.title ?? sourceTitle
    // A cover is selected independently; it never has to appear in Markdown.
    const cover = config.cover ? await importImage(
      await resolveSourceFile(root, path.join(entry.directory, config.cover.file)), config.cover.alt || title,
    ) : undefined
    const tree = parser.parse(markdown)
    const nodes = []
    visit(tree, (node) => { if (node.type === 'image' || node.type === 'definition') nodes.push(node) })
    const images = {}
    const replacements = []
    for (const node of nodes) {
      if (!node.url || /^(?:[a-z]+:|\/\/)/i.test(node.url)) throw new Error(`Blog assets must be local: ${node.url}`)
      const imageFile = await resolveSourceFile(root, path.relative(root, path.resolve(path.dirname(articleFile), decodeURIComponent(node.url))))
      const asset = await importImage(imageFile, node.alt ?? '')
      images[asset.src] = asset
      const start = node.position.start.offset
      const end = node.position.end.offset
      replacements.push({ start, end, value: markdown.slice(start, end).replace(node.url, asset.src) })
    }
    let rewritten = markdown
    for (const change of replacements.sort((a, b) => b.start - a.start)) rewritten = rewritten.slice(0, change.start) + change.value + rewritten.slice(change.end)
    locales[locale] = { title, summary: config.summary, reviewed: config.reviewed, readingStats: readingStatsFromTree(tree, locale), markdown: rewritten, ...(cover ? { cover } : {}), images }
  }
  return { id: entry.id, category: entry.category, ...(entry.publishedAt ? { publishedAt: entry.publishedAt } : {}), ...(entry.zhihuUrl ? { zhihuUrl: entry.zhihuUrl } : {}), tags: entry.tags, relatedProjects: entry.relatedProjects, selection: entry, source: { repository: 'AkashiSensei/blog-article', baseCommit, contentHash: fingerprint.digest('hex') }, locales }
}

async function importSource(sourceRoot) {
  const root = await realpath(sourceRoot)
  const ids = new Set()
  const articles = []
  let commit = null
  try { commit = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() } catch { /* Content hash also supports non-Git sources. */ }
  for (const entry of manifest) {
    if (ids.has(entry.id)) throw new Error(`Duplicate article ID: ${entry.id}`)
    ids.add(entry.id)
    articles.push(await importArticle(root, entry, { baseCommit: commit }))
  }
  await writeFile(output, JSON.stringify({ articles }, null, 2) + '\n')
  console.log(`Imported ${articles.length} bilingual blog article(s); source bodies remain in blog-article`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const source = process.argv[2] || process.env.BLOG_SOURCE_DIR
  if (source) await importSource(source)
  else await validateSnapshot()
}

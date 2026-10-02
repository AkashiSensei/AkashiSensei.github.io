import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { createInstance } from 'i18next'
import { formatDocumentTag } from '../src/lib/tag-label.ts'
import { createWall, advanceWall, resizeWall } from '../src/lib/question-wall.ts'
import { filterQuestions, questionProjectKey, normalizeQuestionTags, toggleQuestionTag, shuffleQuestions, relatedQuestionPage } from '../src/lib/questions.ts'
import { fitQuestionText } from '../src/lib/question-text-layout.ts'
import { getWallDepth, getWallMotionFrames, QUESTION_WALL_MOTION } from '../src/lib/question-wall-motion.ts'
import { conversationTravel, conversationExitDuration, CONVERSATION_MOTION } from '../src/lib/question-conversation-motion.ts'
import { questionRoundImages, resolveQuestionImage, questionConversationPartCount } from '../src/lib/question-images.ts'
import { masonryLayout } from '../src/lib/masonry-layout.ts'

test('question masonry fills the shorter column while preserving newest-first vertical order', () => {
  const heights = [240, 100, 80, 160, 90, 310, 120]
  const { positions, height } = masonryLayout(heights, 2, 400, 32)
  assert.deepEqual(positions.slice(0, 3), [{ top: 0, left: 0 }, { top: 0, left: 432 }, { top: 100, left: 432 }])
  positions.forEach((position, index) => {
    if (index) assert.ok(position.top >= positions[index - 1].top)
    assert.ok(position.top + heights[index] <= height)
    positions.slice(0, index).forEach((earlier, earlierIndex) => {
      if (earlier.left === position.left) assert.ok(position.top >= earlier.top + heights[earlierIndex])
    })
  })
  const single = masonryLayout(heights, 1, 320, 32)
  assert.equal(single.height, heights.reduce((sum, value) => sum + value, 0))
  assert.ok(single.positions.every((position) => position.left === 0))
  assert.deepEqual(masonryLayout([], 2, 400, 32), { positions: [], height: 0 })
  assert.equal(masonryLayout([90], 2, 400, 32).height, 90)
})

test('conversation parts enter below the viewport and fully leave above it, including long and scrolled answers', () => {
  for (const [top, bottom, viewport] of [[120, 220, 800], [300, 2500, 800], [-700, 500, 600], [1200, 1600, 800]]) {
    const travel = conversationTravel(top, bottom, viewport)
    assert.ok(top + travel.entry > viewport)
    assert.ok(bottom + travel.exit < 0)
  }
  for (const parts of [1, 2, 3, 7, 20]) {
    assert.equal(conversationExitDuration(parts), CONVERSATION_MOTION.exitDuration + (parts - 1) * CONVERSATION_MOTION.stagger)
  }
})

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'))
const { threads, tags } = readJson('../src/data/questions.json')
const { items } = readJson('../src/content/locales/zh/questions.json')
const english = readJson('../src/content/locales/en/questions.json')

test('document hashtags normalize whitespace without changing topic identities or technical names', () => {
  for (const [label, expected] of [
    ['CUDA', '#CUDA'], ['resource sharing', '#resource_sharing'],
    ['  GPU   Architecture  ', '#GPU_Architecture'], ['#CUDA', '#CUDA'],
    ['C++', '#C++'], ['C#', '#C#'], ['内存 管理', '#内存_管理'], ['  ', ''],
  ]) assert.equal(formatDocumentTag(label), expected)
  const original = structuredClone(tags)
  for (const label of Object.values(tags)) {
    const formatted = formatDocumentTag(label)
    assert.ok(formatted.startsWith('#'))
    assert.doesNotMatch(formatted, /\s/)
    assert.equal(formatDocumentTag(formatted), formatted)
  }
  assert.deepEqual(tags, original)
})

test('English copy covers every published question and answer without losing rounds or inline code', () => {
  assert.deepEqual(Object.keys(english.items).sort(), threads.map((thread) => thread.id).sort())
  for (const thread of threads) {
    const translated = english.items[thread.id].rounds
    assert.deepEqual(Object.keys(translated), thread.rounds)
    for (const id of thread.rounds) {
      const original = items[thread.id].rounds[id]
      for (const field of ['question', 'answer']) {
        if (!original[field]) continue
        const text = translated[id][field]
        assert.equal(typeof text, 'string', `${thread.id}.${id}.${field}`)
        assert.ok(text.trim(), `${thread.id}.${id}.${field} must not be empty`)
        assert.doesNotMatch(text, /\p{Script=Han}/u)
      }
      const text = `${translated[id].question} ${translated[id].answer ?? ''}`
      const source = `${original.question} ${original.answer ?? ''}`
      for (const [code] of source.matchAll(/`[^`]+`/g)) assert.ok(text.includes(code), `${thread.id}.${id} lost ${code}`)
    }
  }
})

test('language switching selects complete English and Chinese question resources', async () => {
  const i18n = createInstance()
  await i18n.init({
    resources: { en: { questions: english }, zh: { questions: readJson('../src/content/locales/zh/questions.json') } },
    lng: 'zh', fallbackLng: 'en', defaultNS: 'questions',
  })
  for (const language of ['en', 'zh', 'en']) {
    await i18n.changeLanguage(language)
    for (const thread of threads) {
      const copy = i18n.getResource(i18n.resolvedLanguage, 'questions', `items.${thread.id}`)
      assert.deepEqual(copy.rounds, (language === 'en' ? english.items : items)[thread.id].rounds)
      for (const id of thread.rounds) {
        assert.equal(i18n.t(`items.${thread.id}.rounds.${id}.question`), copy.rounds[id].question)
        assert.equal(i18n.t(`items.${thread.id}.rounds.${id}.answer`), copy.rounds[id].answer)
      }
    }
  }
})
test('question image references resolve to existing assets with reserved dimensions and accessible labels', () => {
  for (const thread of threads) {
    for (const [round, references] of Object.entries(thread.questionImages ?? {})) {
      assert.ok(thread.rounds.includes(round))
      const images = questionRoundImages(thread, round)
      assert.equal(images.length, references.length)
      assert.equal(new Set(images.map((image) => image.src)).size, images.length)
      for (const image of images) {
        assert.ok(image.width > 0 && image.height > 0)
        assert.ok(readFileSync(new URL(`../public${image.src}`, import.meta.url)).length)
        const locale = readJson(`../src/content/locales/zh/${image.namespace === 'projects' ? 'projects' : 'course-projects'}.json`)
        assert.equal(typeof image.altKey.split('.').reduce((value, key) => value?.[key], locale), 'string')
      }
    }
  }
  assert.equal(resolveQuestionImage({ module: 'course-projects', id: 'missing', imageKey: 'missing' }), undefined)
  assert.equal(resolveQuestionImage({ module: 'course-projects', id: 'parallel-programming-2026', imageKey: 'missing' }), undefined)
})

test('image bubbles extend the staggered exit lifetime without changing question round counts', () => {
  const thread = threads.find((item) => item.id === 'gpu-memory-hierarchy')
  assert.equal(thread.rounds.length, 2)
  const [image] = questionRoundImages(thread, 'opening')
  assert.equal(image.altKey, 'items.parallel-programming-2026.images.ncuSharedMemory8192')
  assert.equal(image.brightness, 'high')
  assert.deepEqual(questionRoundImages(thread, 'follow-up-one'), [])
  const withoutImages = { ...thread, questionImages: undefined }
  assert.equal(questionConversationPartCount(thread), questionConversationPartCount(withoutImages) + 1)
  assert.equal(conversationExitDuration(questionConversationPartCount(thread)), 680)
})
const projectIds = (module) => [...readFileSync(new URL(`../src/data/${module}.ts`, import.meta.url), 'utf8')
  .matchAll(/^\s+id: "([^"]+)"/gm)].map((match) => `${module}:${match[1]}`)

test('all published threads have readable rounds and valid, unambiguous references', () => {
  const targets = new Set([
    ...projectIds('projects'),
    ...projectIds('course-projects'),
  ])
  assert.equal(new Set(threads.map((q) => q.id)).size, threads.length)
  for (const thread of threads) {
    assert.ok(thread.rounds.length)
    assert.equal(new Set(thread.rounds).size, thread.rounds.length)
    assert.equal(new Set(thread.tagIds).size, thread.tagIds.length)
    for (const round of thread.rounds) assert.ok(items[thread.id].rounds[round].question.trim())
    for (const id of thread.tagIds) assert.match(tags[id], /^[\x20-\x7e]+$/)
    assert.equal(new Set(thread.relatedProjects.map(questionProjectKey)).size, thread.relatedProjects.length)
    for (const project of thread.relatedProjects) assert.ok(targets.has(questionProjectKey(project)))
  }
})

test('tag filtering uses OR, intersects project scope, and retains unlinked threads', () => {
  const sample = [
    { id: 'general', tagIds: ['cuda'], relatedProjects: [] },
    { id: 'project', tagIds: ['engineering'], relatedProjects: [{ module: 'projects', id: 'same' }] },
    { id: 'course', tagIds: ['cuda'], relatedProjects: [{ module: 'course-projects', id: 'same' }] },
  ]
  assert.deepEqual(filterQuestions(sample), sample)
  assert.deepEqual(filterQuestions(sample, ['cuda', 'engineering']), sample)
  assert.deepEqual(filterQuestions(sample, ['cuda']).map((q) => q.id), ['general', 'course'])
  assert.deepEqual(filterQuestions(sample, ['cuda'], 'projects:same'), [])
  assert.deepEqual(filterQuestions(sample, ['cuda'], 'course-projects:same').map((q) => q.id), ['course'])
  assert.deepEqual(filterQuestions(sample, ['missing']), [])
  const unlinked = threads.find((q) => q.id === 'deep-thinking')
  assert.deepEqual(unlinked.relatedProjects, [])
  assert.ok(filterQuestions(threads, unlinked.tagIds).includes(unlinked))
})

test('tag selection starts with all, isolates the first click, supports multiple topics, and resets after clearing', () => {
  const available = ['cuda', 'engineering', 'memory']
  let selected = normalizeQuestionTags([], available)
  assert.deepEqual(selected, [])
  assert.deepEqual(filterQuestions(threads, selected), threads)
  selected = toggleQuestionTag(selected, 'cuda', available)
  assert.deepEqual(selected, ['cuda'])
  assert.ok(filterQuestions(threads, selected).every((thread) => thread.tagIds.includes('cuda')))
  selected = toggleQuestionTag(selected, 'engineering', available)
  assert.deepEqual(selected, ['cuda', 'engineering'])
  selected = toggleQuestionTag(selected, 'cuda', available)
  assert.deepEqual(selected, ['engineering'])
  selected = toggleQuestionTag(selected, 'engineering', available)
  assert.deepEqual(selected, [])
  assert.deepEqual(filterQuestions(threads, selected), threads)
  assert.deepEqual(normalizeQuestionTags(['cuda', 'cuda', 'unknown'], available), ['cuda'])
  assert.deepEqual(normalizeQuestionTags(['unknown'], available), [])
  assert.deepEqual(normalizeQuestionTags(available, available), [])
  assert.deepEqual(toggleQuestionTag(available, 'cuda', available), ['cuda'])
  assert.deepEqual(toggleQuestionTag(['cuda'], 'unknown', available), ['cuda'])
  assert.deepEqual(normalizeQuestionTags([], []), [])
})

test('project pagination exposes every related question once, three per page, with bounded navigation', () => {
  const keys = new Set(threads.flatMap((thread) => thread.relatedProjects.map(questionProjectKey)))
  for (const key of keys) {
    const related = filterQuestions(threads, [], key).reverse()
    const snapshot = [...related]
    const { pageCount } = relatedQuestionPage(related, 0)
    const pages = Array.from({ length: pageCount }, (_, page) => relatedQuestionPage(related, page))
    assert.deepEqual(pages.flatMap((page) => page.items), related)
    assert.ok(pages.every((page) => page.items.length >= 1 && page.items.length <= 3))
    assert.ok(pages.slice(0, -1).every((page) => page.items.length === 3))
    assert.equal(relatedQuestionPage(related, -1).pageIndex, 0)
    assert.equal(relatedQuestionPage(related, pageCount).pageIndex, pageCount - 1)
    assert.deepEqual(related, snapshot)
  }
  assert.deepEqual(relatedQuestionPage([], 9), { items: [], pageIndex: 0, pageCount: 0 })
  assert.equal(relatedQuestionPage([threads[0]], 5).pageCount, 1)
})

function assertWall(wall) {
  assert.ok(wall.cards.length <= wall.capacity && wall.cards.length <= 18)
  assert.equal(new Set(wall.cards.map((card) => card.id)).size, wall.cards.length)
  for (const card of wall.cards) {
    assert.ok(card.x >= 0 && card.y >= 0)
    assert.ok(card.x + card.width <= wall.width + 0.01)
    assert.ok(card.y + card.height <= wall.height + 0.01)
  }
}

test('resume question order varies without duplicates or changing canonical insertion order', () => {
  const original = [...threads]
  const first = shuffleQuestions(threads, () => .1)
  const second = shuffleQuestions(threads, () => .9)
  assert.notDeepEqual(first, second)
  assert.deepEqual(new Set(first), new Set(threads))
  assert.deepEqual(threads, original)
  assert.deepEqual(shuffleQuestions([]), [])
  assert.deepEqual(shuffleQuestions([threads[0]]), [threads[0]])
  const ids = threads.map((thread) => thread.id)
  const wallA = createWall(ids, 1000, 420, 123)
  const wallB = createWall(ids, 1000, 420, 456)
  assert.notDeepEqual(wallA.cards.map((card) => card.id), wallB.cards.map((card) => card.id))
  assert.notDeepEqual(wallA.queue, ids)
  assert.deepEqual(ids, threads.map((thread) => thread.id))
})

test('long-running rotation stays bounded and eventually shows every topic at all viewport sizes', () => {
  const ids = threads.map((q) => q.id)
  for (const [width, height] of [[280, 464], [650, 440], [1000, 420], [1800, 608]]) {
    let wall = createWall(ids, width, height, 726)
    const seen = new Set(wall.cards.map((c) => c.id))
    for (let step = 0; step < 500; step++) {
      const before = JSON.stringify(wall)
      const next = advanceWall(wall)
      assert.equal(JSON.stringify(wall), before, 'React updater must not mutate prior state')
      wall = next
      assertWall(wall)
      wall.cards.forEach((card) => seen.add(card.id))
      if (step === ids.length) assert.equal(seen.size, ids.length, 'no topic starvation')
    }
    wall = resizeWall(wall, 280, 380)
    assertWall(wall)
    wall = resizeWall(wall, 1200, 460)
    assertWall(wall)
  }
})

test('empty and small collections never create duplicate filler questions', () => {
  assert.deepEqual(createWall([], 320, 400).cards, [])
  for (const count of [1, 2, 3]) {
    const ids = Array.from({ length: count }, (_, i) => `topic-${i}`)
    const wall = createWall(ids, 320, 400)
    assert.equal(wall.cards.length, count)
    assert.equal(advanceWall(wall), wall)
    assertWall(wall)
  }
})

// Supply deterministic text metrics; production supplies measurements from the rendered rich text.
function measureText(text, metrics = { paddingInline: 12, paddingBlock: 8, lineHeight: 1.4 }) {
  return (fontSize, width) => {
    const lines = text.split('\n').map((line) => [...line].reduce((sum, char) => sum + (/\p{Script=Han}/u.test(char) ? 1 : .55), 0))
    const naturalWidth = Math.max(...lines) * fontSize + metrics.paddingInline
    const actualWidth = width ?? naturalWidth
    const rows = lines.reduce((sum, units) => sum + Math.max(1, Math.ceil(units * fontSize / Math.max(1, actualWidth - metrics.paddingInline))), 0)
    return { width: actualWidth, height: rows * fontSize * metrics.lineHeight + metrics.paddingBlock }
  }
}

test('short questions remain one line, longer text uses complete measured height and reduced type', () => {
  const short = measureText('什么是内存？')
  const shortLayout = fitQuestionText(1000, 420, short)
  assert.equal(shortLayout.height, Math.ceil(short(shortLayout.fontSize).height))
  assert.equal(shortLayout.width, Math.ceil(short(shortLayout.fontSize).width))
  const long = measureText('为什么虚拟内存需要地址转换，它与分页、分段和内存保护有什么关系？'.repeat(3))
  const longLayout = fitQuestionText(1000, 420, long)
  assert.ok(longLayout.fontSize < shortLayout.fontSize)
  assert.equal(longLayout.height, Math.ceil(long(longLayout.fontSize, longLayout.width).height))
  assert.ok(longLayout.width / longLayout.height > 2)
  assert.ok(longLayout.width / longLayout.height < 4.5)
})

test('bubble padding preserves short single-line questions and complete long text measurements', () => {
  for (const [width, paddingInline, paddingBlock] of [[320, 32, 27.2], [1000, 40, 32]]) {
    const metrics = { paddingInline, paddingBlock, lineHeight: 1.65 }
    const short = measureText('什么是内存？', metrics)
    const shortLayout = fitQuestionText(width, 440, short, metrics)
    assert.equal(shortLayout.width, Math.ceil(short(shortLayout.fontSize).width))
    assert.equal(shortLayout.height, Math.ceil(shortLayout.fontSize * metrics.lineHeight + paddingBlock))
    const long = measureText('为什么虚拟内存需要地址转换，它与分页、分段和内存保护有什么关系？'.repeat(3), metrics)
    const longLayout = fitQuestionText(width, 440, long, metrics)
    assert.ok(longLayout.width <= width - 16)
    assert.equal(longLayout.height, Math.ceil(long(longLayout.fontSize, longLayout.width).height))
  }
})

test('all question titles get measured boxes across viewport sizes, including explicit breaks and long code', () => {
  const texts = [...threads.flatMap((thread) => [items, english.items].map((locale) => locale[thread.id].rounds[thread.rounds[0]].question)), '第一行\n第二行\n第三行', 'derived__memory_l1_wavefronts_shared_excessive'.repeat(4)]
  for (const [width, height] of [[280, 464], [650, 440], [1000, 420], [1800, 608]]) {
    const layouts = Object.fromEntries(texts.map((text, index) => {
      const measure = measureText(text)
      const layout = fitQuestionText(width, height, measure)
      assert.ok(layout.width <= width)
      assert.equal(layout.height, Math.ceil(measure(layout.fontSize, layout.width).height))
      return [String(index), layout]
    }))
    let wall = createWall(Object.keys(layouts), width, height, 23, layouts)
    for (let index = 0; index < texts.length * 2; index++) {
      assertWall(wall)
      for (const card of wall.cards) assert.equal(card.height, layouts[card.id].height)
      wall = advanceWall(wall)
    }
    const firstId = wall.cards.at(-1).id
    const updated = { ...layouts, [firstId]: { ...layouts[firstId], height: layouts[firstId].height + 1 } }
    const resized = resizeWall(wall, width, height, updated)
    assert.equal(resized.cards.find((card) => card.id === firstId).height, updated[firstId].height)
  }
})

test('each incoming question retains one inert exit layer and preserves existing text layout', () => {
  const initial = createWall(threads.map((thread) => thread.id), 1000, 420, 73)
  const snapshot = JSON.stringify(initial)
  const next = advanceWall(initial)
  assert.equal(JSON.stringify(initial), snapshot)
  assert.equal(next.retiring, initial.cards[0])
  assert.equal(next.incomingId, next.cards.at(-1).id)
  assert.ok(!next.cards.some((card) => card.id === next.retiring.id))
  for (const card of initial.cards.slice(1)) assert.equal(next.cards.find((item) => item.id === card.id), card)
  assert.ok(next.cards.length + 1 <= next.capacity + 1)
  const resized = resizeWall(next, 800, 400)
  assert.equal(resized.retiring, undefined)
  assert.equal(resized.incomingId, undefined)
})

test('depth retreats monotonically toward the center and fades to zero without altering typography', () => {
  const card = { id: 'example', x: 40, y: 30, width: 320, height: 110, fontSize: 20 }
  const snapshot = JSON.stringify(card)
  assert.equal(QUESTION_WALL_MOTION.durationMs, 1000)
  assert.ok(QUESTION_WALL_MOTION.entryScale > 1)
  for (const count of [4, 10, 18]) {
    let previous = getWallDepth(card, 1000, 420, 0, count)
    assert.equal(previous.opacity, 1)
    assert.equal(previous.scale, 1)
    for (let age = 1; age <= count; age++) {
      const depth = getWallDepth(card, 1000, 420, age, count)
      assert.ok(depth.scale < previous.scale && depth.scale > 0)
      assert.ok(depth.opacity < previous.opacity && depth.opacity >= 0)
      assert.ok(depth.x > previous.x && depth.x < 300)
      assert.ok(depth.y > previous.y && depth.y < 125)
      previous = depth
    }
    assert.equal(previous.opacity, 0)
  }
  assert.equal(JSON.stringify(card), snapshot)
})

test('perspective pullback preserves the coupling of each box corner and its center at fractional ages', () => {
  for (const [x, y] of [[30, 20], [620, 300], [340, 155]]) {
    const card = { id: 'projection', x, y, width: 320, height: 110, fontSize: 20 }
    const center = { x: 500, y: 210 }
    const boxCenter = { x: x + card.width / 2, y: y + card.height / 2 }
    for (const age of [0, 3, 10]) {
      for (const progress of [0, .25, .5, .75, 1]) {
        const { scale, x: dx, y: dy } = getWallDepth(card, 1000, 420, age + progress, 18)
        for (const corner of [{ x, y }, { x: x + card.width, y: y + card.height }]) {
          const projectedX = boxCenter.x + dx + (corner.x - boxCenter.x) * scale
          const projectedY = boxCenter.y + dy + (corner.y - boxCenter.y) * scale
          assert.ok(Math.abs(projectedX - (center.x + (corner.x - center.x) * scale)) < 1e-9)
          assert.ok(Math.abs(projectedY - (center.y + (corner.y - center.y) * scale)) < 1e-9)
        }
      }
    }
  }
})

test('different scene depths create parallax and retreat follows perspective division rather than exponential shrinking', () => {
  const base = { id: 'depth', width: 320, height: 110, fontSize: 20 }
  const near = { ...base, x: 0, y: 155 }
  const far = { ...base, x: 340, y: 155 }
  const nearStep = getWallDepth(near, 1000, 420, 1, 18).scale
  const farStep = getWallDepth(far, 1000, 420, 1, 18).scale
  assert.ok(nearStep < farStep)
  for (const card of [near, far]) {
    const first = getWallDepth(card, 1000, 420, 1, 18).scale
    const second = getWallDepth(card, 1000, 420, 2, 18).scale
    // Equal camera distances add in reciprocal scale; each later step contracts less.
    assert.ok(Math.abs(1 / second - (2 / first - 1)) < 1e-12)
    assert.ok(second / first > first)
    const halfway = getWallDepth(card, 1000, 420, .5, 18).scale
    assert.ok(Math.abs(1 / halfway - (1 + 1 / first) / 2) < 1e-12)
    assert.ok(Math.abs(halfway - (1 + first) / 2) > .0001)
  }
})

test('native animation samples preserve perspective with subpixel interpolation error and fade the exit completely', () => {
  const card = { id: 'frames', x: 0, y: 0, width: 320, height: 110, fontSize: 20 }
  for (const age of [0, 3, 17]) {
    const frames = getWallMotionFrames(card, 1000, 420, age, age + 1, 18)
    assert.equal(frames[0].offset, 0)
    assert.equal(frames.at(-1).offset, 1)
    assert.ok(frames.length <= 20)
    for (let i = 0; i < frames.length - 1; i++) {
      const scaleOf = (frame) => Number(frame.transform.match(/scale\(([^)]+)\)/)[1])
      const interpolated = (scaleOf(frames[i]) + scaleOf(frames[i + 1])) / 2
      const progress = (frames[i].offset + frames[i + 1].offset) / 2
      const actual = getWallDepth(card, 1000, 420, age + progress, 18)
      assert.ok(Math.abs(interpolated - actual.scale) * 500 < .01)
      assert.deepEqual(Object.keys(frames[i]).sort(), ['offset', 'opacity', 'transform'])
    }
    if (age === 17) assert.equal(frames.at(-1).opacity, 0)
  }
})

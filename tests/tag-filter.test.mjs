import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { createInstance } from 'i18next'
import { projects } from '../src/data/projects.ts'
import { courseProjects } from '../src/data/course-projects.ts'
import { filterByTags, normalizeTagSelection, tagSearchParams, tagsByFrequency, toggleTagSelection } from '../src/lib/tag-filter.ts'
import { courseTagGroups, courseTagSearchParams, courseTagSelection, filterCourseProjects, toggleCourseTimeTag } from '../src/lib/course-project-filter.ts'

test('selection isolates the first tag, supports OR, and returns to all after clearing or selecting every tag', () => {
  const available = ['CUDA', 'Go', 'React']
  let selected = toggleTagSelection([], 'CUDA', available)
  assert.deepEqual(selected, ['CUDA'])
  selected = toggleTagSelection(selected, 'Go', available)
  assert.deepEqual(selected, ['CUDA', 'Go'])
  assert.deepEqual(toggleTagSelection(selected, 'React', available), [])
  selected = toggleTagSelection(selected, 'CUDA', available)
  assert.deepEqual(selected, ['Go'])
  assert.deepEqual(toggleTagSelection(selected, 'Go', available), [])
  assert.deepEqual(toggleTagSelection(selected, 'unknown', available), selected)
  assert.deepEqual(normalizeTagSelection([], []), [])
})

test('filtering takes the union of selected tags without duplicates, mutation or reordering', () => {
  const sample = [
    { id: 'first', tags: ['Go', 'React'] },
    { id: 'second', tags: ['CUDA'] },
    { id: 'third', tags: ['Go'] },
    { id: 'fourth', tags: [] },
  ]
  const snapshot = structuredClone(sample)
  assert.deepEqual(filterByTags(sample, []), sample)
  assert.deepEqual(filterByTags(sample, ['Go', 'CUDA']).map((item) => item.id), ['first', 'second', 'third'])
  assert.deepEqual(filterByTags(sample, ['Go', 'React']).map((item) => item.id), ['first', 'third'])
  assert.deepEqual(filterByTags(sample, ['unknown']), [])
  assert.deepEqual(sample, snapshot)
})

test('frequency counts entries once and keeps first appearance for equal frequencies', () => {
  assert.deepEqual(tagsByFrequency([
    { tags: ['rare-first', 'common', 'duplicate', 'duplicate'] },
    { tags: ['common', 'duplicate', 'rare-last'] },
    { tags: ['common'] },
  ]), ['common', 'duplicate', 'rare-first', 'rare-last'])
  assert.deepEqual(tagsByFrequency([]), [])
})

test('URL updates round-trip canonical spaces and Chinese tags while retaining other parameters', () => {
  const available = ['CUDA', 'Jupyter Notebook', '研一下', '2026春']
  const params = new URLSearchParams('tag=CUDA&tag=CUDA&tag=missing&keep=one&keep=two')
  assert.deepEqual(normalizeTagSelection(params.getAll('tag'), available), ['CUDA'])
  const updated = tagSearchParams(params, ['Jupyter Notebook', '研一下', '2026春', '研一下', 'missing'], available)
  const restored = new URLSearchParams(updated.toString())
  assert.deepEqual(restored.getAll('tag'), ['Jupyter Notebook', '研一下', '2026春'])
  assert.deepEqual(restored.getAll('keep'), ['one', 'two'])
  assert.equal(params.toString(), 'tag=CUDA&tag=CUDA&tag=missing&keep=one&keep=two')
  assert.deepEqual(tagSearchParams(restored, [], available).getAll('tag'), [])
  assert.deepEqual(tagSearchParams(restored, available, available).getAll('tag'), [])
  assert.deepEqual(normalizeTagSelection(['unknown'], available), [])
})

test('both real catalogs expose every existing tag and return exactly its canonical matching entries', () => {
  for (const catalog of [projects, courseProjects]) {
    const snapshot = structuredClone(catalog)
    const available = tagsByFrequency(catalog)
    assert.deepEqual(new Set(available), new Set(catalog.flatMap((item) => item.tags)))
    assert.deepEqual(filterByTags(catalog, []), catalog)
    for (const tag of available) {
      const selected = toggleTagSelection([], tag, available)
      assert.deepEqual(filterByTags(catalog, selected), catalog.filter((item) => item.tags.includes(tag)))
    }
    assert.deepEqual(catalog, snapshot)
  }
  assert.deepEqual(normalizeTagSelection(['2026春', 'Go'], tagsByFrequency(projects)), ['Go'])
  assert.deepEqual(normalizeTagSelection(['2026春', 'Ascend NPU'], tagsByFrequency(courseProjects)), ['2026春'])
})

test('course grade and semester labels translate without changing canonical filter values', async () => {
  const available = tagsByFrequency(courseProjects)
  for (const language of ['zh', 'en']) {
    const common = JSON.parse(readFileSync(new URL(`../src/content/locales/${language}/common.json`, import.meta.url)))
    const course = JSON.parse(readFileSync(new URL(`../src/content/locales/${language}/course-projects.json`, import.meta.url)))
    const i18n = createInstance()
    await i18n.init({ lng: language, resources: { [language]: { common, courseProjects: course } } })
    for (const item of courseProjects) {
      for (const tag of item.tags.slice(0, 2)) {
        assert.ok(i18n.exists(`semesterTags.${tag}`, { ns: 'courseProjects' }))
        assert.ok(filterByTags(courseProjects, normalizeTagSelection([tag], available)).includes(item))
      }
    }
    for (const key of ['label', 'reset', 'empty', 'emptyHint']) assert.ok(i18n.exists(`tagFilter.${key}`, { ns: 'common' }))
  }
})

test('coursework separates paired time tags from frequency-ordered technical tags', () => {
  const groups = courseTagGroups(courseProjects)
  assert.deepEqual(groups.timePairs, [...new Map(courseProjects.map(({ tags }) => [tags[1], tags.slice(0, 2)])).values()])
  assert.deepEqual(groups.technicalTags, tagsByFrequency(courseProjects.map(({ tags }) => ({ tags: tags.slice(2) }))))
  assert.ok(groups.timePairs.every((pair) => pair.every((tag) => !groups.technicalTags.includes(tag))))
  for (const item of courseProjects) {
    assert.deepEqual(groups.timePairs.find((pair) => pair[1] === item.tags[1]), item.tags.slice(0, 2))
  }
})

test('either time label selects and clears the entire pair while preserving technology selection', () => {
  const groups = courseTagGroups(courseProjects)
  const selected = toggleCourseTimeTag(['CUDA'], '研一下', groups)
  assert.deepEqual(selected, ['研一下', '2026春', 'CUDA'])
  assert.deepEqual(toggleCourseTimeTag(selected, '2026春', groups), ['CUDA'])
  const multiple = toggleCourseTimeTag(selected, '2025秋', groups)
  assert.deepEqual(multiple, ['研一下', '2026春', '研一上', '2025秋', 'CUDA'])
  assert.deepEqual(courseTagSelection(['2026春', 'unknown', '2026春', 'CUDA'], groups).tags, selected)
  assert.deepEqual(courseTagSelection(['研一下', 'CUDA'], groups).tags, selected)
  assert.deepEqual(toggleCourseTimeTag(selected, 'unknown', groups), selected)
})

test('time and technology groups intersect, with OR selection inside each group and canonical result order', () => {
  const groups = courseTagGroups(courseProjects)
  assert.deepEqual(filterCourseProjects(courseProjects, [], groups), courseProjects)
  for (const selection of [['CUDA'], ['2026春'], ['2026春', 'CUDA'], ['研一下', '2025秋', 'CUDA', 'Machine Learning']]) {
    const state = courseTagSelection(selection, groups)
    const expected = courseProjects.filter(({ tags }) =>
      (!state.semesters.length || state.semesters.includes(tags[1])) &&
      (!state.technicalTags.length || state.technicalTags.some((tag) => tags.slice(2).includes(tag))))
    assert.deepEqual(filterCourseProjects(courseProjects, selection, groups), expected)
  }
  assert.deepEqual(filterCourseProjects(courseProjects, ['2022秋', 'CUDA'], groups), [])
})

test('each course filter group resets independently and paired state survives URL round-trip', () => {
  const groups = courseTagGroups(courseProjects)
  const allTimes = groups.timePairs.flat()
  assert.deepEqual(courseTagSelection([...allTimes, 'CUDA'], groups).tags, ['CUDA'])
  assert.deepEqual(courseTagSelection(['2026春', ...groups.technicalTags], groups).tags, ['研一下', '2026春'])
  const initial = new URLSearchParams('tag=研一下&tag=CUDA&keep=yes')
  const paired = courseTagSelection(initial.getAll('tag'), groups).tags
  const restored = new URLSearchParams(courseTagSearchParams(initial, paired, groups).toString())
  assert.deepEqual(courseTagSelection(restored.getAll('tag'), groups).tags, paired)
  assert.equal(restored.get('keep'), 'yes')
  assert.deepEqual(courseTagSelection([], courseTagGroups([])).tags, [])
})

test('course URLs use a single English semester ID per pair and accept old Chinese links', () => {
  const groups = courseTagGroups(courseProjects)
  const params = new URLSearchParams('tag=研一下&tag=2026春&tag=CUDA&keep=yes')
  const updated = courseTagSearchParams(params, params.getAll('tag'), groups)
  assert.equal(updated.toString(), 'keep=yes&tag=spring-2026&tag=CUDA')
  assert.deepEqual(courseTagSelection(updated.getAll('tag'), groups).tags, ['研一下', '2026春', 'CUDA'])
  assert.deepEqual(filterCourseProjects(courseProjects, updated.getAll('tag'), groups), filterCourseProjects(courseProjects, params.getAll('tag'), groups))
  assert.deepEqual(courseTagSearchParams(updated, [], groups).getAll('tag'), [])
  for (const pair of groups.timePairs) {
    const next = courseTagSearchParams(new URLSearchParams(), pair, groups)
    assert.match(next.toString(), /^tag=(spring|summer|fall|winter)-\d{4}$/)
    assert.deepEqual(courseTagSelection(next.getAll('tag'), groups).timeTags, pair)
    for (const oldTag of pair) {
      assert.deepEqual(courseTagSelection([oldTag], groups).tags, pair)
      assert.equal(courseTagSearchParams(new URLSearchParams(), [oldTag], groups).toString(), next.toString())
    }
  }
})

test('English semester URLs preserve group unions, intersection, and normalization', () => {
  const groups = courseTagGroups(courseProjects)
  const selected = ['fall-2025', 'spring-2026', 'spring-2026', 'unknown', 'CUDA', 'Machine Learning']
  const params = courseTagSearchParams(new URLSearchParams('keep=one&keep=two'), selected, groups)
  assert.deepEqual(params.getAll('tag'), ['spring-2026', 'fall-2025', 'CUDA', 'Machine Learning'])
  assert.deepEqual(params.getAll('keep'), ['one', 'two'])
  assert.deepEqual(filterCourseProjects(courseProjects, params.getAll('tag'), groups), filterCourseProjects(courseProjects, ['2025秋', '2026春', 'CUDA', 'Machine Learning'], groups))
  const allTimeIds = groups.timePairs.map((pair) => courseTagSearchParams(new URLSearchParams(), pair, groups).get('tag'))
  assert.deepEqual(courseTagSearchParams(new URLSearchParams(), [...allTimeIds, 'CUDA'], groups).getAll('tag'), ['CUDA'])
})

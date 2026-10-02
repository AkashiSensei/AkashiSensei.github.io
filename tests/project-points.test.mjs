import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { getProjectPointSections, sliceProjectPointSections } from '../src/lib/project-points.ts'

test('Crater previews retain contributions at every responsive cap in both languages', () => {
  for (const lang of ['zh', 'en']) {
    const content = JSON.parse(readFileSync(new URL(`../src/content/locales/${lang}/projects.json`, import.meta.url), 'utf8'))
    const sections = getProjectPointSections(content.items.crater.points)
    const snapshot = structuredClone(sections)
    for (const cap of [1, 2, 3, 4, 5]) {
      const preview = sliceProjectPointSections(sections, cap)
      assert.equal(preview.points.length, cap)
      assert.ok(preview.highlightedIndexes.length >= Math.ceil(cap / 2))
      assert.ok(preview.points.includes(sections.personalWorkPoints[0]))
      for (const index of preview.highlightedIndexes) {
        assert.ok(sections.personalWorkPoints.includes(preview.points[index]))
      }
    }
    assert.deepEqual(sliceProjectPointSections(sections, 5), {
      points: [...sections.projectIntroPoints.slice(0, 2), ...sections.personalWorkPoints.slice(0, 3)],
      highlightedIndexes: [2, 3, 4],
    })
    assert.deepEqual(sliceProjectPointSections(sections, 100), {
      points: sections.points, highlightedIndexes: sections.highlightedIndexes,
    })
    assert.deepEqual(sections, snapshot)
  }
})

test('previews use available space without inventing highlights or dropping short sections', () => {
  const ordinary = getProjectPointSections(['a', 'b', 'c'])
  assert.deepEqual(sliceProjectPointSections(ordinary, 2), { points: ['a', 'b'], highlightedIndexes: [] })
  assert.deepEqual(sliceProjectPointSections(ordinary, 0), { points: [], highlightedIndexes: [] })
  const shortContribution = getProjectPointSections({ projectIntro: ['a', 'b', 'c'], personalWork: ['d'] })
  assert.deepEqual(sliceProjectPointSections(shortContribution, 3), { points: ['a', 'b', 'd'], highlightedIndexes: [2] })
  const onlyContributions = getProjectPointSections({ personalWork: ['a', 'b', 'c'] })
  assert.deepEqual(sliceProjectPointSections(onlyContributions, 2), { points: ['a', 'b'], highlightedIndexes: [0, 1] })
})

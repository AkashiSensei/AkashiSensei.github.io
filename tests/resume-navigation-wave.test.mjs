import assert from "node:assert/strict"
import test from "node:test"

import { closeResumeNavigationWave, getResumeNavigationCloseDuration, getResumeNavigationRowSpacing, getResumeNavigationWaveStep, resumeNavigationWaveTiming } from "../src/lib/resume-navigation-wave.ts"

test("closing propagates from the last selection, even when opening began elsewhere", () => {
  const ids = Array.from({ length: 11 }, (_, index) => `section-${index}`)
  for (const selectedIndex of [0, 5, 10]) {
    const opened = { open: true, closing: false, originId: ids[2], selectedId: ids[selectedIndex] }
    const closed = closeResumeNavigationWave(opened)
    assert.equal(closed.open, false)
    assert.equal(closed.closing, true)
    assert.equal(opened.originId, ids[2])
    const origin = ids.indexOf(closed.originId)
    const steps = ids.map((_, index) => getResumeNavigationWaveStep(index, origin))
    assert.equal(steps[selectedIndex], 0)
    steps.forEach((delay, index) => { if (index !== selectedIndex) assert.ok(delay > 0) })
    assert.equal(closeResumeNavigationWave(closed), closed)
  }
})

test("the closing hold covers the last delayed title from every possible origin", () => {
  for (const count of [10, 11]) {
    for (let origin = 0; origin < count; origin++) {
      const finishTimes = Array.from({ length: count }, (_, index) =>
        getResumeNavigationWaveStep(index, origin) * resumeNavigationWaveTiming.step + resumeNavigationWaveTiming.close)
      assert.equal(getResumeNavigationCloseDuration(count, origin), Math.max(...finishTimes))
    }
  }
  assert.equal(getResumeNavigationCloseDuration(0, -1), 0)
})

test("a center contact reveals paired neighbors together, then progressively farther chapters", () => {
  const order = Array.from({ length: 11 }, (_, index) => getResumeNavigationWaveStep(index, 5))
  assert.equal(order[5], 0)
  for (let distance = 1; distance <= 5; distance++) {
    assert.equal(order[5 - distance], order[5 + distance])
    assert.ok(order[5 + distance] > order[5 + distance - 1])
  }
})

test("contacts at either end propagate toward the opposite end without wrapping", () => {
  for (const count of [10, 11]) {
    for (const origin of [0, count - 1]) {
      const order = Array.from({ length: count }, (_, index) => getResumeNavigationWaveStep(index, origin))
      assert.equal(order[origin], 0)
      assert.equal(order[count - 1 - origin], count - 1)
      assert.equal(new Set(order).size, count)
    }
  }
})

function rowCenters(spacings) {
  let height = 0
  const centers = spacings.map(({ before, after }, index) => {
    height += before
    const center = height + 18
    height += 36 + after + (index < spacings.length - 1 ? 2 : 0)
    return center
  })
  return centers.map((center) => center - height / 2)
}
function rowSpacings(count, selected) {
  return Array.from({ length: count }, (_, index) => getResumeNavigationRowSpacing(index, selected, count))
}

test("the whole rail stays centered for every selection, including the first and last rows", () => {
  for (const count of [1, 2, 10, 11]) {
    for (let selected = -1; selected < count; selected++) {
      const centers = rowCenters(rowSpacings(count, selected))
      assert.equal((centers[0] + centers[count - 1]) / 2, 0)
      for (let index = 1; index < count; index++) {
        const expanded = index === selected || index === selected + 1
        assert.equal(centers[index] - centers[index - 1], expanded ? 44 : 38)
      }
    }
  }
})

test("fast expansion and slow restoration keep the midpoint fixed during selection changes", () => {
  for (const count of [10, 11]) {
    let spacings = rowSpacings(count, -1)
    for (const selected of [5, 6, 7, 2, 0, count - 1, 3, 5, 0, count - 1, 3, -1]) {
      const destination = rowSpacings(count, selected)
      const initial = spacings
      for (const elapsed of (selected % 2 === 0 ? [80, 160] : [80, 160, 320, 400, 480])) {
        spacings = initial.map((spacing, index) => Object.fromEntries(["before", "after"].map((side) => {
          const from = spacing[side]
          const to = destination[index][side]
          const duration = to > from ? 320 : 480
          return [side, from + (to - from) * Math.min(1, elapsed / duration)]
        })))
        const centers = rowCenters(spacings)
        assert.ok(Math.abs((centers[0] + centers[count - 1]) / 2) < 1e-9)
        for (let index = 1; index < count; index++) {
          assert.ok(centers[index] - centers[index - 1] >= 38 - 1e-9)
        }
      }
    }
  }
})

test("closing restores the centered resting layout", () => {
  for (const count of [10, 11]) {
    const spacings = rowSpacings(count, -1)
    assert.ok(spacings.every(({ before, after }) => before === 0 && after === 0))
    const centers = rowCenters(spacings)
    assert.equal(centers.at(-1) - centers[0], (count - 1) * 38)
  }
})

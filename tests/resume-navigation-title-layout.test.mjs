import assert from "node:assert/strict"
import test from "node:test"

import { getResumeNavigationTitleLayouts } from "../src/lib/resume-navigation-title-layout.ts"

const buttons = [100, 138, 188].map((top) => ({ top, bottom: top + 36, right: 60 }))
const rail = { top: 90, bottom: 240 }

test("short titles share the longest title's hit width, with room on both sides", () => {
  const layouts = getResumeNavigationTitleLayouts(buttons, [32, 96, 48], 1000, rail)
  assert.deepEqual(layouts.map(({ width }) => width), [116, 116, 116])
  assert.ok(layouts.every(({ left }) => left === 60))
  const translated = getResumeNavigationTitleLayouts(buttons, [80, 144, 96], 1000, rail)
  assert.ok(translated.every(({ width }) => width === 164))
})

test("neighbor targets meet between centers while text stays aligned with its circle", () => {
  const layouts = getResumeNavigationTitleLayouts(buttons, [32, 96, 48], 1000, rail)
  for (let index = 0; index < layouts.length; index++) {
    const layout = layouts[index]
    assert.equal(layout.top + layout.textCenter, (buttons[index].top + buttons[index].bottom) / 2)
    if (index > 0) assert.equal(layouts[index - 1].top + layouts[index - 1].height, layout.top)
  }
  assert.equal(layouts[0].top, buttons[0].top - 8)
  assert.equal(layouts.at(-1).top + layouts.at(-1).height, buttons.at(-1).bottom + 8)
})

test("clipped rows cannot receive hover, and long titles stay within the viewport", () => {
  const layouts = getResumeNavigationTitleLayouts(buttons, [300, 32, 48], 200, { top: 130, bottom: 210 })
  assert.equal(layouts[0], null)
  for (const layout of layouts.filter(Boolean)) {
    assert.equal(layout.width, 124)
    assert.ok(layout.left + layout.width <= 184)
  }
  assert.deepEqual(getResumeNavigationTitleLayouts([], [], 1000, rail), [])
})

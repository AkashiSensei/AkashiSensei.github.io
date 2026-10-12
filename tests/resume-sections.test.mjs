import assert from "node:assert/strict"
import test from "node:test"
import { getActiveResumeSectionIndex, getResumeSectionScrollY } from "../src/lib/resume-sections.ts"

test("long chapters remain current until the next chapter reaches the reading line", () => {
  const tops = [0, 800, 2600, 3500]
  assert.equal(getActiveResumeSectionIndex(tops, 800, 800), 1)
  assert.equal(getActiveResumeSectionIndex(tops, 2300, 800), 1)
  assert.equal(getActiveResumeSectionIndex(tops, 2480, 800), 2)
})

test("tracking follows scrolling backwards and keeps the final chapter current in the footer", () => {
  const tops = [0, 800, 2600, 3500]
  assert.equal(getActiveResumeSectionIndex(tops, 4100, 800), 3)
  assert.equal(getActiveResumeSectionIndex(tops, 2800, 800), 2)
  assert.equal(getActiveResumeSectionIndex(tops, 700, 800), 1)
  assert.equal(getActiveResumeSectionIndex(tops, 0, 800), 0)
})

test("short viewports use a proportionate reading line and empty content has no active section", () => {
  assert.equal(getActiveResumeSectionIndex([0, 400], 300, 400), 0)
  assert.equal(getActiveResumeSectionIndex([0, 400], 320, 400), 1)
  assert.equal(getActiveResumeSectionIndex([], 0, 800), -1)
})

test("jump targets remeasure position and account for responsive navbar clearance", () => {
  const previousWindow = globalThis.window
  let margin = "96px"
  let top = 500
  globalThis.window = { scrollY: 200, getComputedStyle: () => ({ scrollMarginTop: margin }) }
  const section = { getBoundingClientRect: () => ({ top }) }
  try {
    assert.equal(getResumeSectionScrollY(section), 604)
    margin = "0px"
    assert.equal(getResumeSectionScrollY(section), 700)
    margin = "16px"
    top = 750
    assert.equal(getResumeSectionScrollY(section), 934)
    top = -195
    assert.equal(getResumeSectionScrollY(section), 0)
  } finally {
    if (previousWindow === undefined) delete globalThis.window
    else globalThis.window = previousWindow
  }
})

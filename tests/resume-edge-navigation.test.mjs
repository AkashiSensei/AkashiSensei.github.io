import assert from "node:assert/strict"
import test from "node:test"

import { createResumeEdgeState, getNextResumeEdgeState, resumeEdgeTiming } from "../src/lib/resume-edge-navigation.ts"

const defaults = {
  viewportWidth: 1200, travelDistance: 30, now: 0, enabled: true,
  keyboardFocused: false, overTitle: false, titlesVisible: false, pressed: false,
}
function step(previous, pointer, now = 0, overrides = {}) {
  return getNextResumeEdgeState(previous, { ...defaults, pointer, now, ...overrides })
}
function open() {
  return step(createResumeEdgeState(), { x: 100, y: 400 }).state
}

test("resting and pointers outside the left third leave the rail at its resting position", () => {
  for (const pointer of [null, { x: 400, y: 400 }, { x: 500, y: 400 }, { x: -1, y: 400 }]) {
    const result = step(createResumeEdgeState(), pointer)
    assert.equal(result.state.phase, "hidden")
    assert.equal(result.state.reveal, 0)
    assert.equal(result.deadline, null)
  }
})

test("the middle band progressively peeks by at most 3px and never becomes ready from waiting", () => {
  const reveals = [399, 350, 300, 250, 201].map((x) => {
    const result = step(createResumeEdgeState(), { x, y: 400 }, 10000)
    assert.equal(result.state.phase, "peeking")
    assert.equal(result.deadline, null)
    assert.ok(result.state.reveal * defaults.travelDistance <= 3)
    assert.ok(result.state.reveal < 1)
    return result.state.reveal
  })
  reveals.forEach((reveal, index) => { if (index > 0) assert.ok(reveal > reveals[index - 1]) })
  const preview = step(createResumeEdgeState(), { x: 250, y: 400 })
  assert.equal(step(preview.state, { x: 250, y: 400 }, 60000).state.phase, "peeking")
})

test("entering the left sixth is immediately ready at any vertical position", () => {
  for (const x of [0, 100, 200]) {
    for (const y of [0, 50, 400, 900]) {
      const ready = step(createResumeEdgeState(), { x, y })
      assert.equal(ready.state.phase, "ready")
      assert.equal(ready.state.reveal, 1)
      assert.equal(ready.deadline, null)
    }
  }
})

test("both horizontal boundaries scale with viewport width", () => {
  for (const viewportWidth of [768, 1200, 1920, 3840]) {
    const ready = step(createResumeEdgeState(), { x: viewportWidth / 6, y: 400 }, 0, { viewportWidth })
    const peek = step(createResumeEdgeState(), { x: viewportWidth / 6 + 1, y: 400 }, 0, { viewportWidth })
    const resting = step(createResumeEdgeState(), { x: viewportWidth / 3, y: 400 }, 0, { viewportWidth })
    assert.equal(ready.state.phase, "ready")
    assert.equal(peek.state.phase, "peeking")
    assert.equal(resting.state.phase, "hidden")
  }
})

test("wide gutters do not enlarge the tentative movement", () => {
  for (const travelDistance of [25, 30, 57]) {
    const result = step(createResumeEdgeState(), { x: 201, y: 400 }, 0, { travelDistance })
    assert.ok(result.state.reveal * travelDistance <= 3)
  }
})

test("hovering a portaled title retains ready navigation beyond the left sixth", () => {
  const ready = step(open(), { x: 280, y: 400 }, 200, { overTitle: true })
  assert.equal(ready.state.phase, "ready")
  assert.equal(ready.deadline, null)
})

test("visible or closing titles lock the rail ready until the final title finishes", () => {
  let state = open()
  for (const now of [300, 540, 1000]) {
    const locked = step(state, { x: 500, y: 400 }, now, { titlesVisible: true })
    assert.equal(locked.state.phase, "ready")
    assert.equal(locked.state.reveal, 1)
    assert.equal(locked.deadline, null)
    state = locked.state
  }
  const released = step(state, { x: 500, y: 400 }, 1001)
  assert.equal(released.state.phase, "hidden")
  assert.equal(released.deadline, null)
})

test("returning during the text lock preserves ready after the text finishes", () => {
  const locked = step(open(), null, 300, { titlesVisible: true })
  const returned = step(locked.state, { x: 100, y: 400 }, 800, { titlesVisible: true })
  assert.equal(returned.state.leaveSince, null)
  assert.equal(step(returned.state, { x: 100, y: 400 }, 900).state.phase, "ready")
})

test("a brief departure is tolerated; returning cancels it; staying in the middle band settles to peek", () => {
  const leaving = step(open(), { x: 300, y: 400 }, 300)
  assert.equal(leaving.deadline, 300 + resumeEdgeTiming.leave)
  assert.equal(step(leaving.state, { x: 300, y: 400 }, leaving.deadline - 1).state.reveal, 1)
  const returned = step(leaving.state, { x: 100, y: 400 }, 350)
  assert.equal(returned.state.leaveSince, null)
  assert.equal(returned.deadline, null)
  const retracted = step(leaving.state, { x: 300, y: 400 }, leaving.deadline)
  assert.equal(retracted.state.phase, "peeking")
  assert.ok(retracted.state.reveal > 0 && retracted.state.reveal < 1)
})

test("leaving the window or the left third settles to the resting position", () => {
  for (const pointer of [null, { x: 500, y: 400 }]) {
    const leaving = step(open(), pointer, 300)
    assert.equal(step(leaving.state, pointer, leaving.deadline).state.reveal, 0)
  }
})

test("keyboard, coarse pointers, mobile, and reduced motion bypass the bands", () => {
  for (const overrides of [{ keyboardFocused: true }, { enabled: false }]) {
    const result = step(createResumeEdgeState(), null, 0, overrides)
    assert.equal(result.state.phase, "ready")
    assert.equal(result.state.reveal, 1)
    assert.equal(result.deadline, null)
  }
})

test("an exposed button stays still between pointerdown and click, including a switch to touch", () => {
  const peeking = step(createResumeEdgeState(), { x: 300, y: 400 }).state
  for (const overrides of [{ pressed: true }, { pressed: true, enabled: false }]) {
    const result = step(peeking, { x: 100, y: 400 }, 1000, overrides)
    assert.equal(result.state, peeking)
    assert.equal(result.deadline, null)
  }
})

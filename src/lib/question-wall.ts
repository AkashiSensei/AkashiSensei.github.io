import type { QuestionTextLayout } from "./question-text-layout.ts"

export type WallCard = QuestionTextLayout & { id: string; x: number; y: number }
export type WallState = {
  cards: WallCard[]
  queue: string[]
  cursor: number
  seed: number
  width: number
  height: number
  capacity: number
  layouts: Record<string, QuestionTextLayout>
  retiring?: WallCard
  incomingId?: string
}

function random(state: WallState) {
  state.seed = (Math.imul(state.seed, 1664525) + 1013904223) >>> 0
  return state.seed / 4294967296
}

function shuffle(state: WallState) {
  for (let i = state.queue.length - 1; i > 0; i--) {
    const j = Math.floor(random(state) * (i + 1))
    ;[state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]]
  }
}

function nextId(state: WallState) {
  for (let attempt = 0; attempt < state.queue.length * 2; attempt++) {
    if (state.cursor >= state.queue.length) {
      shuffle(state)
      state.cursor = 0
    }
    const id = state.queue[state.cursor++]
    if (state.retiring?.id !== id && !state.cards.some((card) => card.id === id)) return id
  }
  return undefined
}

function place(state: WallState, id: string) {
  const layout = state.layouts[id] ?? { width: Math.min(360, state.width), height: Math.min(148, state.height), fontSize: 20 }
  const { width, height, fontSize } = layout
  let best: WallCard = { id, x: 0, y: 0, width, height, fontSize }
  let bestScore = Infinity
  for (let attempt = 0; attempt < 40; attempt++) {
    const candidate = { id, width, height, fontSize, x: random(state) * Math.max(0, state.width - width), y: random(state) * Math.max(0, state.height - height) }
    const score = state.cards.reduce((sum, other) => {
      const intersection = Math.max(0, Math.min(candidate.x + width, other.x + other.width) - Math.max(candidate.x, other.x)) *
        Math.max(0, Math.min(candidate.y + height, other.y + other.height) - Math.max(candidate.y, other.y))
      const overlap = intersection / Math.min(width * height, other.width * other.height)
      return sum + overlap * overlap + (overlap > 0.7 ? 10 : 0)
    }, 0)
    if (score < bestScore) { best = candidate; bestScore = score }
  }
  return best
}

export function createWall(ids: string[], width: number, height: number, seed = 42, layouts: Record<string, QuestionTextLayout> = {}): WallState {
  const sizes = Object.values(layouts)
  const averageArea = sizes.length ? sizes.reduce((sum, size) => sum + size.width * size.height, 0) / sizes.length : Math.min(294, Math.max(172, width * .33)) * 132
  const state: WallState = {
    cards: [], queue: [...new Set(ids)], cursor: 0, seed, layouts,
    width: Math.max(1, width), height: Math.max(1, height),
    capacity: Math.min(ids.length, 18, Math.max(4, Math.floor(width * height / averageArea))),
  }
  shuffle(state)
  for (let i = 0; i < state.capacity; i++) {
    const id = nextId(state)
    if (id) state.cards.push(place(state, id))
  }
  return state
}

export function advanceWall(previous: WallState): WallState {
  if (previous.queue.length <= previous.cards.length) return previous
  const state = { ...previous, cards: previous.cards.slice(1), queue: [...previous.queue], retiring: previous.cards[0] }
  const id = nextId(state)
  if (id) {
    state.cards.push(place(state, id))
    state.incomingId = id
  }
  return state
}

export function resizeWall(previous: WallState, width: number, height: number, layouts: Record<string, QuestionTextLayout> = previous.layouts) {
  if (Math.abs(width - previous.width) < 1 && Math.abs(height - previous.height) < 1 && layouts === previous.layouts) return previous
  const state = createWall(previous.queue, width, height, previous.seed, layouts)
  // Keep the current topics present when resizing rather than starting a new content cycle.
  state.cards = []
  state.queue = [...previous.queue]
  state.cursor = previous.cursor
  for (const card of previous.cards.slice(-state.capacity)) state.cards.push(place(state, card.id))
  while (state.cards.length < state.capacity) {
    const id = nextId(state)
    if (!id) break
    state.cards.push(place(state, id))
  }
  return state
}

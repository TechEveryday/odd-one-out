import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDeckStore, type Card } from '../deck'

/** Seats `cards.length` players named P1..Pn holding exactly those cards. */
function seat(cards: Card[]) {
  const store = useDeckStore()
  store.amountOfPlayers = cards.length
  store.players = cards.map((card, i) => ({ name: `P${i + 1}`, card }))
  return store
}

const c = (value: string, suit = 'Spades'): Card => ({ suit, value })

describe('evaluateResults - face card rule', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fires when exactly one player holds a face card', () => {
    const store = seat([c('King'), c('5', 'Hearts'), c('7', 'Clubs')])
    store.evaluateResults()

    expect(store.results).toContain('Only face card - drink P1')
  })

  it('does not fire when two players hold face cards of the same rank', () => {
    // The regression: probing per rank found one Jack and scored the table as 1.
    const store = seat([c('Jack'), c('Jack', 'Hearts'), c('5', 'Clubs')])
    store.evaluateResults()

    expect(store.results.some((r) => r.startsWith('Only face card'))).toBe(false)
  })

  it('does not fire when two players hold face cards of different ranks', () => {
    const store = seat([c('Jack'), c('Queen', 'Hearts'), c('5', 'Clubs')])
    store.evaluateResults()

    expect(store.results.some((r) => r.startsWith('Only face card'))).toBe(false)
  })

  it('does not fire when nobody holds a face card', () => {
    const store = seat([c('2'), c('5', 'Hearts'), c('7', 'Clubs')])
    store.evaluateResults()

    expect(store.results.some((r) => r.startsWith('Only face card'))).toBe(false)
  })

  it('treats an ace as its own rule, not a face card', () => {
    const store = seat([c('Ace'), c('King', 'Hearts'), c('5', 'Clubs')])
    store.evaluateResults()

    expect(store.results).toContain('Only face card - drink P2')
    expect(store.results).toContain('Only ace - drink P1')
  })
})

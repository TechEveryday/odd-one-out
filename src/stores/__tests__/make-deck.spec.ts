import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDeckStore } from '../deck'

describe('makeDeck', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('builds a 54-card deck', () => {
    const store = useDeckStore()
    store.makeDeck()

    expect(store.deck).toHaveLength(54) // 52 + 2 jokers
  })

  it('builds every suit and value exactly once', () => {
    const store = useDeckStore()
    store.makeDeck()

    const keys = store.deck.map(({ suit, value }) => `${suit}-${value}`)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('includes both jokers', () => {
    const store = useDeckStore()
    store.makeDeck()

    const jokers = store.deck.filter(({ suit }) => suit === 'Joker')
    expect(jokers.map(({ value }) => value).sort()).toEqual(['Joker1', 'Joker2'])
  })
})

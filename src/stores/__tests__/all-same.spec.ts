import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDeckStore, type Card, type Player } from '../deck'

function seat(players: Player[]) {
  const store = useDeckStore()
  store.amountOfPlayers = players.length
  store.players = players
  return store
}

const p = (name: string, card: Card | null): Player => ({ name, card })
const c = (value: string, suit: string): Card => ({ suit, value })

describe('evaluateResults - all-same rules', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('fires for a table where every suit matches', () => {
    const store = seat([
      p('A', c('2', 'Clubs')),
      p('B', c('7', 'Clubs')),
      p('C', c('King', 'Clubs')),
    ])
    store.evaluateResults()

    expect(store.results).toContain('All same suit - drink')
  })

  it('fires for a table where every value matches', () => {
    const store = seat([
      p('A', c('7', 'Clubs')),
      p('B', c('7', 'Hearts')),
      p('C', c('7', 'Spades')),
    ])
    store.evaluateResults()

    expect(store.results).toContain('All same value - shot')
  })

  it('does not announce the same outcome twice', () => {
    // "Same card suit - drink A, B, C" plus "All same suit - drink" is one result
    // stated two ways, and both used to be pushed.
    const store = seat([
      p('A', c('2', 'Clubs')),
      p('B', c('7', 'Clubs')),
      p('C', c('King', 'Clubs')),
    ])
    store.evaluateResults()

    expect(store.results.some((r) => r.startsWith('Same card suit'))).toBe(false)
  })

  it('still reports a partial suit match', () => {
    const store = seat([
      p('A', c('2', 'Clubs')),
      p('B', c('7', 'Clubs')),
      p('C', c('King', 'Hearts')),
    ])
    store.evaluateResults()

    expect(store.results).toContain('Same card suit - drink A, B')
    expect(store.results.some((r) => r.startsWith('All same suit'))).toBe(false)
  })

  it('does not fire on a table where nobody has drawn', () => {
    // The regression: card?.suit is undefined for every player, and
    // undefined === undefined made every() true, so both rules fired on an empty table.
    const store = seat([p('A', null), p('B', null), p('C', null)])
    store.evaluateResults()

    expect(store.results.some((r) => r.startsWith('All same'))).toBe(false)
  })

  it('does not fire when only some players have drawn', () => {
    const store = seat([p('A', c('2', 'Clubs')), p('B', c('7', 'Clubs')), p('C', null)])
    store.evaluateResults()

    expect(store.results.some((r) => r.startsWith('All same'))).toBe(false)
  })
})

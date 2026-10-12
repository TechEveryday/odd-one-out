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

const colourResults = (results: string[]) =>
  results.filter((r) => r.startsWith('Only different colour'))

describe('evaluateResults - different colour rule', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('names the only black card among red ones', () => {
    // The reported table: three different suits, so the suit rule says nothing.
    const store = seat([
      p('A', c('4', 'Hearts')),
      p('B', c('9', 'Diamonds')),
      p('C', c('6', 'Spades')),
    ])
    store.evaluateResults()

    expect(colourResults(store.results)).toEqual(['Only different colour - drink C'])
  })

  it('names the only red card among black ones', () => {
    const store = seat([
      p('A', c('4', 'Clubs')),
      p('B', c('9', 'Hearts')),
      p('C', c('6', 'Spades')),
      p('D', c('3', 'Clubs')),
    ])
    store.evaluateResults()

    expect(colourResults(store.results)).toEqual(['Only different colour - drink B'])
  })

  it('does not fire when every card is the same colour', () => {
    const store = seat([
      p('A', c('4', 'Hearts')),
      p('B', c('9', 'Diamonds')),
      p('C', c('6', 'Hearts')),
    ])
    store.evaluateResults()

    expect(colourResults(store.results)).toEqual([])
  })

  it('does not fire when both colours are held by more than one player', () => {
    const store = seat([
      p('A', c('4', 'Hearts')),
      p('B', c('9', 'Diamonds')),
      p('C', c('6', 'Spades')),
      p('D', c('3', 'Clubs')),
    ])
    store.evaluateResults()

    expect(colourResults(store.results)).toEqual([])
  })

  it('leaves Jokers out of the colour count', () => {
    const store = seat([
      p('A', c('4', 'Hearts')),
      p('B', c('9', 'Diamonds')),
      p('C', c('6', 'Spades')),
      p('D', c('Joker1', 'Joker')),
    ])
    store.evaluateResults()

    expect(colourResults(store.results)).toEqual(['Only different colour - drink C'])
  })

  it('does not name anyone for one red and one black beside a Joker', () => {
    const store = seat([
      p('A', c('4', 'Hearts')),
      p('B', c('6', 'Spades')),
      p('C', c('Joker1', 'Joker')),
    ])
    store.evaluateResults()

    expect(colourResults(store.results)).toEqual([])
  })
})

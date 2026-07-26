import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDeckStore } from '../deck'

describe('syncPlayersToCount', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('grows the roster to match the count', () => {
    const store = useDeckStore()
    store.amountOfPlayers = 6
    store.syncPlayersToCount()

    expect(store.players).toHaveLength(6)
  })

  it('shrinks the roster to match the count', () => {
    const store = useDeckStore()
    store.amountOfPlayers = 8
    store.syncPlayersToCount()
    store.amountOfPlayers = 3
    store.syncPlayersToCount()

    expect(store.players).toHaveLength(3)
  })

  it('keeps names already entered when growing', () => {
    const store = useDeckStore()
    store.players[0].name = 'Alex'
    store.amountOfPlayers = 5
    store.syncPlayersToCount()

    expect(store.players[0].name).toBe('Alex')
    expect(store.players[4].name).toBe('')
  })

  it('leaves no blank surplus player behind after shrinking', () => {
    // The regression. Choosing 8, entering nothing, going back and choosing 3 left
    // five nameless players in the array. Nothing rendered them, but the Ready button
    // checked every entry, so it stayed disabled with no way to satisfy it.
    const store = useDeckStore()
    store.amountOfPlayers = 8
    store.syncPlayersToCount()

    store.amountOfPlayers = 3
    store.syncPlayersToCount()
    store.players.forEach((player, i) => (player.name = `P${i + 1}`))

    expect(store.players.some((player) => player.name === '')).toBe(false)
  })

  it('pulls the turn back in range when the roster shrinks under it', () => {
    const store = useDeckStore()
    store.amountOfPlayers = 8
    store.syncPlayersToCount()
    store.playerTurn = 7

    store.amountOfPlayers = 3
    store.syncPlayersToCount()

    expect(store.playerTurn).toBeLessThan(store.players.length)
  })
})

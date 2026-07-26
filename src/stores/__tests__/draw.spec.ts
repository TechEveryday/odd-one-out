import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDeckStore, type Card } from '../deck'

const key = ({ suit, value }: Card) => `${suit}-${value}`

const tableKeys = (store: ReturnType<typeof useDeckStore>) =>
  store.players
    .map(({ card }) => card)
    .filter((card): card is Card => !!card)
    .map(key)

describe('drawCard', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('gives the card to the player whose turn it is', () => {
    const store = useDeckStore()
    store.updatePlayerTurn() // move to player 2

    const drawn = store.drawCard()

    expect(store.players[1].card).toEqual(drawn)
    expect(store.players[0].card).toBeNull()
  })

  it('removes the drawn card from the deck', () => {
    const store = useDeckStore()
    store.drawCard()
    const sizeAfterFirst = store.deck.length

    store.drawCard()

    expect(store.deck).toHaveLength(sizeAfterFirst - 1)
  })

  it('leaves no face-up card sitting in the refilled deck', () => {
    /* The regression, asserted on the deck rather than on what happened to come out
     * of it. Drawing a duplicate is only a ~1-in-54 event per draw, so a test that
     * waits for one to appear passes with the bug most of the time. The invariant is
     * that a card cannot be in a hand and in the deck at once. */
    const store = useDeckStore()

    store.drawCard() // player 1 is now holding a card
    store.deck = [] // next draw has to refill
    store.updatePlayerTurn()
    store.drawCard()

    const onTable = new Set(tableKeys(store))
    const alsoInDeck = store.deck.filter((card) => onTable.has(key(card)))

    expect(alsoInDeck).toEqual([])
  })

  it('holds that invariant across many rounds of real dealing', () => {
    const store = useDeckStore()
    store.amountOfPlayers = 8
    store.players = Array.from({ length: 8 }, (_, i) => ({ name: `P${i + 1}`, card: null }))

    // 160 draws against a 54-card deck: several refills, every one of them mid-round.
    for (let round = 0; round < 20; round++) {
      for (let i = 0; i < store.amountOfPlayers; i++) {
        store.drawCard()
        store.updatePlayerTurn()

        const onTable = new Set(tableKeys(store))
        const alsoInDeck = store.deck.filter((card) => onTable.has(key(card)))
        expect(alsoInDeck, `card both in hand and in deck, round ${round}`).toEqual([])
      }

      const dealt = tableKeys(store)
      expect(new Set(dealt).size, `duplicate on table in round ${round}`).toBe(dealt.length)
    }
  })
})

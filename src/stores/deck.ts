import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Deck = {
  cards: Card[]
}
export type Card = {
  suit: string
  value: string
}

export type Player = {
  name: string
  card: Card | null | undefined
}

export const useDeckStore = defineStore('deck', () => {
  const deck = ref([] as Card[])
  const amountOfPlayers = ref(3)
  const players = ref([] as Player[])
  const playerTurn = ref(0)
  const results = ref([] as string[])
  const firstDraw = ref(true)

  for (let i = 0; i < amountOfPlayers.value; i++) {
    players.value.push({ name: '', card: null })
  }

  function makeDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']

    for (const suit of suits) {
      for (const value of values) {
        deck.value.push({ suit, value })
      }
    }

    deck.value.push({ suit: 'Joker', value: 'Joker1' })
    deck.value.push({ suit: 'Joker', value: 'Joker2' })
  }

  function drawCard() {
    if (deck.value.length === 0) {
      if (!firstDraw.value) {
        results.value.push('Deck empty, community drink')
      }
      console.log('not enough cards, reshuffling')
      makeDeck()
      if (firstDraw.value) {
        firstDraw.value = false
      }
    }
    const randomIndex = Math.floor(Math.random() * deck.value.length)
    const drawnCard = deck.value[randomIndex]
    deck.value.splice(randomIndex, 1)

    players.value[playerTurn.value].card = drawnCard
    players.value = [
      ...players.value.slice(0, playerTurn.value),
      { ...players.value[playerTurn.value], card: drawnCard },
      ...players.value.slice(playerTurn.value + 1),
    ]

    return drawnCard
  }

  function addPlayer() {
    console.log(players.value)
    players.value.push({ name: '', card: null })
  }

  /**
   * Makes the roster exactly `amountOfPlayers` long, growing or shrinking as needed.
   *
   * Callers used to only ever push, so lowering the count left the surplus players in
   * the array. They were never rendered but were still counted by every check that
   * walks `players`, which silently disabled the Ready button and fed cardless entries
   * to the scoring rules.
   */
  function syncPlayersToCount() {
    const target = amountOfPlayers.value

    if (players.value.length > target) {
      players.value = players.value.slice(0, target)
    } else {
      while (players.value.length < target) {
        players.value.push({ name: '', card: null })
      }
    }

    // updatePlayerTurn takes the modulus of the old length, so a turn left pointing
    // past the end of a shrunken roster would make the next draw write to undefined.
    if (playerTurn.value >= players.value.length) {
      playerTurn.value = 0
    }
  }

  function updatePlayerTurn() {
    playerTurn.value = (playerTurn.value + 1) % players.value.length
  }

  function evaluateResults() {
    // if a joker is drawn, shot
    const hasShot = players.value.find(
      ({ card }) => card?.value === 'Joker1' || card?.value === 'Joker2',
    )?.card
    if (hasShot) {
      results.value.push('Joker drawn - shot')
    }

    // if only 1 player has a jack, queen, king then they drink
    //
    // Count players, not ranks. Probing each rank separately with find() and counting
    // the truthy results answers "how many distinct face ranks are on the table", so a
    // table holding two Jacks scored 1 and wrongly fired this rule.
    const faceCardPlayers = players.value.filter(
      ({ card }) => card?.value === 'Jack' || card?.value === 'Queen' || card?.value === 'King',
    )
    if (faceCardPlayers.length === 1) {
      results.value.push(`Only face card - drink ${faceCardPlayers[0].name}`)
    }

    // if only 1 player does not have a jack, queen, king, ace, they drink
    const hasNoFaceCard = players.value.filter(({ card }) => {
      if (card) {
        const value = parseInt(card.value)
        return (
          value < 11 ||
          (card.value !== 'Jack' &&
            card.value !== 'Queen' &&
            card.value !== 'King' &&
            card.value !== 'Ace')
        )
      }
      return false
    })
    const hasNoFaceCardCount = hasNoFaceCard.length
    if (hasNoFaceCardCount === 1) {
      const player = hasNoFaceCard[0]
      if (player) {
        results.value.push(`Only no face card - drink ${player.name}`)
      }
    }

    // if only 1 player has an ace, they drink
    const hasAce = players.value.find(({ card }) => card?.value === 'Ace')?.card
    const hasAceCount = players.value.filter(({ card }) => card?.value === 'Ace').length
    if (hasAce && hasAceCount === 1) {
      const player = players.value.find(({ card }) => card?.value === 'Ace')
      if (player) {
        results.value.push(`Only ace - drink ${player.name}`)
      }
    }

    // if only 1 player has a card that is higher than 8, they drink
    const hasHighCard = players.value.filter(({ card }) => {
      if (card) {
        const value = parseInt(card.value)
        return (
          value >= 8 || card.value === 'Jack' || card.value === 'Queen' || card.value === 'King'
        )
      }
      return false
    })
    const hasHighCardCount = hasHighCard.length
    if (hasHighCardCount === 1) {
      const player = hasHighCard[0]
      if (player) {
        results.value.push(`Only high card - drink ${player.name}`)
      }
    }

    // if only 1 player has a card that is lower than 8, they drink
    const hasLowCard = players.value.filter(({ card }) => {
      if (card) {
        const value = parseInt(card.value)
        return (
          (value < 8 || card.value === 'Ace') &&
          card.value !== 'Jack' &&
          card.value !== 'Queen' &&
          card.value !== 'King'
        )
      }
      return false
    })
    const hasLowCardCount = hasLowCard.length
    if (hasLowCardCount === 1) {
      const player = hasLowCard[0]
      if (player) {
        results.value.push(`Only low card - drink ${player.name}`)
      }
    }

    // if only 1 player has a suit that is different from the rest, they drink
    const suits = players.value.map(({ card }) => card?.suit)
    const uniqueSuits = [...new Set(suits)]
    if (uniqueSuits.length > 1) {
      const suitCounts = uniqueSuits.map((suit) => ({
        suit,
        count: suits.filter((s) => s === suit).length,
      }))
      // if there are 2 counts of 1 then it doesnt count
      const differentSuits = suitCounts.filter(({ count }) => count === 1)
      if (differentSuits.length === 1) {
        const differentSuit = suitCounts.find(({ count }) => count === 1)
        if (differentSuit) {
          const player = players.value.find(({ card }) => card?.suit === differentSuit.suit)
          if (player) {
            results.value.push(`Only different suit - drink ${player.name}`)
          }
        }
      }
    }

    /* Did the whole table match?
     *
     * `everyoneDrew` is the guard that was missing. `card?.suit` is undefined for a
     * player who has not drawn, and `undefined === undefined` is true, so on a table
     * where nobody held a card every() passed and both all-same rules fired against an
     * empty table.
     *
     * Computed here, ahead of the two "same ..." blocks, because those name every
     * matching player — which is the entire table when the all-same rule also applies,
     * so the pair reads as the same outcome announced twice.
     */
    const drawn = players.value.map(({ card }) => card).filter((card): card is Card => !!card)
    const everyoneDrew = drawn.length > 0 && drawn.length === players.value.length
    const allSameSuit = everyoneDrew && drawn.every(({ suit }) => suit === drawn[0].suit)
    const allSameValue = everyoneDrew && drawn.every(({ value }) => value === drawn[0].value)

    // if any players have the same card value, they drink
    const cardValues = players.value.map(({ card }) => card?.value)
    const uniqueCardValues = [...new Set(cardValues)]
    if (!allSameValue && uniqueCardValues.length < cardValues.length) {
      const cardValueCounts = uniqueCardValues.map((value) => ({
        value,
        count: cardValues.filter((v) => v === value).length,
      }))
      const sameCardValues = cardValueCounts.filter(({ count }) => count > 1)
      if (sameCardValues.length > 0) {
        sameCardValues.forEach(({ value }) => {
          const playersWithSameValue = players.value.filter(({ card }) => card?.value === value)
          if (playersWithSameValue.length > 0) {
            const playerNames = playersWithSameValue.map(({ name }) => name).join(', ')
            results.value.push(`Same card value - drink ${playerNames}`)
          }
        })
      }
    }

    // if any players have the same suit, they drink
    const cardSuits = players.value.map(({ card }) => card?.suit)
    const uniqueCardSuits = [...new Set(cardSuits)]
    if (!allSameSuit && uniqueCardSuits.length < cardSuits.length) {
      const cardSuitCounts = uniqueCardSuits.map((suit) => ({
        suit,
        count: cardSuits.filter((s) => s === suit).length,
      }))
      const sameCardSuits = cardSuitCounts.filter(({ count }) => count > 1)
      if (sameCardSuits.length > 0) {
        sameCardSuits.forEach(({ suit }) => {
          const playersWithSameSuit = players.value.filter(({ card }) => card?.suit === suit)
          if (playersWithSameSuit.length > 0) {
            const playerNames = playersWithSameSuit.map(({ name }) => name).join(', ')
            results.value.push(`Same card suit - drink ${playerNames}`)
          }
        })
      }
    }

    // everyone has the same suit
    if (allSameSuit) {
      results.value.push('All same suit - drink')
    }

    // everyone has the same value
    if (allSameValue) {
      results.value.push('All same value - shot')
    }
  }

  return {
    deck,
    amountOfPlayers,
    players,
    playerTurn,
    results,
    makeDeck,
    drawCard,
    addPlayer,
    syncPlayersToCount,
    updatePlayerTurn,
    evaluateResults,
  }
})

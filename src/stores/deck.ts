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
      console.log('not enough cards, reshuffling')
      makeDeck()
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

    // if only 1 player has a jack, queen, king, ace then they drink
    const hasJack = players.value.find(({ card }) => card?.value === 'Jack')?.card
    const hasQueen = players.value.find(({ card }) => card?.value === 'Queen')?.card
    const hasKing = players.value.find(({ card }) => card?.value === 'King')?.card
    const hasFaceCard = [hasJack, hasQueen, hasKing].filter(Boolean).length
    if (hasFaceCard === 1) {
      const player = players.value.find(
        ({ card }) => card?.value === 'Jack' || card?.value === 'Queen' || card?.value === 'King',
      )
      if (player) {
        results.value.push(`Only face card - drink ${player.name}`)
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

    // if any players have the same card value, they drink
    const cardValues = players.value.map(({ card }) => card?.value)
    const uniqueCardValues = [...new Set(cardValues)]
    if (uniqueCardValues.length < cardValues.length) {
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
    if (uniqueCardSuits.length < cardSuits.length) {
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

    // if there are only 4 players and everyone has the same suit, shot
    const allSameSuit = players.value.every(
      ({ card }) => card?.suit === players.value[0].card?.suit,
    )
    if (allSameSuit) {
      results.value.push('All same suit - drink')
    }

    // if there are only only 4 players and everyone has the same value, shot
    const allSameValue = players.value.every(
      ({ card }) => card?.value === players.value[0].card?.value,
    )
    if (allSameValue) {
      results.value.push('All same value - shot')
    }
  }

  return {
    deck,
    amountOfPlayers,
    players,
    results,
    makeDeck,
    drawCard,
    addPlayer,
    updatePlayerTurn,
    evaluateResults,
  }
})

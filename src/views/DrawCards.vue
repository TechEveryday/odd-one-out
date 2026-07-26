<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDeckStore } from '@/stores/deck'
import type { Card } from '@/stores/deck'

const router = useRouter()
const store = useDeckStore()

const SUIT_SYMBOL: Record<string, string> = {
  Hearts: '♥',
  Diamonds: '♦',
  Clubs: '♣',
  Spades: '♠',
  Joker: '★',
}

const VALUE_LABEL: Record<string, string> = {
  Jack: 'J',
  Queen: 'Q',
  King: 'K',
  Ace: 'A',
  Joker1: 'JOKER',
  Joker2: 'JOKER',
}

const suitSymbol = (card: Card) => SUIT_SYMBOL[card.suit] ?? '?'
const valueLabel = (card: Card) => VALUE_LABEL[card.value] ?? card.value
const isRed = (card: Card) => card.suit === 'Hearts' || card.suit === 'Diamonds'

/* The rules escalate from "drink" to "shot", so the harsher outcome is worth calling
 * out visually rather than burying it in an undifferentiated list. */
const isShot = (result: string) => result.toLowerCase().includes('shot')

function drawCards() {
  store.results = []
  for (let i = 0; i < store.amountOfPlayers; i++) {
    store.drawCard()
    store.updatePlayerTurn()
  }

  store.evaluateResults()
}

async function newGame() {
  await store.resetGame()
  router.push('/player-count')
}
</script>

<template>
  <div class="screen">
    <div class="screen__body">
      <h1 class="title">The table</h1>

      <div class="hand">
        <div class="player-card" v-for="i in store.amountOfPlayers" :key="i">
          <span class="player-card__name">{{ store.players[i - 1]?.name }}</span>
          <div
            v-if="store.players[i - 1]?.card"
            class="card-face"
            :class="{ 'card-face--red': isRed(store.players[i - 1].card!) }"
          >
            <span class="card-face__value">{{ valueLabel(store.players[i - 1].card!) }}</span>
            <span class="card-face__suit">{{ suitSymbol(store.players[i - 1].card!) }}</span>
          </div>
          <div v-else class="card-face card-face--empty">
            <span class="card-face__suit">?</span>
          </div>
        </div>
      </div>

      <p class="section-label">Results</p>
      <div class="results" v-if="store.results.length">
        <div
          class="result"
          :class="{ 'result--shot': isShot(result) }"
          v-for="(result, index) in store.results"
          :key="index"
        >
          {{ result }}
        </div>
      </div>
      <p class="empty" v-else>Draw to see who drinks.</p>
    </div>

    <div class="screen__actions">
      <button class="btn" @click="drawCards">Draw</button>
      <button class="btn btn--ghost" @click="newGame">New game</button>
    </div>
  </div>
</template>

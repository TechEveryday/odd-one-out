<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDeckStore } from '@/stores/deck'

const router = useRouter()
const store = useDeckStore()

/* A restored session lands here, so offer to resume it rather than making the group
 * re-enter every name. Names are the marker: a fresh table has all of them blank. */
const hasGameInProgress = () =>
  store.players.length > 0 && store.players.every((player) => player.name !== '')

async function startNewGame() {
  await store.resetGame()
  router.push('/player-count')
}
</script>

<template>
  <div class="screen">
    <div class="screen__body">
      <h1 class="title">Odd One Out</h1>
      <p class="subtitle">A card game for 3 to 8 players.</p>

      <p class="section-label">Rules</p>
      <ul class="rules">
        <li>If a joker is drawn, shot</li>
        <li>If only 1 player has a face card, drink</li>
        <li>If only 1 player has an ace, drink</li>
        <li>If only 1 player has a card 8 or higher, drink</li>
        <li>If only 1 player has a card lower than 8, drink</li>
        <li>If only 1 player has a suit different from the rest, drink</li>
      </ul>
    </div>

    <!-- TODO: Two ways to play,
     automatic and have the app figure it out
     manual and just have the cards drawn but players call out IRL -->
    <div class="screen__actions">
      <button v-if="hasGameInProgress()" class="btn" @click="router.push('/draw')">
        Resume game
      </button>
      <button class="btn" :class="{ 'btn--ghost': hasGameInProgress() }" @click="startNewGame">
        New game
      </button>
    </div>
  </div>
</template>

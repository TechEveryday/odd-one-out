<script setup lang="ts">
import { useDeckStore } from '@/stores/deck'
import { Button } from 'primevue'

const store = useDeckStore()

function drawCards() {
  console.log('Drawing cards...')
  store.results = []
  for (let i = 0; i < store.amountOfPlayers; i++) {
    store.drawCard()
    store.updatePlayerTurn()
  }
  store.players.forEach((player) => {
    console.log(`Card for ${player.name}`, player.card)
  })

  store.evaluateResults()
}
</script>

<template>
  <div class="about">
    <div>
      <Button @click="drawCards" label="Draw"></Button>
      <div>Results:</div>
      <!-- for each string in results display it -->
      <div v-for="(result, index) in store.results" :key="index">
        {{ result }}
      </div>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

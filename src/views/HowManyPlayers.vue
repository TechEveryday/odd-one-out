<script setup lang="ts">
import { useDeckStore } from '@/stores/deck'
import { Button, InputNumber } from 'primevue'

const store = useDeckStore()
</script>

<template>
  <div class="about">
    <div>
      <h1>How many players?</h1>
      <InputNumber
        v-model="store.amountOfPlayers"
        mode="decimal"
        :min="3"
        :max="8"
        :showButtons="true"
      />
      <Button
        @click="() => $router.push('/player-names')"
        label="Next"
        :disabled="store.amountOfPlayers < 3 || store.amountOfPlayers > 8"
      ></Button>
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

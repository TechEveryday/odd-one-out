<script setup lang="ts">
import { useDeckStore } from '@/stores/deck'
import { Button, InputText } from 'primevue'

const store = useDeckStore()
const playersToAdd = store.amountOfPlayers - store.players.length

for (let i = 0; i < playersToAdd; i++) {
  store.players.push({ name: '', card: null })
}
</script>

<template>
  <div class="about">
    <div>
      <div v-for="i in store.amountOfPlayers" :key="i">
        <InputText v-model="store.players[i - 1].name" placeholder="Player Name" />
      </div>
      <Button
        @click="() => $router.push('/draw')"
        label="Ready!"
        :disabled="store.players.some((player) => player.name === '')"
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

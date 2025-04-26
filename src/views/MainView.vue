<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import { Button } from 'primevue'
</script>
<template>
  <div class="about">
    <div>
      <HelloWorld msg="One One Out" />
      <h1>Rules</h1>
      <p>If joker is drawn, shot</p>
      <p>If only 1 player has a face card, drink</p>
      <p>If only 1 player has an ace, drink</p>
      <p>If only 1 player has a card higher than 8 inclusive, drink</p>
      <p>If only 1 player has a card lower than 8, drink</p>
      <p>If only 1 player has a suit that is different than the rest, drink</p>
      <Button @click="() => $router.push('/player-count')" label="Play!"></Button>
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

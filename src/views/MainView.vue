<script setup lang="ts">
import { Button } from 'primevue'
</script>
<template>
  <div class="about">
    <div>
      <h1 class="game-title">Odd One Out</h1>
      <h2>Rules</h2>
      <p>If joker is drawn, shot</p>
      <p>If only 1 player has a face card, drink</p>
      <p>If only 1 player has an ace, drink</p>
      <p>If only 1 player has a card higher than 8 inclusive, drink</p>
      <p>If only 1 player has a card lower than 8, drink</p>
      <p>If only 1 player has a suit that is different than the rest, drink</p>
      <!-- TODO: Two ways to play,
       automatic and have the app figure it out
       manual and just have the cards drawn but players call out IRL -->
      <Button @click="() => $router.push('/player-count')" label="Play!"></Button>
    </div>
  </div>
</template>

<style>
.game-title {
  font-weight: 500;
  font-size: 2.6rem;
  text-align: center;
}

@media (min-width: 1024px) {
  .game-title {
    text-align: left;
  }

  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

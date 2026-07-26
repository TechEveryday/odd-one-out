<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDeckStore } from '@/stores/deck'

const router = useRouter()
const store = useDeckStore()

store.syncPlayersToCount()
</script>

<template>
  <div class="screen">
    <div class="screen__body">
      <h1 class="title">Who's playing?</h1>

      <div class="field" v-for="i in store.amountOfPlayers" :key="i">
        <span class="field__index">{{ i }}</span>
        <input
          class="field__input"
          v-model="store.players[i - 1].name"
          type="text"
          placeholder="Player name"
          autocomplete="off"
          autocapitalize="words"
          autocorrect="off"
          spellcheck="false"
          :aria-label="`Name for player ${i}`"
          enterkeyhint="next"
        />
      </div>
    </div>

    <div class="screen__actions">
      <button
        class="btn"
        :disabled="store.players.some((player) => player.name === '')"
        @click="router.push('/draw')"
      >
        Ready!
      </button>
      <button class="btn btn--ghost" @click="router.push('/player-count')">Back</button>
    </div>
  </div>
</template>

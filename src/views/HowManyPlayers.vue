<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDeckStore } from '@/stores/deck'

const MIN = 3
const MAX = 8

const router = useRouter()
const store = useDeckStore()

/* A stepper rather than a number input: it never raises the on-screen keyboard, and a
 * 60px circle is a far easier target on a phone than a spinner arrow. */
function step(by: number) {
  const next = store.amountOfPlayers + by
  if (next < MIN || next > MAX) return
  store.amountOfPlayers = next
}
</script>

<template>
  <div class="screen">
    <div class="screen__body">
      <h1 class="title">How many players?</h1>
      <p class="subtitle">Between {{ MIN }} and {{ MAX }}.</p>

      <div class="stepper">
        <button
          class="stepper__btn"
          :disabled="store.amountOfPlayers <= MIN"
          aria-label="One fewer player"
          @click="step(-1)"
        >
          −
        </button>
        <span class="stepper__value" aria-live="polite">{{ store.amountOfPlayers }}</span>
        <button
          class="stepper__btn"
          :disabled="store.amountOfPlayers >= MAX"
          aria-label="One more player"
          @click="step(1)"
        >
          +
        </button>
      </div>
    </div>

    <div class="screen__actions">
      <button
        class="btn"
        :disabled="store.amountOfPlayers < MIN || store.amountOfPlayers > MAX"
        @click="router.push('/player-names')"
      >
        Next
      </button>
      <button class="btn btn--ghost" @click="router.push('/')">Back</button>
    </div>
  </div>
</template>

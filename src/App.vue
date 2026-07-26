<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useDeckStore } from '@/stores/deck'

const store = useDeckStore()

/* Rendering waits on hydration. Painting first would flash an empty three-player table
 * for a frame before the restored game replaced it. */
onMounted(() => {
  void store.hydrate()
})
</script>

<template>
  <RouterView v-if="store.hydrated" />
</template>

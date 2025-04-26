<script setup lang="ts">
import Button from 'primevue/button'
</script>

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>
      <Button onclick="console.log('clicked')" label="Test"></Button>
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

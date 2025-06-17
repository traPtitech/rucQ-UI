<script setup lang="ts">
</script>

<template>
  <div :class="$style.container">
    <v-icon icon="mdi-hammer-wrench" size="100px"></v-icon>
    <h1 style="font-weight: 500">Work in Progress</h1>
  </div>
</template>

<style module>
.container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-theme);
}
</style>

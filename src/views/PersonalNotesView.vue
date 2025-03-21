<script setup lang="ts">
import { ref } from 'vue'
import MarkdownPlatform from '@/components/markdown/MarkdownPlatform.vue'

const text = ref('')
</script>

<template>
  <div :class="$style.container">
    <MarkdownPlatform v-model:text="text" color="theme"></MarkdownPlatform>
  </div>
</template>

<style module>
.container {
  position: relative;
  height: 100%;
}

.button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>

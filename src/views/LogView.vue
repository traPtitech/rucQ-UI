<script setup lang="ts">
import LogBox from '@/components/log/LogLayout.vue'
</script>

<template>
  <div class="pa-4" :class="$style.container">
    <log-box type="room-reveal"> 部屋割りが公開されました！ </log-box>
  </div>
</template>

<style module>
.container {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}
</style>

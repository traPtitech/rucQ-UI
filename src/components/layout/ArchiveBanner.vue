<script setup lang="ts">
import { useDisplay } from 'vuetify'

defineProps<{
  campName?: string
}>()

const { xs } = useDisplay()
</script>

<template>
  <div
    :class="[$style.banner, xs ? $style.bannerMobile : $style.bannerDesktop]"
    class="bg-primaryLight"
  >
    <v-icon>mdi-archive</v-icon>
    <span>{{ campName }} はアーカイブ済みです</span>
  </div>
</template>

<style module>
.banner {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.bannerDesktop {
  position: fixed;
  top: 0;
  left: 270px;
  right: 0;
  z-index: 1000;
}

.bannerMobile {
  position: fixed;
  top: 56px; /* v-app-barの高さ分下げる */
  left: 0;
  right: 0;
  z-index: 100;
}
</style>

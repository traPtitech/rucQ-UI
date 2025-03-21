<script setup lang="ts">
const camps: string[] = [
  'camp24_summer',
  'camp25_winter',
  'camp25_summer',
  'camp26_winter',
  'camp26_summer',
  'camp27_winter',
]
</script>

<template>
  <div :class="$style.container">
    <router-link :to="`/`">
      <img :src="`/logo/logo.svg`" style="width: 300px" />
    </router-link>
    <div style="width: 100%; max-width: 600px">
      <div v-for="camp in camps" :key="camp" :class="$style.button">
        <router-link :to="`/${camp}`" style="padding: 0; margin: 0">
          <div>
            <h3 style="font-weight: 700">{{ camp }}</h3>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.button {
  margin: 0 10px;
  padding: 6px;
  border-bottom: 1px dashed var(--color-line);
}
</style>

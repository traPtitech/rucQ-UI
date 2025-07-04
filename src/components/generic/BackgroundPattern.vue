<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps<{
  variant: 'light' | 'primary'
}>()

const logoColor = computed(() => {
  return props.variant === 'primary'
    ? 'rgb(var(--v-theme-patternOnPrimary))'
    : 'rgb(var(--v-theme-surface))'
})

const bgColor = computed(() => {
  return props.variant === 'primary'
    ? 'rgb(var(--v-theme-primary))'
    : 'rgb(var(--v-theme-background))'
})
</script>

<template>
  <div :class="$style.background" :style="{ backgroundColor: bgColor }">
    <div :class="$style.center">
      <div :class="$style.frame">
        <div :class="$style.inner" :style="{ backgroundColor: logoColor }"></div>
      </div>
    </div>
  </div>
</template>

<style module>
.background {
  position: fixed;
  top: 0vh;
  left: 0vw;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.center {
  position: relative;
  height: 0;
  width: 0;
  rotate: -20deg;
}

.frame {
  position: absolute;
  width: 200vw;
  height: 200vh;
  transform: translate(-50%, -50%);
}

.inner {
  position: absolute;
  top: 50%;
  left: 0%;
  width: 100%;
  height: 50%;
}
</style>

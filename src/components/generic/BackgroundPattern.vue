<script setup lang="ts">
import { computed } from 'vue'

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
      <div :class="$style.pattern" :style="{ backgroundColor: logoColor }"></div>
    </div>
  </div>
</template>

<style module>
.background {
  position: fixed !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.center {
  position: relative;
  height: 0;
  width: 0;
}

.pattern {
  position: relative;
  top: -2000px;
  left: -2000px;
  height: 8000px;
  width: 8000px;
  transform: rotate(-30deg);
  mask-image: url('/logo/logo-bg.svg'), url('/logo/logo-bg.svg');
  mask-size:
    1400px 1050px,
    1400px 1050px;
  mask-position:
    0 0,
    700px 525px;
  mask-repeat: repeat;
}
</style>

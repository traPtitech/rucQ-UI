<script setup lang="ts">
import { defineProps } from 'vue';
defineProps<{
  logoColor: string;
  bgColor: string;
}>();
</script>

<template>
  <div :class="$style.background" :style="{backgroundColor: bgColor}">
    <div :class="$style.center">
      <div :class="$style.pattern" :style="{backgroundColor: logoColor}"></div>
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
}

.pattern {
  position: relative;
  top: -2000px;
  left: -2000px;
  height: 8000px;
  width: 8000px;
  transform: rotate(-30deg);
  mask-image:
    url('/logo/logo-bg.svg'),
    url('/logo/logo-bg.svg');
  mask-size: 800px 600px, 800px 600px;
  mask-position: 0 0, 400px 300px;
  mask-repeat: repeat;
}
</style>

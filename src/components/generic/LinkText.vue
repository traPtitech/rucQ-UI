<script setup lang="ts">
defineProps<{
  text: string
  to?: string // なければ代わりに @click で外側からアクションを設定
}>()
</script>

<template>
  <div class="w-100">
    <router-link v-if="to" :class="$style.text" :to="to">{{ text }}</router-link>
    <button v-else :class="$style.text">{{ text }}</button>
  </div>
</template>

<style module>
.text {
  display: block;
  width: fit-content;
  text-align: center;
  color: var(--color-theme);
  margin: auto;
  margin-bottom: 4;
}

.text:hover {
  text-decoration: underline;
}
</style>

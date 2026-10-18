<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
  <div class="d-flex flex-column align-center justify-center w-100 h-100">
    <v-progress-circular indeterminate size="56" color="primary" class="mb-3" />
    <h3 class="font-weight-bold">{{ message }}</h3>
  </div>
</template>

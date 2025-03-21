<template>
  <MarkdownPreview :isEditable="false" v-model:text="text" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiClient } from '@/api/apiClient'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'

const text = ref('')

onMounted(async () => {
  text.value = (await apiClient.GET('/api/camps/default')).data!.description
})
</script>

<style module></style>

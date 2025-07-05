<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <markdown-preview :isEditable="false" v-model:text="guidebookContent" />
      <!-- ここに見出し一覧、クリックで飛べるようにする -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'

const { displayCamp } = storeToRefs(useCampStore())

const guidebookContent = computed(() => displayCamp.value?.guidebook || '')
</script>

<style module>
.container {
  width: 100%;
  height: 100%;
  padding: 40px 16px;
  display: flex;
}

.content {
  flex-grow: 1;
  height: 100%;
}
</style>

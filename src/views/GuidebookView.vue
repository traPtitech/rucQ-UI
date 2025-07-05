<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <markdown-preview :mdtext="guidebookContent" v-model:headings="headings" />
    </div>
    <div :class="$style.sidebar">
      <table-of-contents :headings="headings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import TableOfContents from '@/components/markdown/TableOfContents.vue'
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'

type HeadingInfo = {
  id: string
  level: number
  text: string
}

const { displayCamp } = storeToRefs(useCampStore())

const guidebookContent = computed(() => displayCamp.value?.guidebook || '')
const headings = ref<HeadingInfo[]>([])
</script>

<style module>
.container {
  width: 100%;
  height: 100%;
  padding: 40px 16px;
  display: flex;
  gap: 24px;
}

.content {
  flex-grow: 1;
  height: 100%;
  min-width: 0; /* フレックスアイテムの縮小を許可 */
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 16px;
  }

  .sidebar {
    width: 100%;
    order: -1; /* モバイルでは目次を上に表示 */
  }
}
</style>

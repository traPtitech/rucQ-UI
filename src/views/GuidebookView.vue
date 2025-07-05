<template>
  <div :class="$style.container">
    <div :class="smAndDown ? $style.contentMobile : $style.content">
      <div v-if="smAndDown" :class="$style.sidebarMobile">
        <table-of-contents :headings="headings" />
      </div>
      <markdown-preview :mdtext="guidebookContent" v-model:headings="headings" />
    </div>
    <div v-if="!smAndDown" :class="$style.sidebar">
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
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

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
  margin: 0 auto;
  max-width: 1000px;
  height: 100vh;
  display: flex;
}

.content {
  flex-grow: 1;
  height: 100%;
  overflow: scroll;
  padding: 40px 24px;
}

.contentMobile {
  flex-grow: 1;
  height: 100%;
  overflow: scroll;
  padding: 40px 16px;
}

.sidebarMobile {
  width: 100%;
  margin-bottom: 40px;
}

.sidebar {
  width: 280px;
  padding: 40px 16px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  flex-shrink: 0;
}
</style>

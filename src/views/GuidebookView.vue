<template>
  <div :class="$style.container">
    <div :class="smAndDown ? $style.contentMobile : $style.content">
      <div v-if="smAndDown" :class="$style.sidebarMobile">
        <table-of-contents :headings="headings" />
      </div>
      <markdown-preview v-model:headings="headings" :mdtext="displayCamp.guidebook" />
    </div>
    <div v-if="!smAndDown" :class="$style.sidebar">
      <table-of-contents :headings="headings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCamps } from '@/composables/camps'
import { computed, ref } from 'vue'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import TableOfContents from '@/components/markdown/TableOfContents.vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

type HeadingInfo = {
  id: string
  level: number
  text: string
}

const { getCampByDisplayId } = useCamps()
const route = useRoute()

const displayCamp = computed(() => {
  return getCampByDisplayId(route.params.campname as string)
})

const headings = ref<HeadingInfo[]>([])
</script>

<style module>
.container {
  width: 100%;
  margin: 0 auto;
  max-width: 1000px;
  height: 100%;
  display: flex;
  position: relative; /* 背景より前面に配置 */
}

.content {
  height: 100%;
  overflow: hidden;
  padding: 40px 24px;
  width: calc(100% - 280px);
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
  overflow-y: auto;
  flex-shrink: 0;
  right: 0;
  position: fixed;
  top: var(--router-view-top-offset, 0px);
  bottom: 0;
}
</style>

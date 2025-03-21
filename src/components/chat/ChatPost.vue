<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserIcon from '@/components/generic/UserIcon.vue'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import { getDisplayDate } from '@/lib/date'
const props = defineProps<{ tweet: Tweet }>()
type Tweet = {
  id: number
  content: string
  created_at: string
  author: string
}

const content = ref('')
onMounted(() => {
  content.value = props.tweet.content
})
</script>

<template>
  <div :class="$style.container">
    <UserIcon :size="30" style="margin-top: 6px" />
    <div style="width: 100%; margin-left: 10px; overflow: hidden">
      <div style="display: flex; align-items: flex-end; font-family: Roboto">
        <h5 style="font-weight: bold; margin-right: 6px">@{{ tweet.author }}</h5>
        <h6 style="font-weight: 400; padding-bottom: 2px">
          {{ getDisplayDate(new Date(tweet.created_at)) }}
        </h6>
      </div>
      <div style="position: relative; overflow-wrap: break-word">
        <MarkdownPreview :pad="0" :isEditable="false" v-model:text="content" />
      </div>
    </div>
  </div>
</template>

<style module>
.container {
  width: 100%;
  border-top: 1px dashed var(--color-light-gray);
  padding: 8px 0 8px 0;
  display: flex;
  align-items: flex-start;
}
</style>

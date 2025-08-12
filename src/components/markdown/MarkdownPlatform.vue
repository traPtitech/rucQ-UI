<script setup lang="ts">
import { ref } from 'vue'
import MarkdownEditor from './MarkdownEditor.vue'
import MarkdownPreview from './MarkdownPreview.vue'
const text = defineModel<string>('text', { default: '' })
const isPreview = ref<boolean>(false)

defineProps<{ color: string }>()
</script>

<template>
  <div style="width: 100%; height: 100%">
    <div style="width: 100%; height: 100%; position: absolute">
      <markdown-editor v-if="!isPreview" v-model:text="text" :color="color">
        <v-btn
          density="comfortable"
          elevation="0"
          icon="mdi-eye-outline"
          base-color="transparent"
          :class="`text-${color}`"
          style="margin-bottom: 10px"
          @click="isPreview = true"
        ></v-btn>
      </markdown-editor>
      <markdown-preview v-else :mdtext="text" style="height: 100%; width: 100%; padding: 0 8px">
        <div :class="$style.button">
          <v-btn
            density="comfortable"
            icon="mdi-square-edit-outline"
            base-color="white"
            :class="`text-${color}`"
            @click="isPreview = false"
          ></v-btn>
        </div>
      </markdown-preview>
    </div>
  </div>
</template>

<style module>
.button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>

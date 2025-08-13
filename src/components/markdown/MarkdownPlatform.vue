<script setup lang="ts">
import { ref } from 'vue'
import MarkdownEditor from './MarkdownEditor.vue'
import MarkdownPreview from './MarkdownPreview.vue'
const text = defineModel<string>('text')
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
      <div v-else>
        <markdown-preview :mdtext="text || ''" class="w-100 h-100 pa-4" />
        <div :class="$style.button">
          <v-btn
            density="comfortable"
            icon="mdi-square-edit-outline"
            base-color="white"
            :class="`text-${color}`"
            @click="isPreview = false"
          ></v-btn>
        </div>
      </div>
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

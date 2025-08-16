<script setup lang="ts">
import { ref } from 'vue'
import MarkdownEditor from './MarkdownEditor.vue'
import MarkdownPreview from './MarkdownPreview.vue'
const text = defineModel<string>('text')
const isPreview = ref<boolean>(false)

defineProps<{ color: string }>()
</script>

<template>
  <div class="w-100 h-100 position-absolute">
    <div class="w-100 h-100 overflow-auto">
      <markdown-editor v-if="!isPreview" v-model:text="text" :color="color">
        <v-btn
          density="comfortable"
          elevation="0"
          icon="mdi-eye-outline"
          variant="text"
          :color="color"
          :class="['mb-3', $style.colorTransition]"
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

.colorTransition {
  transition-property: color, background-color, border-color, fill, stroke;
  transition-duration: 0.28s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

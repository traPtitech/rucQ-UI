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
      <MarkdownEditor :color="color" v-model:text="text" v-if="!isPreview">
        <v-btn
          @click="isPreview = true"
          density="comfortable"
          elevation="0"
          icon="mdi-eye-outline"
          baseColor="transparent"
          :class="`text-${color}`"
          style="margin-bottom: 10px"
        ></v-btn>
      </MarkdownEditor>
      <MarkdownPreview v-else v-model:text="text" style="height: 100%; width: 100%; padding: 0 8px">
        <div :class="$style.button">
          <v-btn
            @click="isPreview = false"
            density="comfortable"
            icon="mdi-square-edit-outline"
            baseColor="white"
            :class="`text-${color}`"
          ></v-btn>
        </div>
      </MarkdownPreview>
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

<!-- 参加登録・合宿選択 View -->
<!-- すでにユーザーが最新の合宿の参加登録を済ませている場合は GuidebookView へリダイレクトする -->
<script setup lang="ts">
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
const { displayCamp } = storeToRefs(useCampStore())
</script>

<template>
  <div :class="$style.container">
    <img :src="`/logo/logo-white.svg`" style="width: 200px" />
    <v-expansion-panels v-if="displayCamp">
      <v-expansion-panel :class="$style.panel">
        <v-expansion-panel-title>
          <span :class="$style.title">{{ displayCamp.name }}</span>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div :class="$style.content">
            <div :class="$style.guidebook">
              <markdown-preview v-model:text="displayCamp.description" />
            </div>
            <v-btn
              elevation="0"
              prepend-icon="mdi-arrow-right"
              baseColor="transparent"
              variant="flat"
              color="primary"
              :class="[$style.save, 'font-weight-bold']"
            >
              <span class="font-weight-medium">この合宿に参加する</span>
            </v-btn>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-else>
      <v-alert type="error" :class="$style.alert">
        合宿が選択されていません。管理者にお問い合わせください。
      </v-alert>
    </div>
  </div>
  <div></div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 16px;
}

.panel {
  margin-top: 40px;
  max-width: 600px;
  width: 80%;
}

.content {
  position: relative;
}

.save {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
}

.guidebook {
  height: 480px;
  overflow: auto;
  padding-bottom: 40px;
}

.title {
  font-weight: bold;
}

.alert {
  margin-top: 40px;
}
</style>

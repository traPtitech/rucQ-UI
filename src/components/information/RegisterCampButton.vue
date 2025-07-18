<script setup lang="ts">
import { ref } from 'vue'
import UserIcon from '@/components/generic/UserIcon.vue'
import { useCampStore } from '@/store'

const campStore = useCampStore()

const dialog = ref(false)

const handleParticipate = async () => {
  try {
    await campStore.register(campStore.latestCamp.id)
  } catch (error) {
    console.error('参加登録の処理でエラーが発生しました:', error)
  }
}
</script>

<template>
  <v-card :class="$style.container">
    <div :class="$style.header">
      <user-icon :size="28" />
      <h3 class="text-h6 font-weight-bold">合宿への参加</h3>
    </div>

    <div :class="$style.statusRow">
      <div :class="$style.registeredLabel">
        <v-icon class="text-secondary" size="20">mdi-close-circle-outline</v-icon>
        <span class="text-secondary">未登録</span>
      </div>

      <v-btn color="primary" elevation="0" size="small" class="text-none" @click="dialog = true">
        合宿に参加する
      </v-btn>
    </div>
  </v-card>

  <v-dialog v-model="dialog" width="400" @after-leave="handleParticipate">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold"> 合宿への参加確認 </v-card-title>

      <v-card-text class="pb-2">
        <p class="text-body-1 mb-0">この合宿に参加しますか？</p>
      </v-card-text>

      <v-card-actions class="pa-4 pt-2">
        <v-btn variant="text" @click="dialog = false" class="text-none"> キャンセル </v-btn>
        <v-btn color="primary" @click="dialog = false" class="text-none ml-2"> 参加する </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style module>
.container {
  margin: 24px 0 16px 0;
  padding: 24px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #e9e5d9;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
}

.participateButton {
  height: 48px;
  font-weight: 600;
  font-size: 16px;
}

.statusRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.registeredLabel {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

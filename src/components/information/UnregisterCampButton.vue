<script setup lang="ts">
import { ref } from 'vue'
import UserIcon from '@/components/generic/UserIcon.vue'
import { useCampStore, useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
const { user } = storeToRefs(useUserStore())

const campStore = useCampStore()

const dialog = ref(false)
const shouldUnregister = ref(false)

const confirmUnregistration = () => {
  dialog.value = false
  shouldUnregister.value = true
}

const executeUnregistration = async () => {
  if (!shouldUnregister.value) return
  shouldUnregister.value = false

  try {
    await campStore.unregister(campStore.latestCamp.id)
  } catch (error) {
    console.error('参加取り消しの処理でエラーが発生しました:', error)
  }
}
</script>

<template>
  <v-card :class="$style.container">
    <div :class="$style.header">
      <user-icon :id="user.id" :size="28" />
      <h3 class="text-h6 font-weight-bold">合宿への参加</h3>
    </div>

    <div :class="$style.statusRow">
      <div :class="$style.registeredLabel">
        <v-icon color="success" size="20">mdi-check-circle-outline</v-icon>
        <span>参加登録済み</span>
      </div>

      <v-btn color="error" variant="outlined" size="small" class="text-none" @click="dialog = true">
        参加を取り消す
      </v-btn>
    </div>
  </v-card>

  <v-dialog v-model="dialog" width="400" @after-leave="executeUnregistration">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold"> 参加取り消しの確認 </v-card-title>

      <v-card-text class="pb-2">
        <p class="text-body-1 mb-0">この合宿への参加を取り消しますか？</p>
      </v-card-text>

      <v-card-actions class="pa-4 pt-2">
        <v-spacer />
        <v-btn variant="text" class="text-none" @click="dialog = false"> キャンセル </v-btn>
        <v-btn color="error" class="text-none ml-2" @click="confirmUnregistration">
          参加を取り消す
        </v-btn>
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

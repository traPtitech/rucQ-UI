<script setup lang="ts">
import { computed, ref } from 'vue'
import UserIcon from '@/components/generic/UserIcon.vue'
import { useCampStore } from '@/store'

const campStore = useCampStore()

const isRegistered = computed(() => campStore.hasRegisteredLatest)

const dialog = ref(false)

const dialogTitle = computed(() => {
  return isRegistered.value ? '参加取り消しの確認' : '合宿への参加確認'
})

const dialogMessage = computed(() => {
  return isRegistered.value ? 'この合宿への参加を取り消しますか？' : 'この合宿に参加しますか？'
})

const confirmButtonText = computed(() => {
  return isRegistered.value ? '参加を取り消す' : '参加する'
})

const handleParticipate = async () => {
  try {
    if (isRegistered.value) {
      await campStore.unregister(campStore.latestCamp.id)
    } else {
      await campStore.register(campStore.latestCamp.id)
    }
    dialog.value = false
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

    <!-- 登録状態に応じて表示を切り替え -->
    <div v-if="isRegistered" :class="$style.statusRow">
      <div :class="$style.registeredLabel">
        <v-icon color="success" size="20">mdi-check-circle-outline</v-icon>
        <span>参加登録済み</span>
      </div>

      <v-btn color="error" variant="outlined" size="small" class="text-none" @click="dialog = true">
        参加を取り消す
      </v-btn>
    </div>

    <div v-else :class="$style.statusRow">
      <div :class="$style.registeredLabel">
        <v-icon class="text-secondary" size="20">mdi-close-circle-outline</v-icon>
        <span class="text-secondary">未登録</span>
      </div>

      <v-btn color="primary" elevation="0" size="small" class="text-none" @click="dialog = true">
        合宿に参加する
      </v-btn>
    </div>
  </v-card>

  <v-dialog v-model="dialog" width="400">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ dialogTitle }}
      </v-card-title>

      <v-card-text class="pb-2">
        <p class="text-body-1 mb-0">{{ dialogMessage }}</p>
      </v-card-text>

      <v-card-actions class="pa-4 pt-2">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false" class="text-none"> キャンセル </v-btn>
        <v-btn color="primary" @click="handleParticipate" class="text-none ml-2">
          {{ confirmButtonText }}
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

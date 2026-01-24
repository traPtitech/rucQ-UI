<script lang="ts" setup>
import { useCampStore } from '@/store'
import { ref } from 'vue'

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
    <div :class="$style.side">
      <v-icon color="white">mdi-check</v-icon>
    </div>
    <div :class="$style.mainContent">参加登録済みです</div>
    <v-btn
      :class="$style.button"
      color="#4caf50"
      variant="outlined"
      size="small"
      class="text-none"
      @click="dialog = true"
    >
      解除する
    </v-btn>
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
  margin: 24px 0px 12px 0px;
  padding: 0px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #e9e5d9;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.side {
  width: 40px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  background-color: #4caf50;
}

.mainContent {
  height: 60px;
  text-align: center;
  line-height: 60px;
  color: #4caf50;
  margin-left: 20px;
}

.button {
  margin-left: auto;
  margin-right: 16px;
}
</style>

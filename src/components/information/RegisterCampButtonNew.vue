<script lang="ts" setup>
import { useCampStore } from '@/store'
import { ref } from 'vue'

const campStore = useCampStore()

const dialog = ref(false)
const shouldRegister = ref(false)

const confirmRegistration = () => {
  dialog.value = false
  shouldRegister.value = true
}

const executeRegistration = async () => {
  if (!shouldRegister.value) return
  shouldRegister.value = false

  try {
    await campStore.register(campStore.latestCamp.id)
  } catch (error) {
    console.error('参加登録の処理でエラーが発生しました:', error)
  }
}
</script>

<template>
  <v-card :class="$style.container">
    <div :class="$style.side">
      <v-icon color="white">mdi-exclamation</v-icon>
    </div>
    <div :class="$style.mainContent">参加登録をしていません</div>
    <v-btn
      :class="$style.button"
      color="primary"
      elevation="0"
      size="small"
      class="text-none"
      @click="dialog = true"
    >
      登録する
    </v-btn>
  </v-card>

  <v-dialog v-model="dialog" width="400" @after-leave="executeRegistration">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold"> 合宿への参加確認 </v-card-title>

      <v-card-text class="pb-2">
        <p class="text-body-1 mb-0">この合宿に参加しますか？</p>
      </v-card-text>

      <v-card-actions class="pa-4 pt-2">
        <v-btn variant="text" class="text-none" @click="dialog = false"> キャンセル </v-btn>
        <v-btn color="primary" class="text-none ml-2" @click="confirmRegistration">
          参加する
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style module>
.container {
  margin: 24px 0px 12px 0px;
  padding: 0;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
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
  background-color: #ff7300;
}

.mainContent {
  height: 60px;
  text-align: center;
  line-height: 60px;
  color: #ff7300;
  margin-left: 20px;
}

.button {
  margin-left: auto;
  margin-right: 16px;
}
</style>

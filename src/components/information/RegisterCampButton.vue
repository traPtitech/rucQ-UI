<script setup lang="ts">
import { ref } from 'vue'
import { useCampStore } from '@/store'

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
      <v-icon color="white">mdi-check</v-icon>
    </div>

    <div :class="$style.mainContent">  <!-- to do 金額を入れる -->
      <div :class="$style.text">合宿係が ￥{{}} の 振込を確認しました</div>
      <!--
      <div style="align-items: right;">
        <v-btn color="primary" elevation="0" size="small" class="text-none" @click="dialog = true">
          合宿に参加する
        </v-btn>
      </div>
      -->
    </div>
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
  margin: 0px;
  padding: 0px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #e9e5d9;
  display: flex;
  flex-direction: row;
}

.side {
  margin: 0px;
  padding: 0px;
  width: 10vw;
  height: 60px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #4caf50;
}

.mainContent {
  margin: 0px;
  padding: 0px 0px 0px 0px;
}

.text {
  padding: 0px 0px 0px 20px;
  line-height: 60px;
  align-items: center;
  color: #4caf50;
}

.participateButton {
  height: 48px;
  font-weight: 600;
  font-size: 16px;
}

.registeredLabel {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>

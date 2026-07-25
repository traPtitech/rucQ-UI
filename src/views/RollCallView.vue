<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useCampStore, useUserStore } from '@/store'
import { apiClient } from '@/api/apiClient'
import BackgroundPattern from '@/components/generic/BackgroundPattern.vue'
import UserResponse from '@/components/rollcall/UserResponse.vue'
import { useRollCallStream } from '@/components/rollcall/rollCallStream'
import type { RollCall } from '@/typeAliases'

const route = useRoute()
const campStore = useCampStore()
const userStore = useUserStore()

const rollcall = ref<RollCall>()
const stream = useRollCallStream(rollcall, userStore.user.id)
const { grouped, myReaction, chooseOption, init, stop } = stream
// grouped: 点呼の選択肢ごとにユーザー ID をまとめたオブジェクト

// v-radio-group の @update:model-value 用ラッパー
const handleRadioChange = (value: string | null) => {
  if (value !== null) void chooseOption(value)
}

// 点呼情報を取得
const getRollCall = async () => {
  const camp = campStore.getCampByDisplayId(route.params.campname as string)

  const { data, error } = await apiClient.GET('/api/camps/{campId}/roll-calls', {
    params: { path: { campId: camp.id } },
  })
  if (error) throw new Error(`点呼情報の取得に失敗しました: ${error.message}`)
  return data.find((r) => r.id.toString() === route.params.rollcallId)
}

// ユーザーが点呼の対象かどうか
const isSubject = computed(() => {
  if (!rollcall.value) return false
  return rollcall.value.subjects.includes(userStore.user.id)
})

onMounted(async () => {
  // 点呼情報取得
  rollcall.value = await getRollCall()
  if (!rollcall.value) return

  // stream/composable を初期化
  await init()
})

onBeforeUnmount(() => {
  stop()
})

// traQ チャンネルの URL（環境変数からパスを参照）
const channelUrl = computed(() => `https://q.trap.jp/channels/${import.meta.env.VITE_CHANNEL_PATH}`)
</script>

<template>
  <div class="position-relative">
    <background-pattern variant="light" />
    <div :class="[$style.header, `text-${isSubject ? 'white' : 'black'}`]">
      <div :class="$style.headerBg">
        <background-pattern :variant="isSubject ? 'primary' : 'light'" />
      </div>
      <div :class="$style.title">{{ rollcall?.name }}</div>
      <div :class="$style.description">{{ rollcall?.description }}</div>
      <div :class="$style.unanswered">
        <user-response
          v-if="rollcall"
          title="未回答"
          :user-ids="grouped.unanswered"
          :text-color="isSubject ? 'white' : 'black'"
        />
      </div>
      <div class="d-flex justify-center mt-2">
        <v-btn
          variant="flat"
          :class="$style.shadow"
          :href="channelUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="d-flex align-center">
            <img src="/src/assets/traq.svg" alt="traQ" height="20" class="mr-1" />
            <div :class="$style.buttonText">traQ で連絡する</div>
          </div>
        </v-btn>
      </div>
      <div v-if="!isSubject" :class="[$style.notSubject, 'text-primary']">点呼の対象外です</div>
    </div>
    <div :class="$style.body">
      <v-radio-group :model-value="myReaction?.content" @update:model-value="handleRadioChange">
        <v-card
          v-for="opt in grouped.options"
          :key="opt.name"
          variant="flat"
          :class="$style.shadow"
          class="mb-5"
          :color="myReaction?.content === opt.name ? 'primary' : 'white'"
        >
          <v-card-text class="d-flex justify-space-between py-3 px-2">
            <v-radio color="white" :value="opt.name" :disabled="!isSubject" />
            <user-response
              :title="opt.name"
              :user-ids="opt.ids"
              :text-color="myReaction?.content === opt.name ? 'white' : 'black'"
            />
          </v-card-text>
        </v-card>
      </v-radio-group>
    </div>
  </div>
</template>

<style module>
.header {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 80px 16px 40px;
  z-index: 1;
}

.headerBg {
  position: absolute;
  top: -2000px; /* 上方向へのスクロールで上端が切れないように余分に上方向の大きさを取る */
  left: 0;
  width: 100%;
  height: calc(100% + 2000px); /* その分戻す */
  z-index: -1;
  clip-path: inset(0 0 20px 0);
}

.title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-align: center;
}

.description {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 4px;
}

.unanswered {
  margin: 32px 0;
}

.buttonText {
  text-transform: none;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0em;
}

.notSubject {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.body {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  padding: 16px 16px 32px;
}

.shadow {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  transition: none !important;
}
</style>

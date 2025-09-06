<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useCampStore, useUserStore } from '@/store'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import BackgroundPattern from '@/components/generic/BackgroundPattern.vue'
import UserResponse from '@/components/rollcall/UserResponse.vue'
import { useRollCallStream } from '@/lib/rollCallStream'

type RollCall = components['schemas']['RollCallResponse']

const route = useRoute()
const campStore = useCampStore()
const userStore = useUserStore()

const rollcall = ref<RollCall>()
const stream = useRollCallStream(rollcall, userStore.user.id)
const { grouped, myReaction, chooseOption, init, stop } = stream
// grouped: 点呼の選択肢ごとにユーザー ID をまとめたオブジェクト

// 点呼情報を取得
const getRollCall = async () => {
  const camp = campStore.getCampByDisplayId(route.params.campname as string)

  const { data, error } = await apiClient.GET('/api/camps/{campId}/roll-calls', {
    params: { path: { campId: camp.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch roll calls')
  return data.find((r) => r.id.toString() === route.params.rollcallId)
}

// ユーザーが点呼の対象かどうか
const isSubject = computed(() => {
  if (!rollcall.value || !userStore.user) return false
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
</script>

<template>
  <div class="position-relative">
    <background-pattern variant="light" />
    <div :class="$style.topBackground">
      <background-pattern :variant="isSubject ? 'primary' : 'light'" class="position-relative" />
    </div>
    <div :class="[$style.header, `text-${isSubject ? 'white' : 'black'}`]">
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
        <v-btn variant="flat" :class="$style.shadow">
          <div class="d-flex align-center">
            <img src="/src/assets/traq.svg" alt="traQ" height="20" class="mr-1" />
            <div :class="$style.buttonText">traQ で連絡する</div>
          </div>
        </v-btn>
      </div>
      <div v-if="!isSubject" :class="[$style.notSubject, 'text-primary']">対象外の点呼です</div>
    </div>
    <div :class="$style.body">
      <v-card
        v-for="opt in grouped.options"
        :key="opt.name"
        variant="flat"
        :class="$style.shadow"
        class="mb-5 border border-primary border-opacity-100"
        :color="myReaction?.content === opt.name ? 'primary' : 'white'"
        :ripple="isSubject"
        @click="chooseOption(opt.name)"
      >
        <v-card-text class="py-3">
          <user-response
            :title="opt.name"
            :user-ids="opt.ids"
            :text-color="myReaction?.content === opt.name ? 'white' : 'black'"
          />
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style module>
.topBackground {
  position: absolute;
  top: -400px; /* 上方向へのスクロールで上端が切れないように余分に上方向の大きさを取る */
  left: 0;
  width: 100vw;
  clip-path: inset(0 0 calc(100% - 770px) 0); /* theme 色の背景部分の実質的な表示高さは 370px */
}

.header {
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  bottom: 32px;
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

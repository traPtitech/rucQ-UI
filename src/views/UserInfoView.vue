<script setup lang="ts">
import MasonryWall from '@yeger/vue-masonry-wall'
import PaymentInfo from '@/components/information/PaymentInfo.vue'
import RoomInfo from '@/components/information/RoomInfo.vue'
import { apiClient } from '@/api/apiClient'
import { computed } from 'vue'
import { useCampStore } from '@/store'
import { useRoute } from 'vue-router'
import type { components } from '@/api/schema'
import QuestionGroupPanel from '@/components/information/QuestionGroupPanel.vue'
import RegisterCampButton from '@/components/information/RegisterCampButton.vue'
import UnregisterCampButton from '@/components/information/UnregisterCampButton.vue'
import { useQuery } from '@tanstack/vue-query'
import { qk } from '@/api/queries/keys'

type QuestionGroup = components['schemas']['QuestionGroupResponse'][]
type Dashboard = components['schemas']['DashboardResponse']

const campStore = useCampStore()
const route = useRoute()

const displayCamp = campStore.getCampByDisplayId(route.params.campname as string)

const isRegistered = computed(() => campStore.hasRegisteredLatest)

// 質問グループ一覧
const { data: questionGroups } = useQuery<QuestionGroup, Error>({
  queryKey: qk.camps.questionGroups(displayCamp.id),
  queryFn: async () => {
    const { data, error } = await apiClient.GET('/api/camps/{campId}/question-groups', {
      params: { path: { campId: displayCamp.id } },
    })
    if (error || !data) throw error ?? new Error('Failed to fetch question groups')
    return data
  },
})

// ダッシュボード（支払い/部屋情報）
const {
  data: dashboard,
  isPending: isPendingDashboard,
  isFetching: isFetchingDashboard,
} = useQuery<Dashboard, Error>({
  queryKey: qk.camps.dashboard(displayCamp.id),
  queryFn: async () => {
    const { data, error } = await apiClient.GET('/api/camps/{campId}/me', {
      params: { path: { campId: displayCamp.id } },
    })
    if (error || !data) throw error ?? new Error('Failed to fetch dashboard')
    return data
  },
})

// PaymentInfoに読み込み状態を渡す
const isReady = computed(() => !(isPendingDashboard.value || isFetchingDashboard.value))

// 参加登録が可能な状態かどうかを判定
const isRegisteredOpen = displayCamp.isRegistrationOpen
</script>

<template>
  <div v-if="questionGroups" :class="$style.container">
    <div v-if="isRegisteredOpen">
      <unregister-camp-button v-if="isRegistered" />
      <register-camp-button v-else />
    </div>
    <room-info v-if="dashboard?.room" :room="dashboard?.room" />
    <payment-info v-else :is-ready="isReady" :payment="dashboard?.payment" />
    <div :class="$style.heading">合宿オプション</div>
    <div :class="$style.questionGroups">
      <masonry-wall :items="questionGroups" :column-width="300" :gap="16">
        <template #default="{ item: questionGroup }">
          <question-group-panel :question-group="questionGroup" :camp="displayCamp" />
        </template>
      </masonry-wall>
    </div>
  </div>
</template>

<style module>
.heading {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  letter-spacing: 0.1em;
  margin-right: -0.1em;
  text-align: center;
}

.questionGroups {
  width: calc(100% + 8px);
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.container {
  height: 100%;
  width: 100%;
  margin: auto;
  max-width: 800px;
  box-sizing: border-box;
  position: relative;
  padding: 16px 16px 80px 16px;
}
</style>

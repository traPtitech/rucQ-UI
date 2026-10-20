<script setup lang="ts">
import { useCamps } from '@/composables/camps'
import { MasonryWall } from '@yeger/vue-masonry-wall'
import PaymentInfo from '@/components/information/PaymentInfo.vue'
import RoomInfo from '@/components/information/RoomInfo.vue'
import { useGetQuestionGroups, getDashboard, getGetDashboardQueryKey } from '@/api/generated/client'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import QuestionGroupPanel from '@/components/information/QuestionGroupPanel.vue'
import RegisterCampButton from '@/components/information/RegisterCampButton.vue'
import UnregisterCampButton from '@/components/information/UnregisterCampButton.vue'

const { getCampByDisplayId, hasRegisteredLatest } = useCamps()
const route = useRoute()

const displayCamp = getCampByDisplayId(route.params.campname as string)

const isRegistered = computed(() => hasRegisteredLatest.value)

// 質問グループ一覧
const { data: questionGroups } = useGetQuestionGroups(() => displayCamp.id)

// ダッシュボード（支払い/部屋情報）
const {
  data: dashboard,
  isPending: isPendingDashboard,
  isFetching: isFetchingDashboard,
} = useQuery({
  queryKey: getGetDashboardQueryKey(displayCamp.id),
  queryFn: async ({ signal }) => {
    try {
      return await getDashboard(displayCamp.id, { signal })
    } catch (error) {
      // 404 は未参加を表すため、成功扱いで空のダッシュボードを返す。
      if (error instanceof Error && 'status' in error && error.status === 404) return null
      throw error
    }
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
    <room-info v-if="dashboard?.room" :room="dashboard.room" />
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

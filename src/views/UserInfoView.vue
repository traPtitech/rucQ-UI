<script setup lang="ts">
import MasonryWall from '@yeger/vue-masonry-wall'
import PaymentInfo from '@/components/information/PaymentInfo.vue'
import RoomInfo from '@/components/information/RoomInfo.vue'
import { apiClient } from '@/api/apiClient'
import { onMounted, ref } from 'vue'
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'
import type { components } from '@/api/schema'
import QuestionGroupPanel from '@/components/information/QuestionGroupPanel.vue'

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Dashboard = components['schemas']['DashboardResponse']

const { displayCamp } = storeToRefs(useCampStore())

const getQuestionGroups = async () => {
  if (!displayCamp.value) throw new Error('Camp is not selected')
  const { data, error } = await apiClient.GET('/api/camps/{campId}/question-groups', {
    params: { path: { campId: displayCamp.value.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch question groups')
  return data
}

const getDashboard = async () => {
  if (!displayCamp.value) throw new Error('Camp is not selected')
  const { data, error } = await apiClient.GET('/api/camps/{campId}/me', {
    params: { path: { campId: displayCamp.value.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch dashboard')
  return data
}

const questionGroups = ref<QuestionGroup[]>([])
const dashboard = ref<Dashboard>()
const isReady = ref(false)

onMounted(async () => {
  questionGroups.value = await getQuestionGroups()
  dashboard.value = await getDashboard()
  isReady.value = true
})
</script>

<template>
  <div :class="$style.container" v-if="questionGroups">
    <room-info v-if="dashboard?.room" :room="dashboard?.room" />
    <payment-info v-else :is-ready="isReady" :payment="dashboard?.payment" />
    <div :class="$style.heading">合宿オプション</div>
    <div :class="$style.questionGroups">
      <masonry-wall :items="questionGroups" :column-width="300" :gap="16">
        <template #default="{ item: questionGroup }">
          <question-group-panel :questionGroup="questionGroup" />
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
  letter-spacing: 2px;
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
  padding: 16px;
}
</style>

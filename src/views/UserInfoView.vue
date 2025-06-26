<script setup lang="ts">
import MasonryWall from '@yeger/vue-masonry-wall'
import PaymentInfo from '@/components/information/PaymentInfo.vue'
import RoomInfo from '@/components/information/RoomInfo.vue'
import { apiClient } from '@/api/apiClient'
import { onMounted, ref } from 'vue'
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'
import type { components } from '@/api/schema'

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Dashboard = components['schemas']['DashboardResponse']

const { camp } = storeToRefs(useCampStore())

const getQuestionGroups = async () => {
  if (!camp.value) throw new Error('Camp is not selected')
  const { data, error } = await apiClient.GET('/api/camps/{campId}/question-groups', {
    params: { path: { campId: camp.value.id } },
  })
  if (error || !data) throw error
  return data
}

const getDashboard = async () => {
  if (!camp.value) throw new Error('Camp is not selected')
  const { data, error } = await apiClient.GET('/api/camps/{campId}/me', {
    params: { path: { campId: camp.value.id } },
  })
  if (error || !data) throw error
  return data
}

const questionGroups = ref<QuestionGroup[]>([])
const dashboard = ref<Dashboard>()

onMounted(async () => {
  questionGroups.value = await getQuestionGroups()
  dashboard.value = await getDashboard()
})
</script>

<template>
  <div :class="$style.container" v-if="questionGroups">
    <room-info v-if="dashboard?.room" :room="dashboard?.room" />
    <payment-info v-else :payment="dashboard?.payment" />
    <div :class="$style.heading">合宿オプション</div>
    <masonry-wall :items="questionGroups" :column-width="300" :gap="32">
      <template #default="{ item: questionGroup }">
        <v-card color="themePale">
          <template v-slot:title>
            <span class="font-weight-bold text-theme mr-auto">{{ questionGroup.name }}</span>
          </template>
          <v-card-text class="bg-white pt-4">{{ questionGroup.description }}</v-card-text>
        </v-card>
      </template>
    </masonry-wall>
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

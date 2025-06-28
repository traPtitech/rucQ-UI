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
    <div :class="$style.questionGroups">
      <masonry-wall :items="questionGroups" :column-width="300" :gap="16">
        <template #default="{ item: questionGroup }">
          <v-card color="themePale" elevation="0" :class="$style.card">
            <template v-slot:title>
              <div :class="$style.title">
                <span class="font-weight-bold text-theme">{{ questionGroup.name }}</span>
                <v-btn
                  density="comfortable"
                  elevation="0"
                  icon="mdi-square-edit-outline"
                  baseColor="transparent"
                  class="text-theme"
                ></v-btn>
              </div>
            </template>
            <v-card-text class="bg-white pt-4">
              <div>{{ questionGroup.description }}</div>
            </v-card-text>
          </v-card>
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
  width: calc(100% + 24px);
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

.card {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  margin: 0 8px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  letter-spacing: 2px;
  width: 100%;
}

.card :global(.v-card-item) {
  padding: 4px 6px 4px 12px !important;
}
</style>

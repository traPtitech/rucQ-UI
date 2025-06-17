<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import RoomInformationPanel from '@/components/information/RoomInformationPanel.vue'
// import PaymentInformationPanel from '@/components/information/PaymentInformationPanel.vue'
import InformationGroupItem from '@/components/information/InformationGroupItem.vue'

const questionGroups = ref<components['schemas']['QuestionGroup'][]>([])

const getInformationGroups = async () => {
  const { data, error } = await apiClient.GET('/api/question_groups')
  if (error) console.error('Failed to fetch information groups:', error.message)
  return data
}

onMounted(async () => {
  questionGroups.value = (await getInformationGroups()) ?? []
})
</script>

<template>
  <div :class="$style.container">
    <room-information-panel />
    <!-- <payment-information-panel /> -->
    <information-group-item
      v-for="questionGroup in questionGroups"
      :key="questionGroup.id"
      :questionGroup="questionGroup"
    />
  </div>
</template>

<style module>
.container {
  height: 100%;
  width: 100%;
  margin: auto;
  max-width: 600px;
}
</style>

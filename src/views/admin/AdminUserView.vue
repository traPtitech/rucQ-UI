<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import PaymentInformationPanel from '@/components/information/PaymentInformationPanel.vue'
import InformationGroupItem from '@/components/information/InformationGroupItem.vue'

const paymentDataList = ref<components['schemas']['Budget'][]>([])
const questionGroups = ref<components['schemas']['QuestionGroup'][]>([])
const selectedId = ref<string | null>(null)
const selectedPaymentData = computed(() =>
  paymentDataList.value.find((data) => data.user_traq_id === selectedId.value),
)

const getPaymentDataList = async () => {
  const { data, error } = await apiClient.GET('/api/budgets')
  if (error) console.error('Failed to fetch payment data:', error.message)
  return data
}

const getQuestionGroups = async () => {
  const { data, error } = await apiClient.GET('/api/question_groups')
  if (error) console.error('Failed to fetch information groups:', error.message)
  return data
}

onMounted(async () => {
  paymentDataList.value = (await getPaymentDataList()) ?? []
  questionGroups.value = (await getQuestionGroups()) ?? []
})
</script>

<template>
  <v-container class="d-flex flex-column align-center ga-4">
    <v-sheet class="d-flex flex-column elevation-2 px-8 py-4" max-width="800" width="100%">
      <v-autocomplete
        v-model="selectedId"
        class="py-2"
        :items="paymentDataList"
        item-title="user_traq_id"
        item-value="user_traq_id"
        label="traQ ID"
        auto-select-first
        hide-details
      >
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :prepend-avatar="`https://q.trap.jp/api/v3/public/icon/${item.raw.user_traq_id ?? 'traP'}`"
            :title="item.raw.user_traq_id"
          />
        </template>
      </v-autocomplete>
      <v-card-item
        class="px-0"
        :title="selectedId ?? 'traQ ID'"
        :prepend-avatar="`https://q.trap.jp/api/v3/public/icon/${selectedId ?? 'traP'}`"
      />
      <v-container class="d-flex flex-column ga-4 pa-0">
        <payment-information-panel :data="selectedPaymentData" />
        <information-group-item
          v-for="questionGroup in questionGroups"
          :key="questionGroup.id"
          :questionGroup="questionGroup"
          :targetId="selectedId"
        />
      </v-container>
    </v-sheet>
  </v-container>
</template>

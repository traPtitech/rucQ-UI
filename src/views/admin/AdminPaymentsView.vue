<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import PaymentDataTable from '@/components/information/PaymentDataTable.vue'

type PaymentData = components['schemas']['Budget']

const paymentDataList = ref<PaymentData[]>([])

// 支払済、未払、エラーで分類
const paidDataList = computed(() =>
  paymentDataList.value.filter((data) => data.amount_paid === data.amount),
)
const unpaidDataList = computed(() =>
  paymentDataList.value.filter((data) => data.amount_paid === 0),
)
const errorDataList = computed(() =>
  paymentDataList.value.filter(
    (data) => data.amount_paid !== 0 && data.amount_paid !== data.amount,
  ),
)

const getPaymentDataList = async () => {
  const { data, error } = await apiClient.GET('/api/budgets')
  if (error) {
    console.error('Failed to fetch payment data:', error.message)
    return []
  }
  return data
}

onMounted(async () => {
  paymentDataList.value = await getPaymentDataList()
})
</script>

<template>
  <v-container class="d-flex flex-column align-center ga-4">
    <v-sheet class="d-flex flex-column elevation-2 pa-4" max-width="800" width="100%">
      <div class="d-flex justify-space-between align-center px-4 pt-4">
        <h1 class="text-h4 text-center">支払い情報</h1>
        <v-btn color="orange" :to="{ name: 'AdminPaymentRegister' }">振込登録ページへ</v-btn>
      </div>
      <payment-data-table
        v-if="errorDataList.length > 0"
        title="振込エラー"
        :paymentDataList="errorDataList"
      />
      <payment-data-table title="未払い" :paymentDataList="unpaidDataList" />
      <payment-data-table title="支払済み" :paymentDataList="paidDataList" />
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import type { components } from '@/api/schema'

type PaymentData = components['schemas']['Budget']
const headers = [
  { title: 'ID', key: 'user_traq_id' },
  { title: '請求金額', key: 'amount' },
  { title: '支払金額', key: 'amount_paid' },
]

defineProps<{
  title: string
  paymentDataList: PaymentData[]
}>()

const copyToClipboard = (dataList: PaymentData[]) => {
  const text = dataList.map((data) => `@${data.user_traq_id}`).join(' ')
  navigator.clipboard.writeText(text)
}
</script>

<template>
  <v-container>
    <div class="d-flex align-center justify-space-between w-100">
      <v-card-title>{{ title }}</v-card-title>
      <v-btn
        icon="mdi-content-copy"
        size="small"
        variant="plain"
        @click="copyToClipboard(paymentDataList)"
      />
    </div>
    <v-data-table
      :items="paymentDataList"
      :headers="headers"
      items-per-page="-1"
      density="compact"
      hide-default-footer
    >
      <template v-slot:item.user_traq_id="{ value }">
        <v-avatar :size="24" :image="`https://q.trap.jp/api/v3/public/icon/${value}`" />
        {{ value }}
      </template>
    </v-data-table>
  </v-container>
</template>

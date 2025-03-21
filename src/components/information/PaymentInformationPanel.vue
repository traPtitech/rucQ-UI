<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'

const paymentData = ref<components['schemas']['Budget']>()

const status = computed(() => {
  if (paymentData.value?.amount == null) return 'none'
  return paymentData.value?.amount === paymentData.value?.amount_paid ? 'paid' : 'unpaid'
})
const billing = computed(() => paymentData.value?.amount ?? 0)
const paid = computed(() => paymentData.value?.amount_paid ?? 0)

onMounted(async () => {
  paymentData.value = (await apiClient.GET('/api/me/budgets')).data!
})
</script>

<template>
  <v-card elevation="0" v-if="status === 'paid'" color="greenPale" class="ma-4 pa-4">
    <v-card-title class="text-center pa-0">
      <span style="font-weight: 900; font-size: 24px; color: var(--color-green)">
        {{ billing.toLocaleString() }} 円
      </span>
    </v-card-title>
    <v-card-text class="text-center pa-0">
      <span style="font-weight: bold; color: var(--color-green)"> 支払いが完了しています </span>
    </v-card-text>
  </v-card>

  <v-card elevation="0" v-if="status === 'unpaid'" color="redPale" class="ma-4 pa-4">
    <v-card-title class="text-center pa-0">
      <span style="font-weight: 900; font-size: 24px; color: var(--color-red)">
        {{ billing.toLocaleString() }} 円
      </span>
    </v-card-title>
    <v-card-text class="text-center pa-0">
      <span style="font-weight: bold; color: var(--color-red)">
        {{ paid > 0 ? `${paid.toLocaleString()} 円が支払い済み` : '支払いが完了していません' }}
      </span>
    </v-card-text>
  </v-card>

  <v-card elevation="0" v-if="status === 'none'" color="ashPale" class="ma-4 pa-4">
    <v-card-title class="text-center pa-0">
      <span style="font-weight: bold; font-size: 24px; color: var(--color-ash)">未登録</span>
    </v-card-title>
    <v-card-text class="text-center pa-0">
      <span style="font-weight: bold; color: var(--color-ash)">
        合宿費情報が登録されていません
      </span>
    </v-card-text>
  </v-card>
</template>

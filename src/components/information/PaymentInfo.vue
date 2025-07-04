<script lang="ts" setup>
import { computed } from 'vue'
import type { components } from '@/api/schema'

type Payment = components['schemas']['PaymentResponse']

const props = defineProps<{ isReady: boolean; payment?: Payment }>()

const isPaid = computed(() => props.payment?.amount === props.payment?.amountPaid)

// 支払い金額をカンマによる 3 桁区切りで表示
const sepAmount = computed(() => {
  if (props.payment?.amount == null) return ''
  return new Intl.NumberFormat('ja-JP').format(props.payment.amount)
})
</script>

<template>
  <div v-if="props.payment" :class="$style.container">
    <v-alert v-if="isPaid" type="success"> ¥ {{ sepAmount }} 支払い済みです </v-alert>
    <v-alert v-else type="warning"> ¥ {{ sepAmount }} の支払いが完了していません </v-alert>
  </div>
  <div v-else :class="$style.container">
    <v-alert v-if="isReady" type="info"> 支払いに関する登録情報はありません </v-alert>
  </div>
</template>

<style module>
.container {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import type { components } from '@/api/schema'

type Payment = components['schemas']['PaymentResponse']

const props = defineProps<{ payment?: Payment }>()

const isPaid = computed(() => props.payment?.amount === props.payment?.amountPaid)

// 支払い金額をカンマによる 3 桁区切りで表示
const sepAmount = computed(() => {
  if (props.payment?.amount == null) return ''
  return new Intl.NumberFormat('ja-JP').format(props.payment.amount)
})
</script>

<template>
  <div v-if="props.payment" :class="$style.container">
    <div v-if="isPaid" :class="[$style.content, $style.paid]">
      <v-icon icon="mdi-check" size="36" class="mx-3" />
      <span :class="$style.text">¥ {{ sepAmount }} 支払い済みです</span>
    </div>
    <div v-else :class="[$style.content, $style.notpaid]">
      <v-icon icon="mdi-alert-circle-outline" size="36" class="mx-3" />
      <span :class="$style.text">¥ {{ sepAmount }} の支払いが完了していません</span>
    </div>
  </div>
  <div v-else :class="$style.container">
    <div :class="[$style.content, $style.noinfo]">
      <v-icon icon="mdi-information-outline" size="36" class="mx-3" />
      <span :class="$style.text">支払いに関する登録情報はありません</span>
    </div>
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

.content {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 8px;
}

.paid {
  background-color: rgba(0, 206, 0, 0.2);
  color: #008c00;
}

.notpaid {
  background-color: rgba(255, 140, 91, 0.2);
  color: #ff4d00;
}

.noinfo {
  background-color: transparent;
  color: #000000;
}

.text {
  font-size: 14px;
  font-weight: bold;
}
</style>

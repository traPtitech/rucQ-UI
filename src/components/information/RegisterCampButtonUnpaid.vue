<script lang="ts" setup>
import type { components } from '@/api/schema'
import { computed } from 'vue'

type Payment = components['schemas']['PaymentResponse']

const props = defineProps<{ payment?: Payment }>()

// 支払い金額をカンマによる 3 桁区切りで表示
const sepAmount = computed(() => {
  if (props.payment?.amount == null) return ''
  return new Intl.NumberFormat('ja-JP').format(props.payment.amount)
})
</script>

<template>
  <v-card :class="$style.container">
    <div :class="$style.side">
      <v-icon color="white">mdi-exclamation</v-icon>
    </div>
    <div :class="$style.mainContent">
      <span v-if="props.payment">￥ {{ sepAmount }} の振込が未確認です</span>
      <span v-else>支払いに関する登録情報はありません</span>
      <br />振込済みの場合は、合宿係の確認までお待ちください
    </div>
  </v-card>
</template>

<style module>
.container {
  margin: 24px 0px 12px 0px;
  padding: 0px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  border: 1px solid #e9e5d9;
  display: flex;
  flex-direction: row;
}

.side {
  width: 40px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  background-color: #ff7300;
}

.mainContent {
  height: 53px;
  text-align: left;
  color: #ff7300;
  margin: 7px auto auto 20px;
}
</style>

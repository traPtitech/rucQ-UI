<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
// import { useUserStore } from '@/store'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import PaymentInformationPanel from '@/components/information/PaymentInformationPanel.vue'

const autocompleteRef = ref()
const confirmButtonRef = ref()
type PaymentData = components['schemas']['Budget'] & {
  transfer_id: string
  avatar: string
}
const customFilter = (value: string, query: string, item: unknown) => {
  return (item as { raw: PaymentData }).raw.transfer_id.startsWith(query.toUpperCase())
}

const operatorId = 'vPhos' // TODO: store使う
const paymentDataList = ref<PaymentData[]>([])
const selectedId = ref<string | null>(null)
const selectedData = computed(() =>
  paymentDataList.value.find((data) => data.user_traq_id === selectedId.value),
)
const newPaidAmount = ref<number>()

watch(selectedId, () => {
  if (selectedData.value == null) return
  newPaidAmount.value = selectedData.value.amount ?? undefined
})

const getPaymentDataList = async () => {
  const { data, error } = await apiClient.GET('/api/budgets')
  if (error) {
    console.error('Failed to fetch payment data list:', error.message)
    return []
  }
  return data.map((data) => ({
    ...data,
    transfer_id: data.user_traq_id.toUpperCase().replace(/[-_]/g, ''),
    avatar: `https://q.trap.jp/api/v3/public/icon/${data.user_traq_id}`,
  }))
}

const settlePayment = async (type: 'confirm' | 'reject') => {
  if (selectedData.value?.amount == null) return
  const updateSuccess = await updatePaymentData()
  if (!updateSuccess) return
  if (type === 'confirm') await sendDm('approve')
  else {
    const messageType =
      selectedData.value.amount_paid === selectedData.value.amount ? 'duplicate' : 'reject'
    await sendDm(messageType)
    alert(
      `振込内容を拒否しました。必ず@${selectedData.value.user_traq_id}にDMでコンタクトをとってください。`,
    )
  }
  selectedId.value = null
  autocompleteRef.value?.focus()
}

const updatePaymentData = async () => {
  if (selectedData.value == null || newPaidAmount.value == null) return
  const { error } = await apiClient.PUT('/api/users/{traq_id}/budgets', {
    params: { path: { traq_id: selectedData.value?.user_traq_id } },
    body: {
      camp_id: selectedData.value.camp_id,
      amount: selectedData.value.amount,
      amount_paid: selectedData.value.amount_paid + newPaidAmount.value,
    },
  })
  if (error) {
    console.error('Failed to update payment data:', error.message)
    alert('支払い情報の更新に失敗しました')
  } else {
    selectedData.value.amount_paid += newPaidAmount.value // paymentDataListにも反映される
  }
  return error == null // 正常に完了したか
}

const sendDm = async (type: 'approve' | 'reject' | 'duplicate') => {
  if (selectedData.value == null) return
  const message = {
    approve: `合宿係です。\n${selectedData.value.amount}円の振込確認が完了しました。`,
    reject: `合宿係です。\n振込金額に誤りがあります。@${operatorId ?? ''}にDMで問い合わせてください。`,
    duplicate: `合宿係です。\n振込が重複しています。@${operatorId ?? ''}にDMで問い合わせてください。`,
  }[type]

  const { error } = await apiClient.POST('/api/dm', {
    body: {
      target_user: selectedData.value.user_traq_id,
      content: message,
    },
  })
  if (error) {
    console.error('Failed to send DM:', error.message)
  }
}

const handlerKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    event.preventDefault()
    confirmButtonRef.value?.$el.focus()
  }
}

onMounted(async () => {
  paymentDataList.value = await getPaymentDataList()
})
</script>

<template>
  <v-container class="d-flex flex-column align-center ga-4">
    <v-sheet class="d-flex flex-column elevation-2 px-8 py-4" max-width="800" width="100%">
      <v-autocomplete
        v-model="selectedId"
        class="py-2"
        ref="autocompleteRef"
        :items="paymentDataList"
        item-title="user_traq_id"
        item-value="user_traq_id"
        label="振込名義ID"
        :custom-filter="customFilter"
        auto-select-first
        hide-details
        @keydown="handlerKeyDown"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :prepend-avatar="item.raw.avatar"
            :title="item.raw.transfer_id"
          />
        </template>
      </v-autocomplete>
      <v-card-item
        class="px-0"
        :title="selectedData?.user_traq_id ?? 'traQ ID'"
        :prepend-avatar="selectedData?.avatar ?? 'https://q.trap.jp/api/v3/public/icon/traP'"
      />
      <payment-information-panel :data="selectedData" />
      <v-text-field v-model="newPaidAmount" class="pt-8 pb-4" label="振込金額" hide-details />
      <div class="d-flex align-center justify-center ga-4">
        <v-btn
          class="flex-grow-1 bg-green-lighten-2"
          :disabled="
            selectedData?.amount == null ||
            selectedData.amount_paid + (newPaidAmount ?? 0) !== selectedData.amount
          "
          ref="confirmButtonRef"
          @click="settlePayment('confirm')"
        >
          振込確認
        </v-btn>
        <v-btn
          class="flex-grow-1 bg-red-lighten-3"
          :disabled="
            selectedData?.amount == null ||
            newPaidAmount == null ||
            selectedData.amount_paid + (newPaidAmount ?? 0) === selectedData.amount
          "
          @click="settlePayment('reject')"
        >
          拒否
        </v-btn>
      </div>
    </v-sheet>
    <router-link class="text-decoration-underline" :to="{ name: 'AdminPayments' }">
      支払い情報ページに戻る
    </router-link>
  </v-container>
</template>

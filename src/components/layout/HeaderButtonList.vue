<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'
import { apiClient } from '@/api/apiClient'
const { displayCamp, latestCamp, hasRegisteredLatest } = storeToRefs(useCampStore())

const router = useRouter()

const isViewingLatestCamp = computed(() => {
  return displayCamp.value && latestCamp.value && displayCamp.value.id === latestCamp.value.id
})

const routeTop = () => {
  displayCamp.value = undefined
  router.push('/')
}

// 合宿の参加を取り消す。displayCamp === allCamp[0] を前提とする
const cancelRegistration = async () => {
  if (!displayCamp.value) return
  const { error } = await apiClient.DELETE('/api/camps/{campId}/register', {
    params: { path: { campId: displayCamp.value.id } },
  })
  if (error) throw error
  hasRegisteredLatest.value = false
  routeTop()
}
</script>

<template>
  <v-list dense>
    <v-list-item @click="routeTop" prepend-icon="mdi-arrow-right"> トップページに戻る </v-list-item>
    <v-divider v-if="isViewingLatestCamp" :class="$style.divider" />
    <v-list-item
      v-if="isViewingLatestCamp"
      @click="cancelRegistration"
      class="text-error"
      prepend-icon="mdi-close"
    >
      合宿の参加を取り消す
    </v-list-item>
  </v-list>
</template>

<style module>
.divider {
  margin: 8px 0;
}
</style>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCampStore } from '@/store'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'

type RollCall = components['schemas']['RollCallResponse']

const route = useRoute()
const campStore = useCampStore()

const rollcall = ref<RollCall>()

const getRollCall = async () => {
  const camp = campStore.getCampByDisplayId(route.params.campname as string)

  const { data, error } = await apiClient.GET('/api/camps/{campId}/roll-calls', {
    params: { path: { campId: camp.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch roll calls')
  return data.find((r) => r.id.toString() === route.params.rollcallId)
}

onMounted(async () => {
  rollcall.value = await getRollCall()
})
</script>

<template>{{ rollcall }}</template>

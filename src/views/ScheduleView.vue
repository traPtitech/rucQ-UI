<script setup lang="ts">
import ScheduleContent from '@/components/event/ScheduleContent.vue'
import type { components } from '@/api/schema'
import { computed, ref, onMounted } from 'vue'
import { useCampStore } from '@/store'
import { useRoute } from 'vue-router'
import { apiClient } from '@/api/apiClient'

type CampEvent = components['schemas']['EventResponse']

const campStore = useCampStore()
const route = useRoute()

const displayCamp = computed(() => {
  return campStore.getCampByDisplayId(route.params.campname as string)
})

const events = ref<CampEvent[]>([])

const getEvents = async () => {
  const { data, error } = await apiClient.GET('/api/camps/{campId}/events', {
    params: { path: { campId: displayCamp.value.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch events')
  return data
}

onMounted(async () => {
  events.value = await getEvents()
})
</script>

<template>
  <schedule-content :camp="displayCamp" :events="events" />
</template>

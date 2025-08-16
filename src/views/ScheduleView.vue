<script setup lang="ts">
import ScheduleContent from '@/components/event/ScheduleContent.vue'
import type { components } from '@/api/schema'
import { computed, ref, onMounted } from 'vue'
import { useCampStore } from '@/store'
import { useRoute } from 'vue-router'
import { apiClient } from '@/api/apiClient'
import { provide } from 'vue'
import EventEditor from '@/components/event/EventEditor.vue'

type CampEvent = components['schemas']['EventResponse']

const campStore = useCampStore()
const route = useRoute()

const displayCamp = computed(() => {
  return campStore.getCampByDisplayId(route.params.campname as string)
})

const isOperable = computed(() => {
  return campStore.isOperable(displayCamp.value)
})

const events = ref<CampEvent[]>([])

const getEvents = async () => {
  const { data, error } = await apiClient.GET('/api/camps/{campId}/events', {
    params: { path: { campId: displayCamp.value.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch events')
  return data
}

const refreshEvents = async () => {
  events.value = await getEvents()
}

provide('refresh', refreshEvents)
onMounted(refreshEvents)
</script>

<template>
  <div :class="$style.container">
    <v-dialog v-if="isOperable" fullscreen transition="dialog-bottom-transition">
      <template #activator="{ props: activatorProps }">
        <v-card
          color="transparent"
          variant="flat"
          :class="$style.newEventMobile"
          v-bind="activatorProps"
        >
          <div class="d-flex flex-column align-center justify-center h-100">
            <v-icon icon="mdi-plus" size="60" />
            <span class="font-weight-bold my-2">新規イベント作成</span>
          </div>
        </v-card>
      </template>
      <template #default="{ isActive }">
        <event-editor :event="null" @close="isActive.value = false" />
      </template>
    </v-dialog>
    <schedule-content :camp="displayCamp" :events="events" />
  </div>
</template>

<style module>
.container {
  position: relative;
  max-width: 800px;
  margin: auto;
  padding: 20px 10px;
}

.newEventMobile {
  height: 120px;
}
</style>

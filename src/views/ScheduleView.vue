<script setup lang="ts">
import ScheduleContent from '@/components/event/ScheduleContent.vue'
import type { CampEvent } from '@/typeAliases'
import { computed } from 'vue'
import { useCampStore } from '@/store'
import { useRoute } from 'vue-router'
import { apiClient } from '@/api/apiClient'
import EventEditor from '@/components/event/EventEditor.vue'
import { useQuery } from '@tanstack/vue-query'
import { qk } from '@/api/queries/keys'

const campStore = useCampStore()
const route = useRoute()

const displayCamp = computed(() => {
  return campStore.getCampByDisplayId(route.params.campname as string)
})

const isOperable = computed(() => {
  return campStore.isOperable(displayCamp.value)
})

const { data: events } = useQuery<CampEvent[], Error>({
  queryKey: computed(() => qk.camps.events(displayCamp.value.id)),
  enabled: computed(() => Boolean(displayCamp.value)),
  staleTime: 10 * 60 * 1000, // 10m
  queryFn: async () => {
    const { data, error } = await apiClient.GET('/api/camps/{campId}/events', {
      params: { path: { campId: displayCamp.value.id } },
    })
    if (error) throw new Error(`イベント情報の取得に失敗しました: ${error.message}`)
    return data
  },
})
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
    <schedule-content :camp="displayCamp" :events="events || []" />
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

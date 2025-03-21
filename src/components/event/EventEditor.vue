<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import EventEditorSettings from '@/components/event/EventEditorSettings.vue'
import MarkdownPlatform from '@/components/markdown/MarkdownPlatform.vue'
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()
import { apiClient } from '@/api/apiClient'
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'

const { camp } = storeToRefs(useCampStore())

const emit = defineEmits(['close', 'refresh'])

import type { components } from '@/api/schema'
type CampEvent = components['schemas']['Event']
const props = defineProps<{ event: CampEvent | null }>()

const isValid = computed(() => {
  if (!name.value) return false
  if (!location.value) return false
  if (!startTime.value) return false
  if (!endTime.value) return false
  return true
})

const tab = ref('')
const color = ref('orange')
const name = ref('')
const location = ref('')
const startTime = ref<Date>()
const endTime = ref<Date>()
const description = ref('')

const dateToText = (date: Date) => {
  const isoString = new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString()
  return isoString.replace('Z', '+09:00') // 日本時間
}

const newEvent = async () => {
  await apiClient.POST('/api/events', {
    body: {
      name: name.value,
      description: description.value,
      location: location.value,
      time_start: dateToText(startTime.value!),
      time_end: dateToText(endTime.value!),
      camp_id: camp.value!.id,
      create_as_staff: color.value === 'navy' || color.value === 'ash',
      display_color: color.value,
    },
  })
  emit('refresh')
}

const editEvent = async () => {
  await apiClient.PUT('/api/events/{event_id}', {
    params: { path: { event_id: props.event!.id } },
    body: {
      name: name.value,
      description: description.value,
      location: location.value,
      time_start: dateToText(startTime.value!),
      time_end: dateToText(endTime.value!),
      camp_id: camp.value!.id,
      create_as_staff: color.value === 'navy' || color.value === 'ash',
      display_color: color.value,
    },
  })
  emit('refresh')
}

const deleteEvent = async () => {
  await apiClient.DELETE('/api/events/{event_id}', {
    params: { path: { event_id: props.event!.id } },
  })
  emit('refresh')
}

onMounted(async () => {
  if (props.event) {
    color.value = props.event.display_color
    name.value = props.event.name
    location.value = props.event.location
    startTime.value = new Date(props.event.time_start)
    endTime.value = new Date(props.event.time_end)
    description.value = props.event.description
  } else {
    startTime.value = new Date(camp.value!.start_date)
    endTime.value = new Date(camp.value!.start_date)
    endTime.value.setHours(endTime.value.getHours() + 23)
    endTime.value.setMinutes(endTime.value.getMinutes() + 59)
  }
})
</script>

<template>
  <div class="h-100">
    <v-sheet class="h-100 bg-white d-flex flex-column position-relative">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <v-btn
          @click="emit('close')"
          density="comfortable"
          elevation="0"
          icon="mdi-close"
          baseColor="transparent"
          class="text-black"
          style="margin: 10px"
        ></v-btn>
        <v-btn
          @click="props.event ? editEvent() : newEvent()"
          elevation="0"
          append-icon="mdi-check"
          baseColor="transparent"
          variant="flat"
          :color="color"
          :disabled="!isValid"
          style="font-size: 16px; margin: 10px"
          >{{ props.event ? '更新' : '作成' }}</v-btn
        >
      </div>
      <v-tabs v-if="smAndDown" v-model="tab" :class="`flex-shrink-0 text-${color}`">
        <v-tab value="設定" width="50%"><span style="font-weight: bold">設 定</span></v-tab>
        <v-tab value="概要" width="50%"><span style="font-weight: bold">概 要</span></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab" v-if="smAndDown" style="height: 100%; flex-shrink: 1">
        <v-tabs-window-item value="設定" style="height: 100%; padding: 20px">
          <EventEditorSettings
            :event="event"
            v-model:name="name"
            v-model:location="location"
            v-model:startTime="startTime"
            v-model:endTime="endTime"
            v-model:color="color"
            @delete="deleteEvent"
          />
        </v-tabs-window-item>

        <v-tabs-window-item value="概要" style="height: 100%">
          <MarkdownPlatform v-model:text="description" :color="color"></MarkdownPlatform>
        </v-tabs-window-item>
      </v-tabs-window>
      <div v-else style="display: flex; width: 100%; height: 100%">
        <EventEditorSettings
          :event="event"
          style="width: 400px; height: 100%; padding: 20px; flex-shrink: 0"
          v-model:name="name"
          v-model:location="location"
          v-model:startTime="startTime"
          v-model:endTime="endTime"
          v-model:color="color"
          @delete="deleteEvent"
        />
        <div style="width: 100%; height: 100%; position: relative">
          <MarkdownPlatform v-model:text="description" :color="color"></MarkdownPlatform>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

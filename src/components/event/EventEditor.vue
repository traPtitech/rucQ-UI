<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import EventEditorSettings from './EventEditorSettings.vue'
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()
import { apiClient } from '@/api/apiClient'
import { useCampStore, useUserStore } from '@/store'
import { useRoute } from 'vue-router'
import MarkdownPlatform from '@/components/markdown/MarkdownPlatform.vue'

const campStore = useCampStore()
const route = useRoute()
const userStore = useUserStore()

const displayCamp = computed(() => {
  return campStore.getCampByDisplayId(route.params.campname as string)
})

const emit = defineEmits(['close', 'refresh'])

import type { components } from '@/api/schema'
type DurationEvent = components['schemas']['DurationEventResponse']
const props = defineProps<{ event: DurationEvent | null }>()

const isValid = computed(() => {
  if (!name.value) return false
  if (!location.value) return false
  if (!startTime.value) return false
  if (!endTime.value) return false
  return true
})

const tab = ref('')
const color = ref<'orange' | 'green' | 'red' | 'blue' | 'purple' | 'pink'>('orange')
const name = ref('')
const location = ref('')
const startTime = ref<Date>()
const endTime = ref<Date>()
const description = ref('')

const dateToText = (date: Date) => {
  const isoString = new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString()
  return isoString.replace('Z', '+09:00') // 日本時間
}

const createEvent = async () => {
  await apiClient.POST('/api/camps/{campId}/events', {
    params: { path: { campId: displayCamp.value.id } },
    body: {
      type: 'duration',
      name: name.value,
      description: description.value,
      location: location.value,
      timeStart: dateToText(startTime.value!),
      timeEnd: dateToText(endTime.value!),
      displayColor: color.value,
      organizerId: userStore.user.id,
    },
  })
  emit('refresh')
}

const editEvent = async () => {
  await apiClient.PUT('/api/events/{eventId}', {
    params: { path: { eventId: props.event!.id } },
    body: {
      type: 'duration',
      name: name.value,
      description: description.value,
      location: location.value,
      timeStart: dateToText(startTime.value!),
      timeEnd: dateToText(endTime.value!),
      displayColor: color.value,
      organizerId: userStore.user.id,
    },
  })
  emit('refresh')
}

const deleteEvent = async () => {
  await apiClient.DELETE('/api/events/{eventId}', {
    params: { path: { eventId: props.event!.id } },
  })
  emit('refresh')
}

onMounted(async () => {
  if (props.event) {
    color.value = props.event.displayColor
    name.value = props.event.name
    location.value = props.event.location
    startTime.value = new Date(props.event.timeStart)
    endTime.value = new Date(props.event.timeEnd)
    description.value = props.event.description
  } else {
    startTime.value = new Date(displayCamp.value.dateStart)
    endTime.value = new Date(displayCamp.value.dateStart)
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
          density="comfortable"
          elevation="0"
          icon="mdi-close"
          class="text-black"
          style="margin: 10px"
          @click="emit('close')"
        ></v-btn>
        <v-btn
          elevation="0"
          append-icon="mdi-check"
          variant="flat"
          :color="color"
          :disabled="!isValid"
          style="font-size: 16px; margin: 10px"
          @click="props.event ? editEvent() : createEvent()"
          >{{ props.event ? '更新' : '作成' }}</v-btn
        >
      </div>
      <v-tabs v-if="smAndDown" v-model="tab" :class="`flex-shrink-0 text-${color}`">
        <v-tab value="設定" width="50%"><span style="font-weight: bold">設 定</span></v-tab>
        <v-tab value="概要" width="50%"><span style="font-weight: bold">概 要</span></v-tab>
      </v-tabs>

      <v-tabs-window v-if="smAndDown" v-model="tab" style="height: 100%; flex-shrink: 1">
        <v-tabs-window-item value="設定" style="height: 100%; padding: 20px">
          <event-editor-settings
            v-model:name="name"
            v-model:location="location"
            v-model:start-time="startTime"
            v-model:end-time="endTime"
            v-model:color="color"
            :event="event"
            :camp="displayCamp"
            @delete="deleteEvent"
          />
        </v-tabs-window-item>

        <v-tabs-window-item value="概要" style="height: 100%">
          <markdown-platform v-model:text="description" :color="color"></markdown-platform>
        </v-tabs-window-item>
      </v-tabs-window>

      <div v-else style="display: flex; width: 100%; height: 100%">
        <event-editor-settings
          v-model:name="name"
          v-model:location="location"
          v-model:start-time="startTime"
          v-model:end-time="endTime"
          v-model:color="color"
          :event="event"
          :camp="displayCamp"
          style="width: 400px; height: 100%; padding: 20px; flex-grow: 0"
          @delete="deleteEvent"
        />
        <div style="width: 100%; height: 100%; position: relative">
          <markdown-platform v-model:text="description" :color="color"></markdown-platform>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

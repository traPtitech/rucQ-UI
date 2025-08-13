<script setup lang="ts">
import EventEditorSettings from './EventEditorSettings.vue'
import MarkdownPlatform from '@/components/markdown/MarkdownPlatform.vue'
import { ref, onMounted, computed } from 'vue'
import { useDisplay } from 'vuetify'
const { smAndDown } = useDisplay()
import { apiClient } from '@/api/apiClient'
import { useCampStore, useUserStore } from '@/store'
import { useRoute } from 'vue-router'
import type { components } from '@/api/schema'
import { dateToText } from '@/lib/date'

const route = useRoute()
const campStore = useCampStore()
const userStore = useUserStore()

const displayCamp = computed(() => {
  return campStore.getCampByDisplayId(route.params.campname as string)
})

// TODO: refresh の実装
const emit = defineEmits(['close', 'refresh'])

// rucQ-UI で編集可能なのは DurationEvent のみ。他は rucQ-Admin で編集
type DurationEvent = components['schemas']['DurationEventResponse']
const props = defineProps<{ event: DurationEvent | null }>()

const isValid = computed(() => {
  if (!name.value) return false
  if (!location.value) return false
  if (!startTime.value) return false
  if (!endTime.value) return false
  if (startTime.value.getTime() >= endTime.value.getTime()) return false
  console.log(startTime.value, endTime.value)
  return true
})

// 縦長の画面のとき、選択中のタブ
const tab = ref<'options' | 'description'>('options')

// イベントの設定項目
const color = ref<DurationEvent['displayColor']>('orange')
const name = ref('')
const location = ref('')
const startTime = ref<Date>()
const endTime = ref<Date>()
const description = ref('')

// イベントの作成と更新
const saveEvent = async () => {
  if (startTime.value === undefined || endTime.value === undefined) {
    throw new Error('イベントの開始時間または終了時間が未設定です')
  }

  const buildEventBody = {
    type: 'duration' as const,
    name: name.value,
    description: description.value,
    location: location.value,
    timeStart: dateToText(startTime.value),
    timeEnd: dateToText(endTime.value),
    displayColor: color.value,
    organizerId: userStore.user.id,
  }

  if (props.event) {
    await apiClient.PUT('/api/events/{eventId}', {
      params: { path: { eventId: props.event.id } },
      body: buildEventBody,
    })
  } else {
    await apiClient.POST('/api/camps/{campId}/events', {
      params: { path: { campId: displayCamp.value.id } },
      body: buildEventBody,
    })
  }
  emit('refresh')
}

// イベントの削除
const deleteEvent = async (event: DurationEvent) => {
  await apiClient.DELETE('/api/events/{eventId}', {
    params: { path: { eventId: event.id } },
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
    // color, name, location, description は初期値通り
    startTime.value = new Date(displayCamp.value.dateStart)
    endTime.value = new Date(displayCamp.value.dateStart)
    endTime.value.setDate(endTime.value.getDate() + 1)
    endTime.value.setMinutes(endTime.value.getMinutes() - 1)
  }
})
</script>

<template>
  <div class="h-100">
    <v-sheet class="h-100 bg-white d-flex flex-column position-relative">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          density="comfortable"
          elevation="0"
          icon="mdi-close"
          class="text-black ma-2"
          @click="emit('close')"
        ></v-btn>
        <v-btn
          elevation="0"
          append-icon="mdi-check"
          variant="flat"
          :color="color"
          :disabled="!isValid"
          :class="$style.saveButton"
          @click="saveEvent"
          >{{ props.event ? '更新' : '作成' }}</v-btn
        >
      </div>
      <v-tabs v-if="smAndDown" v-model="tab" :class="`flex-shrink-0 text-${color}`">
        <v-tab value="options" width="50%">
          <span :class="$style.tabTitle">設定</span>
        </v-tab>
        <v-tab value="description" width="50%">
          <span :class="$style.tabTitle">概要</span>
        </v-tab>
      </v-tabs>
      <v-tabs-window v-if="smAndDown" v-model="tab" class="h-100 flex-shrink-1">
        <v-tabs-window-item value="options" class="h-100 pa-5">
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
        <v-tabs-window-item value="description" class="h-100">
          <markdown-platform v-model:text="description" :color="color" />
        </v-tabs-window-item>
      </v-tabs-window>
      <div v-else class="d-flex w-100 h-100">
        <event-editor-settings
          v-model:name="name"
          v-model:location="location"
          v-model:start-time="startTime"
          v-model:end-time="endTime"
          v-model:color="color"
          :event="event"
          :camp="displayCamp"
          :class="$style.desktopSettings"
          @delete="deleteEvent"
        />
        <div class="w-100 h-100 position-relative">
          <markdown-platform v-model:text="description" :color="color" />
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<style module>
.saveButton {
  font-size: 16px;
  margin: 8px;
}

.tabTitle {
  font-weight: bold;
  letter-spacing: 0.5em;
}

.desktopSettings {
  width: 400px;
  height: 100%;
  padding: 20px;
  flex-grow: 0;
  flex-shrink: 0;
}
</style>

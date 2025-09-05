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
import { dateToText, dateDiffInDaysJST, getJSTDate } from '@/utility/date'
import { EVENT_COLORS } from '@/utility/eventColors'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { qk } from '@/api/queries/keys'

const route = useRoute()
const campStore = useCampStore()
const userStore = useUserStore()

const queryClient = useQueryClient()

const displayCamp = computed(() => {
  return campStore.getCampByDisplayId(route.params.campname as string)
})

const emit = defineEmits(['close'])

// rucQ-UI で編集可能なのは DurationEvent のみ。他は rucQ-Admin で編集
type DurationEvent = components['schemas']['DurationEventResponse']
const props = defineProps<{ event: DurationEvent | null }>()

const isValid = computed(() => {
  // dayNum, color はデフォルトで値が設定されているため審査を省略
  if (!name.value) return false
  if (!location.value) return false
  if (!organizerId.value) return false
  if (startMinute.value === undefined) return false
  if (endMinute.value === undefined) return false
  if (startMinute.value >= endMinute.value) return false
  return true
})

// 縦長の画面のとき、選択中のタブ
const tab = ref<'options' | 'description'>('options')

// イベントの設定項目
const name = ref('')
const location = ref('')
const color = ref<DurationEvent['displayColor']>('orange')
const organizerId = ref<string>('')

const dayNum = ref<number>(0) // 0-indexed
const startMinute = ref<number | undefined>()
const endMinute = ref<number | undefined>()

const description = ref('')

// イベントの作成と更新
const saveEvent = async () => {
  if (startMinute.value === undefined || endMinute.value === undefined) {
    throw new Error('イベントの開始時間・終了時間のいずれかが未設定です')
  }

  // dayNum, startMinute, endMinute を基に JST の Date を生成
  const baseDate = getJSTDate(displayCamp.value.dateStart)
  baseDate.setDate(baseDate.getDate() + dayNum.value)

  const startTime = new Date(baseDate)
  startTime.setHours(Math.floor(startMinute.value / 60), startMinute.value % 60, 0, 0)
  const endTime = new Date(baseDate)
  endTime.setHours(Math.floor(endMinute.value / 60), endMinute.value % 60, 0, 0)

  const buildEventBody = {
    type: 'duration' as const,
    name: name.value,
    description: description.value,
    location: location.value,
    timeStart: dateToText(startTime),
    timeEnd: dateToText(endTime),
    displayColor: color.value,
    organizerId: organizerId.value,
  }

  await upsertEventMutation.mutateAsync(buildEventBody)
  emit('close') // Editor ダイアログを閉じる
}

// イベントの削除
const deleteEvent = async () => {
  if (!props.event) return
  await deleteEventMutation.mutateAsync()
  emit('close') // Editor ダイアログを閉じる
}

onMounted(() => {
  if (props.event) {
    color.value = props.event.displayColor
    name.value = props.event.name
    location.value = props.event.location
    description.value = props.event.description
    organizerId.value = props.event.organizerId

    const startDate = new Date(props.event.timeStart)
    startMinute.value = startDate.getHours() * 60 + startDate.getMinutes()
    const endDate = new Date(props.event.timeEnd)
    endMinute.value = endDate.getHours() * 60 + endDate.getMinutes()

    const campStartDate = new Date(displayCamp.value.dateStart)
    startDate.setHours(0, 0, 0, 0)
    dayNum.value = dateDiffInDaysJST(campStartDate, startDate)
  } else {
    organizerId.value = userStore.user.id
    color.value = EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)] // 色をランダムで初期化
  }
})

// Mutations
const upsertEventMutation = useMutation({
  mutationFn: async (body: {
    type: 'duration'
    name: string
    description: string
    location: string
    timeStart: string
    timeEnd: string
    displayColor: components['schemas']['DurationEventResponse']['displayColor']
    organizerId: string
  }) => {
    if (props.event) {
      const { error } = await apiClient.PUT('/api/events/{eventId}', {
        params: { path: { eventId: props.event.id } },
        body,
      })
      if (error) throw error
    } else {
      const { error } = await apiClient.POST('/api/camps/{campId}/events', {
        params: { path: { campId: displayCamp.value.id } },
        body,
      })
      if (error) throw error
    }
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: qk.camps.events(displayCamp.value.id) })
  },
})

const deleteEventMutation = useMutation({
  mutationFn: async () => {
    if (!props.event) return
    const { error } = await apiClient.DELETE('/api/events/{eventId}', {
      params: { path: { eventId: props.event.id } },
    })
    if (error) throw error
  },
  onSuccess: async () => {
    await queryClient.invalidateQueries({ queryKey: qk.camps.events(displayCamp.value.id) })
  },
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
            v-model:color="color"
            v-model:organizer-id="organizerId"
            v-model:day-num="dayNum"
            v-model:start-minute="startMinute"
            v-model:end-minute="endMinute"
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
          v-model:color="color"
          v-model:organizer-id="organizerId"
          v-model:day-num="dayNum"
          v-model:start-minute="startMinute"
          v-model:end-minute="endMinute"
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

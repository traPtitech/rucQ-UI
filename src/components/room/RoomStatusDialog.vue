<script setup lang="ts">
import { RoomStatusType } from '@/api/generated/client.schemas'
import type { RoomResponse as Room, RoomStatus } from '@/api/generated/client.schemas'

import { computed, ref, watch } from 'vue'
import {
  useGetRoomStatusLogs,
  usePutRoomStatus,
  getGetRoomStatusLogsQueryKey,
  getGetRoomGroupsQueryKey,
} from '@/api/generated/client'
import UserIcon from '@/components/generic/UserIcon.vue'
import { useQueryClient } from '@tanstack/vue-query'
import { getDisplayDate } from '@/utils/date'

const props = defineProps<{
  room: Room
  campId: number
}>()

const emit = defineEmits<{
  close: []
}>()

const status = ref<RoomStatus['type']>(null)
const word = ref('')

watch(
  () => props.room.status,
  (nextStatus) => {
    status.value = nextStatus.type
    word.value = nextStatus.topic
  },
  { immediate: true },
)

const showHistory = ref(false)

const queryClient = useQueryClient()

const { data: statusHistory } = useGetRoomStatusLogs(() => props.room.id)
const updateRoomStatus = usePutRoomStatus()

const formatStatusTime = (updatedAt: string) => getDisplayDate(new Date(updatedAt))

const getStatusColor = (type: RoomStatus['type']) => {
  switch (type) {
    case RoomStatusType.active:
      return 'green'
    case RoomStatusType.inactive:
      return 'red'
    default:
      return 'grey'
  }
}

// 64 文字制限。超えると Bad Request
const isWordTooLong = computed(() => Array.from(word.value).length > 64)

const isDisabled = computed(() => {
  const statusChanged = status.value !== props.room.status.type
  const topicChanged = word.value !== props.room.status.topic
  return isWordTooLong.value || (!statusChanged && !topicChanged)
})

const updateStatus = async () => {
  await updateRoomStatus.mutateAsync({
    roomId: props.room.id,
    data: { type: status.value, topic: word.value },
  })

  await queryClient.invalidateQueries({ queryKey: getGetRoomStatusLogsQueryKey(props.room.id) })
  await queryClient.invalidateQueries({ queryKey: getGetRoomGroupsQueryKey(props.campId) })
  emit('close') // 更新後すぐダイアログを閉じる
}
</script>

<template>
  <v-card class="pa-4">
    <div class="d-flex flex-column align-center mb-2">
      <div :class="[$style.room, 'text-primary']">{{ room.name }}</div>
    </div>
    <div class="d-flex ga-2 justify-center mb-2">
      <user-icon
        v-for="member in room.members"
        :id="member.id"
        :key="member.id"
        :size="28"
        id-tooltip
      />
    </div>
    <v-radio-group v-model="status" hide-details class="my-2">
      <div class="d-flex">
        <v-radio label="アクティブ" :value="RoomStatusType.active" color="green" />
        <v-radio label="休憩中" :value="RoomStatusType.inactive" color="red" />
      </div>
    </v-radio-group>
    <v-textarea
      v-model="word"
      rows="3"
      variant="outlined"
      label="ひとこと"
      :rules="[(value) => !isWordTooLong || 'ひとことが長すぎます']"
    />
    <v-card
      v-if="statusHistory && statusHistory.length > 0"
      class="mt-2 rounded font-weight-medium flex-shrink-0"
      variant="text"
      role="button"
      @click="showHistory = !showHistory"
    >
      <div class="w-100 pa-2 d-flex align-center justify-space-between">
        <div class="d-flex align-center ga-2">
          <v-icon icon="mdi-history" />
          履歴を見る
        </div>
        <v-icon :icon="showHistory ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
      </div>
    </v-card>
    <v-expand-transition>
      <div
        v-show="showHistory"
        class="rounded overflow-hidden flex-column bg-background"
        style="display: flex"
      >
        <!-- d-flex を用いると v-show を上書きしてしまう -->
        <div class="pa-3 overflow-y-auto h-100 d-flex flex-column ga-2">
          <div v-for="log in statusHistory" :key="log.updatedAt">
            <div class="font-weight-bold text-caption text-grey">
              {{ formatStatusTime(log.updatedAt) }} - {{ log.operatorId }}
            </div>
            <div :class="$style.status" class="d-flex">
              <div :class="[$style.statusMark, `bg-${getStatusColor(log.type)}`]"></div>
              <span class="text-body-2 font-weight-medium" :class="$style.statusText">
                {{ log.topic || '未設定' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </v-expand-transition>
    <v-btn class="mt-2" variant="flat" color="primary" :disabled="isDisabled" @click="updateStatus">
      更新
    </v-btn>
  </v-card>
</template>

<style module>
.room {
  font-family: 'Reddit Sans Variable', 'M PLUS 2 Variable', sans-serif;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 3px;
}

.status {
  margin-top: 0px;
}

.statusMark {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  margin-right: 4px;
  border: 2px solid white;
  vertical-align: middle;
  margin-top: 2px;
}

.statusText {
  overflow-wrap: anywhere;
  word-break: break-word;
}
</style>

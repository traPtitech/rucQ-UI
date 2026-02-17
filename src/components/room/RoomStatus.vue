<script setup lang="ts">
import { ref, watch } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import UserIcon from '@/components/generic/UserIcon.vue'

type Room = components['schemas']['RoomResponse']
type RoomStatus = components['schemas']['RoomStatus']

const props = defineProps<{
  room: Room
}>()

const emit = defineEmits<{
  close: []
  updated: []
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

const updateStatus = async () => {
  const { error } = await apiClient.PUT('/api/rooms/{roomId}/status', {
    params: { path: { roomId: props.room.id } },
    body: {
      type: status.value,
      topic: word.value,
    },
  })
  if (error) throw new Error(`部屋ステータスの更新に失敗しました: ${error.message}`)

  emit('updated')
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
        <v-radio label="アクティブ" value="active" color="green" />
        <v-radio label="休憩中" value="inactive" color="red" />
      </div>
    </v-radio-group>
    <v-textarea v-model="word" rows="3" variant="outlined" label="ひとこと" hide-details />
    <v-btn class="mt-2" variant="flat" color="primary" @click="updateStatus">更新</v-btn>
  </v-card>
</template>

<style module>
.room {
  font-family: 'Reddit Sans Variable' 'M PLUS 2 Variable' sans-serif;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 3px;
}
</style>

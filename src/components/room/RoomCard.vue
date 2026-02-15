<script setup lang="ts">
import type { components } from '@/api/schema'
import UserIcon from '@/components/generic/UserIcon.vue'
import { useUserStore } from '@/store'
import { computed } from 'vue'

type Room = components['schemas']['RoomResponse']

const props = defineProps<{
  room: Room
}>()

const userStore = useUserStore()

const isMyRoom = (room: Room) => {
  return room.members.some((member) => member.id === userStore.user.id)
}

const lineColor = computed(() => (isMyRoom(props.room) ? 'primaryLight' : 'primary'))
const lineColorText = computed(() => `rgb(var(--v-theme-${lineColor.value}))`)
</script>

<template>
  <v-card
    elevation="0"
    :color="isMyRoom(room) ? 'primary' : 'primaryLight'"
    class="ma-2 pa-2"
    :class="$style.card"
  >
    <div class="h-100 position-relative d-flex flex-column justify-center">
      <v-card-title class="text-center pa-0">
        <span
          :class="$style.roomName"
          :style="{ color: isMyRoom(room) ? 'white' : 'rgb(var(--v-theme-primary))' }"
        >
          {{ room.name }}
        </span>
      </v-card-title>
      <div v-if="isMyRoom(room)" class="w-100 h-100 d-flex flex-wrap justify-center align-center">
        <user-icon :size="26" class="ma-1" :class="$style.userIcon" />
        <user-icon
          v-for="user in room.members.filter((u) => u.id !== userStore.user.id)"
          :id="user.id"
          :key="user.id"
          :size="26"
          class="ma-1"
          id-tooltip
        />
      </div>
      <div v-else class="w-100 h-100 d-flex flex-wrap justify-center align-center">
        <user-icon
          v-for="user in room.members"
          :id="user.id"
          :key="user.id"
          :size="26"
          class="ma-1"
          id-tooltip
        />
      </div>
      <div :class="$style.status">
        <div :class="[$style.statusMark, 'bg-red']"></div>
        <span class="text-caption font-weight-medium" :class="$style.statusText">
          すやすやすやすやすやすやすやすやすやすや
        </span>
      </div>
    </div>
  </v-card>
</template>

<style module>
.card {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  margin: 0 4px;
  transition: none !important;
}

.roomName {
  font-family: 'Reddit Sans Variable';
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.1em;
  margin-right: -0.1em;
}

.userIcon {
  box-sizing: content-box;
  border: 2px solid white;
}

.status {
  width: 100%;
  margin-top: 8px;
  border-top: 1px solid v-bind(lineColorText);
}

.statusMark {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 4px;
  border: 2px solid white;
  vertical-align: middle;
}

.statusText {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;
  max-width: calc(100% - 20px);
}
</style>

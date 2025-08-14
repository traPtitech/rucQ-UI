<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import UserIcon from '@/components/generic/UserIcon.vue'
import { useCampStore, useUserStore } from '@/store'
import { useRoute } from 'vue-router'

const route = useRoute()
const campStore = useCampStore()
const userStore = useUserStore()

const displayCamp = computed(() => {
  return campStore.getCampByDisplayId(route.params.campname as string)
})

type RoomGroup = components['schemas']['RoomGroupResponse']

const roomGroups = ref<RoomGroup[]>([])

const getRoomGroups = async () => {
  const { data, error } = await apiClient.GET('/api/camps/{campId}/room-groups', {
    params: { path: { campId: displayCamp.value.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch room groups')
  return data
}

const isMyRoom = (room: components['schemas']['RoomResponse']) => {
  return room.members.some((member) => member.id === userStore.user.id)
}

onMounted(async () => {
  roomGroups.value = await getRoomGroups()
})
</script>

<template>
  <div :class="$style.container">
    <div v-for="group in roomGroups" :key="group.id" class="d-flex flex-column align-center">
      <div :class="$style.floorName">
        <span :class="$style.floorNameText">{{ group.name }}</span>
      </div>
      <div :class="$style.roomGrid">
        <v-card
          v-for="room in group.rooms"
          :key="room.id"
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
            <div
              v-if="isMyRoom(room)"
              class="w-100 h-100 d-flex flex-wrap justify-center align-center"
            >
              <user-icon :id="userStore.user.id" :size="26" class="ma-1" :class="$style.userIcon" />
              <user-icon
                v-for="user in room.members.filter((u) => u.id !== userStore.user.id)"
                :id="user.id"
                :key="user.id"
                :size="26"
                class="ma-1"
              />
            </div>
            <div v-else class="w-100 h-100 d-flex flex-wrap justify-center align-center">
              <user-icon
                v-for="user in room.members"
                :id="user.id"
                :key="user.id"
                :size="26"
                class="ma-1"
              />
            </div>
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<style module>
.container {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 0;
}

.card {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  margin: 0 4px;
  transition: none !important;
}

.floorName {
  width: 240px;
  text-align: center;
  padding-top: 16px;
  padding-bottom: 4px;
  border-bottom: 1px solid black;
}

.floorNameText {
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 0.1em;
  margin-right: -0.1em;
}

.roomGrid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin: 8px;
}

.roomName {
  font-family: 'Reddit Sans';
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.1em;
  margin-right: -0.1em;
}

.userIcon {
  box-sizing: content-box;
  border: 2px solid white;
}
</style>

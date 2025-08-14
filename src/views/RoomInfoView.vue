<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import UserIcon from '@/components/generic/UserIcon.vue'
import { useCampStore } from '@/store'
import { useRoute } from 'vue-router'

const route = useRoute()
const campStore = useCampStore()

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

onMounted(async () => {
  roomGroups.value = await getRoomGroups()
})
</script>

<template>
  <div :class="$style.container">
    <div v-for="group in roomGroups" :key="group.id">
      <div :class="$style.floorName">{{ group.name }}</div>
      <div :class="$style.roomGrid">
        <div v-for="room in group.rooms" :key="room.id">
          <v-card elevation="0" color="primaryLight" class="ma-2 pa-2">
            <v-card-title class="text-center pa-0">
              <span :class="$style.roomName">
                {{ room.name }}
              </span>
            </v-card-title>
            <div class="w-100 d-flex flex-wrap justify-center">
              <user-icon
                v-for="user in room.members"
                :id="user.id"
                :key="user.id"
                :size="30"
                class="ma-1"
              />
            </div>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.container {
  position: relative;
  max-width: 800px;
  margin: 16px auto;
}

.floorName {
  width: 200px;
  font-weight: bold;
  font-size: 20px;
  border-bottom: 1px solid black;
  margin-left: 16px;
}

.roomName {
  font-weight: 900;
  font-size: 20px;
  color: rgb(var(--v-theme-primary));
}

.link {
  display: block;
  width: 100%;
  text-align: center;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 4;
}

.roomGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  margin: 8px;
}

.link:hover {
  text-decoration: underline;
}

.roomName {
  font-weight: 900;
  font-size: 24px;
  letter-spacing: 0.5em;
  color: rgb(var(--v-theme-primary));
}
</style>

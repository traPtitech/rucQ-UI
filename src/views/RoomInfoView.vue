<script setup lang="ts">
import { apiClient } from '@/api/apiClient'
import type { components } from '@/api/schema'
import RoomCard from '@/components/room/RoomCard.vue'
import { useCampStore } from '@/store'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { qk } from '@/api/queries/keys'

const route = useRoute()
const campStore = useCampStore()

const displayCamp = campStore.getCampByDisplayId(route.params.campname as string)

type RoomGroup = components['schemas']['RoomGroupResponse']

const {
  data: roomGroups,
  isPending,
  isFetching,
} = useQuery<RoomGroup[], Error>({
  queryKey: qk.camps.roomGroups(displayCamp.id),
  queryFn: async () => {
    const { data, error } = await apiClient.GET('/api/camps/{campId}/room-groups', {
      params: { path: { campId: displayCamp.id } },
    })
    if (error) throw new Error(`部屋割情報の取得に失敗しました: ${error.message}`)
    return data
  },
})
</script>

<template>
  <div class="position-relative w-100 h-100">
    <!-- Loading -->
    <div
      v-if="!roomGroups || (roomGroups.length === 0 && (isPending || isFetching))"
      class="d-flex flex-column align-center justify-center w-100 h-100"
    >
      <v-progress-circular indeterminate size="56" color="primary" class="mb-3" />
      <h3 class="font-weight-bold">部屋割を読み込み中…</h3>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="roomGroups && roomGroups.length === 0"
      class="d-flex flex-column align-center justify-center w-100 h-100"
    >
      <v-icon size="64" class="mb-2" icon="mdi-view-grid" />
      <h3 class="font-weight-bold">{{ displayCamp.name }}の部屋割は未定です</h3>
    </div>

    <!-- Content -->
    <div v-else :class="$style.content">
      <div
        v-for="group in roomGroups || []"
        :key="group.id"
        class="d-flex flex-column align-center"
      >
        <div :class="$style.floorName">
          <span :class="$style.floorNameText">{{ group.name }}</span>
        </div>
        <div :class="$style.roomGrid">
          <room-card v-for="room in group.rooms" :key="room.id" :room="room" />
        </div>
      </div>
    </div>
  </div>
</template>

<style module>
.content {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 8px;
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
</style>
floorName { width: 240px; text-align: center; padding-top: 16px; padding-bottom: 4px; border-bottom:
1px solid black; } .floorNameText { font-weight: bold; font-size: 16px; letter-spacing: 0.1em;
margin-right: -0.1em; } .roomGrid { width: 100%; display: grid; grid-template-columns:
repeat(auto-fit, minmax(160px, 1fr)); margin: 8px

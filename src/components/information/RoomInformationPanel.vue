<script setup lang="ts">
// import { sampleRooms } from '@/lib/sample-data'
import { ref, computed, onMounted } from 'vue'
import UserIcon from '@/components/generic/UserIcon.vue'
import LinkText from '@/components/generic/LinkText.vue'
import RoomMemberDialog from '@/components/information/RoomMemberDialog.vue'
import { apiClient } from '@/api/apiClient'
import { useRoute } from 'vue-router'
import type { components } from '@/api/schema'
import { useUserStore, useCampStore } from '@/store'
import { storeToRefs } from 'pinia'
const route = useRoute()

const { camp } = storeToRefs(useCampStore())
const { user } = storeToRefs(useUserStore())

type Room = components['schemas']['Room']

const rooms = ref<Room[]>()
const myRoom = computed(() => {
  return rooms.value?.find((room) =>
    room.members.some((member) => member.traq_id === user.value?.traq_id),
  )
})

onMounted(async () => {
  rooms.value = (await apiClient.GET('/api/rooms')).data!.filter(
    (room) => room.camp_id === camp.value?.id,
  )
})
</script>

<template>
  <div v-if="myRoom">
    <v-dialog max-width="400">
      <template v-slot:activator="{ props: activatorProps }">
        <v-card elevation="0" v-bind="activatorProps" color="themePale" class="mx-4 mt-4 pa-4">
          <v-card-title :class="$style.roomName">{{ myRoom.name }} </v-card-title>
          <div class="w-100 d-flex justify-center">
            <UserIcon
              v-for="user in myRoom.members"
              :key="user.traq_id"
              :id="user.traq_id"
              :size="30"
              style="margin: 4px"
            />
          </div>
        </v-card>
      </template>
      <template v-slot:default="{}">
        <RoomMemberDialog :room="myRoom" />
      </template>
    </v-dialog>

    <LinkText :to="`/${route.params.campname}/info/users`" text="合宿メンバーの部屋一覧" />
  </div>

  <v-card elevation="0" v-else color="ashPale" class="ma-4 pa-4">
    <v-card-title class="text-center pa-0">
      <span style="font-weight: bold; font-size: 24px; color: var(--color-ash)">未登録</span>
    </v-card-title>
    <v-card-text class="text-center pa-0">
      <span style="font-weight: bold; color: var(--color-ash)"> 部屋情報が登録されていません </span>
    </v-card-text>
  </v-card>
</template>

<style module>
.roomName {
  padding: 0;
  text-align: center;
  font-weight: 900;
  font-size: 24px;
  letter-spacing: 0.5em;
  margin-right: -0.5em;
  color: var(--color-theme);
}
</style>

<script setup lang="ts">
import { apiClient } from '@/api/apiClient'
import { ref, onMounted, watch, nextTick } from 'vue'
import UserIcon from '@/components/generic/UserIcon.vue'
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'

const { camp } = storeToRefs(useCampStore())

const rooms = ref<{ id: number; name: string; camp_id: number; members: string[] }[]>([])
const forAdd = ref({ name: '', camp_id: camp.value!.id, members: [] as string[] })
const isReady = ref(false)

const refresh = async () => {
  for (const room of (await apiClient.GET('/api/rooms')!).data!) {
    rooms.value.push({
      id: room.id,
      name: room.name,
      camp_id: room.camp_id,
      members: Array.from(room.members, (member) => member.traq_id),
    })
  }
  nextTick(() => {
    isReady.value = true
  })
}

watch(
  () => JSON.parse(JSON.stringify(rooms.value)),
  async (
    newRooms: { id: number; name: string; camp_id: number; members: string[] }[],
    oldRooms: { id: number; name: string; camp_id: number; members: string[] }[],
  ) => {
    if (!isReady.value) return
    if (oldRooms.length) if (newRooms.length !== oldRooms.length) return // 増えたり減ったりしたら別で対応している
    for (let i = 0; i < newRooms.length; i++) {
      if (
        !(
          newRooms[i].name === oldRooms[i].name &&
          newRooms[i].members.length === oldRooms[i].members.length &&
          newRooms[i].members.every((value, index) => value === oldRooms[i].members[index])
        )
      ) {
        // console.log(newRooms[i].members, oldRooms[i].members)
        await apiClient.PUT('/api/rooms/{room_id}', {
          params: { path: { room_id: newRooms[i].id } },
          body: {
            name: newRooms[i].name,
            camp_id: newRooms[i].camp_id,
            members: newRooms[i].members,
          },
        })
      }
    }
    // await refresh()
  },
  { deep: true },
)

const addRoom = async () => {
  await apiClient.POST('/api/rooms', {
    body: {
      name: forAdd.value.name,
      camp_id: forAdd.value.camp_id,
      members: forAdd.value.members,
    },
  })
  forAdd.value = { name: '', camp_id: camp.value!.id, members: [] as string[] }
  await refresh()
}

onMounted(refresh)
</script>

<template>
  <div style="width: 100%; display: grid; grid-template-columns: 60px 100px 10px 1fr">
    <v-text-field
      v-for="room in rooms"
      :key="room.id"
      :style="`grid-row: ${room.id + 1}; grid-column: 2`"
      variant="underlined"
      hide-details
      v-model="room.name"
    ></v-text-field>
    <v-combobox
      v-for="room in rooms"
      :key="room.id"
      :style="`grid-row: ${room.id + 1}; grid-column: 4`"
      variant="underlined"
      hide-details
      v-model="room.members"
      multiple
    >
      <template v-slot:selection="{ item }">
        <v-chip size="small">
          <template v-slot:prepend>
            <UserIcon :size="20" :id="item.title" style="margin-right: 6px"></UserIcon>
          </template>
          {{ item.title }}
        </v-chip>
      </template>
    </v-combobox>

    <v-btn
      density="comfortable"
      icon="mdi-plus"
      variant="text"
      style="grid-row: 10000; grid-column: 1; align-self: flex-end; justify-self: center"
      @click="addRoom"
    ></v-btn>

    <v-text-field
      style="grid-row: 10000; grid-column: 2"
      variant="underlined"
      hide-details
      v-model="forAdd.name"
    ></v-text-field>
    <v-combobox
      style="grid-row: 10000; grid-column: 4"
      variant="underlined"
      hide-details
      v-model="forAdd.members"
      multiple
    >
      <template v-slot:selection="{ item }">
        <v-chip size="small">
          <template v-slot:prepend>
            <UserIcon :size="20" :id="item.title" style="margin-right: 6px"></UserIcon>
          </template>
          {{ item.title }}
        </v-chip>
      </template>
    </v-combobox>
  </div>
</template>

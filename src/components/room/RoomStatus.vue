<script setup lang="ts">
import { ref } from 'vue'
import type { components } from '@/api/schema'
import UserIcon from '@/components/generic/UserIcon.vue'
defineProps<{
  room: components['schemas']['RoomResponse']
}>()

const status = ref<'On' | 'Off'>()
const word = ref('')
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
    <v-select v-model="status" :items="['On', 'Off']" label="状態" variant="underlined" />
    <v-textarea v-model="word" rows="3" variant="outlined" label="ひとこと" />
    <v-btn class="mt-2" variant="flat" color="primary" @click="word = ''">更新</v-btn>
  </v-card>
</template>

<style module>
.room {
  font-family: 'Reddit Sans Variable';
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 3px;
}
</style>

<script setup lang="ts">
import type { components } from '@/api/schema'
import UserIcon from '@/components/generic/UserIcon.vue'

type Room = components['schemas']['Room']
defineProps<{ room: Room }>()

//
</script>

<template>
  <v-card color="themePale" class="pa-4">
    <v-card-title :class="$style.roomName">{{ room.name }} </v-card-title>
    <div style="border-bottom: 1px solid var(--color-theme); margin-bottom: 8px"></div>
    <div v-for="user in room.members" :key="user.traq_id" class="d-flex align-center">
      <UserIcon :id="user.traq_id" :size="30" class="ma-1" />
      <div class="ml-1 font-weight-bold">@{{ user.traq_id }}</div>
    </div>
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

<script setup lang="ts">
import type { components } from '@/api/schema'
import UserIcon from '@/components/generic/UserIcon.vue'

type Room = components['schemas']['RoomResponse']

defineProps<{ room?: Room }>()
</script>

<template>
  <div v-if="room" :class="$style.container">
    <div :class="$style.room">201</div>
    <div :class="$style.members">
      <user-icon
        v-for="member in room.members"
        :key="member.id"
        :user="member"
        :size="32"
        :class="$style.icon"
      />
    </div>
  </div>
</template>

<style module>
.container {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.room {
  font-family: 'Reddit Sans';
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 3px;
}

.members {
  display: flex;
  margin-top: 8px;
}

.icon {
  margin: 0 5px;
}
</style>

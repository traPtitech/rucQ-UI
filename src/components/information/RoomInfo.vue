<script setup lang="ts">
import UserIcon from '@/components/generic/UserIcon.vue'
import { useUserStore } from '@/store'
import type { Room } from '@/typeAliases'

const userStore = useUserStore()

defineProps<{ room?: Room }>()
</script>

<template>
  <div v-if="room" :class="$style.container">
    <div :class="$style.room">{{ room.name }}</div>
    <div :class="$style.members">
      <user-icon :size="32" class="mx-1" id-tooltip />
      <user-icon
        v-for="member in room.members.filter((u) => u.id !== userStore.user.id)"
        :id="member.id"
        :key="member.id"
        :size="32"
        class="mx-1"
        id-tooltip
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
  font-family: 'Reddit Sans Variable';
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 3px;
}

.members {
  display: flex;
  margin-top: 8px;
}
</style>

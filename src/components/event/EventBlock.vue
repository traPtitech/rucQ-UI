<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EventDialog from '@/components/event/EventDialog.vue'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'

const emit = defineEmits(['refresh'])

const { user } = storeToRefs(useUserStore())

import type { components } from '@/api/schema'
type CampEvent = components['schemas']['Event']
const props = defineProps<{ event: CampEvent }>()

const participants = ref<string[]>([])

onMounted(async () => {
  const participantsData = props.event.participants
  participants.value = Array.from(
    participantsData.filter((el) => el.traq_id !== user.value?.traq_id),
    (el) => el.traq_id,
  )
  if (participantsData.some((el) => el.traq_id === user.value?.traq_id)) {
    participants.value.unshift(user.value!.traq_id)
  }
})
</script>

<template>
  <div class="pa-1">
    <v-dialog max-width="800">
      <template v-slot:activator="{ props: activatorProps }">
        <v-card
          link
          :color="event.display_color"
          height="100%"
          variant="flat"
          v-bind="activatorProps"
          class="pa-2"
        >
          <h3 class="font-weight-bold white text-break">{{ props.event.name }}</h3>
          <h5 class="font-weight-medium white text-break">{{ props.event.location }}</h5>
        </v-card>
      </template>

      <template v-slot:default="{ isActive }">
        <EventDialog
          :event="event"
          @close="isActive.value = false"
          @refresh="emit('refresh')"
          v-model:participants="participants"
        />
      </template>
    </v-dialog>
  </div>
</template>

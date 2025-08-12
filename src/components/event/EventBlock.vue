<script setup lang="ts">
import { computed } from 'vue'
import type { components } from '@/api/schema'
import EventDialog from './EventDialog.vue'

type DurationEvent = components['schemas']['DurationEventResponse']
type OfficialEvent = components['schemas']['OfficialEventResponse']
const props = defineProps<{ event: DurationEvent | OfficialEvent }>()

const eventColor = computed(() => {
  return props.event.type === 'duration' ? props.event.displayColor : 'indigo'
})
</script>

<template>
  <div class="pa-1">
    <v-dialog max-width="800">
      <template #activator="{ props: activatorProps }">
        <v-card link :color="eventColor" variant="flat" class="pa-2 h-100" v-bind="activatorProps">
          <h4 class="font-weight-bold white text-break">{{ props.event.name }}</h4>
          <h5 class="font-weight-medium white text-break">{{ props.event.location }}</h5>
        </v-card>
      </template>
      <template #default="{ isActive }">
        <event-dialog :event="event" :color="eventColor" @close="isActive.value = false" />
      </template>
    </v-dialog>
  </div>
</template>

<style module>
.momentText {
  font-weight: 500;
  padding-left: 4px;
  cursor: pointer;
}

.momentText:hover {
  text-decoration: underline;
}
</style>

<script setup lang="ts">
import type { components } from '@/api/schema'

type DurationEvent = components['schemas']['DurationEventResponse']
type OfficialEvent = components['schemas']['OfficialEventResponse']
const props = defineProps<{ event: DurationEvent | OfficialEvent }>()

const getColor = (event: DurationEvent | OfficialEvent) => {
  return event.type === 'duration' ? event.displayColor : 'indigo'
}
</script>

<template>
  <div class="pa-1">
    <v-card link :color="getColor(event)" height="100%" variant="flat" class="pa-2">
      <h3 class="font-weight-bold white text-break">{{ props.event.name }}</h3>
      <h5 class="font-weight-medium white text-break">{{ props.event.location }}</h5>
    </v-card>
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

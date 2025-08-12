<script setup lang="ts">
import { computed } from 'vue'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import UserIcon from '@/components/generic/UserIcon.vue'
import { getTimeStringNoPad } from '@/lib/date'
import type { components } from '@/api/schema'

const emit = defineEmits(['close', 'refresh'])

type CampEvent = components['schemas']['EventResponse']
const props = defineProps<{ event: CampEvent; color: string }>()

const timeInfo = computed(() => {
  if (props.event.type === 'moment') {
    return getTimeStringNoPad(new Date(props.event.time))
  } else {
    return (
      getTimeStringNoPad(new Date(props.event.timeStart)) +
      ' - ' +
      getTimeStringNoPad(new Date(props.event.timeEnd))
    )
  }
})

const planner = computed(() => {
  if (props.event.type === 'duration') {
    return props.event.organizerId
  } else {
    return 'traP'
  }
})
</script>

<template>
  <v-card :class="`bg-grey-lighten-2`">
    <div :class="`d-flex justify-space-between bg-${props.color}`">
      <v-card rounded="0" elevation="0" :color="props.color" :class="$style.card">
        <template #title>
          <span class="font-weight-bold">{{ event.name }}</span>
        </template>
        <template #subtitle>
          <span :class="$style.timeInfo">{{ timeInfo }}</span>
          <span :class="$style.location">{{ event.location }}</span>
        </template>
      </v-card>
      <div class="d-flex flex-column pa-1">
        <v-btn
          density="comfortable"
          elevation="0"
          icon="mdi-close"
          base-color="transparent"
          class="text-white"
          @click="emit('close')"
        ></v-btn>
      </div>
    </div>
    <div class="w-100 overflow-y-auto bg-white position-relative pa-3">
      <markdown-preview :mdtext="props.event.description" />
    </div>
    <div class="d-flex justify-center h-100 overflow-hidden ga-2 ma-2">
      <user-icon :id="planner" :size="20" />
      <span :class="$style.plannerId">{{ '@' + planner }}</span>
    </div>
  </v-card>
</template>

<style module>
.card :global(.v-card-subtitle) {
  opacity: 1 !important;
}

.timeInfo {
  font-family: Roboto;
  font-weight: 500;
  font-size: 13px;
}

.location {
  margin-left: 6px;
  font-weight: 500;
}

.plannerId {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.05em;
  font-family: 'Reddit Sans';
}
</style>

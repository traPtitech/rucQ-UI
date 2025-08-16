<script setup lang="ts">
import { computed } from 'vue'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import UserIcon from '@/components/generic/UserIcon.vue'
import { getTimeStringNoPad } from '@/lib/date'
import type { components } from '@/api/schema'
import { useCampStore } from '@/store'
import { useRoute } from 'vue-router'

const emit = defineEmits(['edit', 'close'])

const campStore = useCampStore()
const route = useRoute()

const displayCamp = computed(() => {
  return campStore.getCampByDisplayId(route.params.campname as string)
})

const isOperable = computed(() => {
  return campStore.isOperable(displayCamp.value)
})

type CampEvent = components['schemas']['EventResponse']
const props = defineProps<{ event: CampEvent; color: string }>()

// イベントの時刻に関する文字列
const timeInfo = computed(() => {
  if (props.event.type === 'moment') {
    return getTimeStringNoPad(new Date(props.event.time))
  } else {
    const startTime = getTimeStringNoPad(new Date(props.event.timeStart))
    const endTime = getTimeStringNoPad(new Date(props.event.timeEnd))
    return `${startTime} - ${endTime}`
  }
})

// イベントの企画者。自主企画期間イベント（= duration）以外は traP とする
const planner = computed(() => {
  return props.event.type === 'duration' ? props.event.organizerId : 'traP'
})
</script>

<template>
  <v-card class="white">
    <div
      :class="[
        `d-flex align-center justify-space-between bg-${props.color}`,
        $style.colorTransition,
      ]"
    >
      <div class="pl-3" :class="$style.card">
        <span class="font-weight-bold text-h6">{{ event.name }}</span>
        <div :class="$style.card">
          <span :class="$style.timeInfo">{{ timeInfo }}</span>
          <span :class="$style.location">{{ event.location }}</span>
        </div>
      </div>
      <div class="d-flex flex-column pa-1" :class="$style.buttons">
        <v-btn
          density="comfortable"
          elevation="0"
          icon="mdi-close"
          base-color="transparent"
          class="text-white"
          @click="emit('close')"
        ></v-btn>
        <v-btn
          v-if="isOperable && event.type === 'duration'"
          density="comfortable"
          elevation="0"
          icon="mdi-square-edit-outline"
          base-color="transparent"
          class="text-white"
          @click="emit('edit')"
        ></v-btn>
      </div>
    </div>
    <div class="w-100 overflow-y-auto bg-white position-relative pa-4">
      <markdown-preview :mdtext="props.event.description" />
    </div>
    <div
      class="d-flex align-center justify-center overflow-hidden ga-2 bg-grey-lighten-3"
      :class="$style.bottom"
    >
      <user-icon :id="planner" :size="20" />
      <span :class="$style.plannerId">{{ '@' + planner }}</span>
    </div>
  </v-card>
</template>

<style module>
.card {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  font-variant-ligatures: none;
}

.buttons {
  height: 80px;
}

.bottom {
  height: 40px !important;
  flex-shrink: 0;
}

.colorTransition {
  transition-property: color, background-color, border-color, fill, stroke;
  transition-duration: 0.28s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

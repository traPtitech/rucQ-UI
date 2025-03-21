<script setup lang="ts">
import { computed } from 'vue'
const emit = defineEmits(['close', 'refresh'])
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import EventEditor from './EventEditor.vue'
import UserIcon from '@/components/generic/UserIcon.vue'
import { getDayStringNoPad, getTimeStringNoPad } from '@/lib/date'
import type { components } from '@/api/schema'
// import { apiClient } from '@/api/apiClient'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(useUserStore())

type CampEvent = components['schemas']['Event']
const props = defineProps<{ event: CampEvent }>()

const makeInfo = (event: CampEvent) => {
  return `${getDayStringNoPad(new Date(event.time_start))} ${getTimeStringNoPad(new Date(event.time_start))} ~ ${getTimeStringNoPad(new Date(event.time_end))} @${event.location}`
}

const text = computed(() => props.event.description)
</script>

<template>
  <v-card :class="`bg-lightGray`">
    <div :class="`d-flex justify-space-between bg-${event.display_color}`">
      <v-card rounded="0" elevation="0" :color="event.display_color" :class="$style.card">
        <template v-slot:title>
          <span class="font-weight-bold">{{ event.name }}</span>
        </template>
        <template v-slot:subtitle>
          <span>{{ makeInfo(event) }}</span>
        </template>
      </v-card>
      <div class="d-flex flex-column pa-1">
        <v-btn
          @click="emit('close')"
          density="comfortable"
          elevation="0"
          icon="mdi-close"
          baseColor="transparent"
          class="text-white"
        ></v-btn>
        <v-dialog fullscreen transition="dialog-bottom-transition">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-if="!(event.by_staff && !user?.is_staff)"
              density="comfortable"
              elevation="0"
              icon="mdi-square-edit-outline"
              baseColor="transparent"
              class="text-white"
              v-bind="activatorProps"
            ></v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <EventEditor
              :event="event"
              @close="isActive.value = false"
              @refresh="(emit('refresh'), (isActive.value = false))"
            />
          </template>
        </v-dialog>
      </div>
    </div>
    <div class="d-flex h-100 overflow-hidden ga-2 ma-2">
      <UserIcon :id="event.organizer_traq_id" :size="30" />
      <div class="w-100 overflow-y-auto bg-white rounded position-relative">
        <MarkdownPreview :isEditable="false" v-model:text="text" />
      </div>
    </div>
  </v-card>
</template>

<style module>
.card :global(.v-card-subtitle) {
  opacity: 1 !important;
}
</style>

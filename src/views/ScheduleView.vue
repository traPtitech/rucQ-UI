<script setup lang="ts">
import { useCamps } from '@/composables/camps'
import ScheduleContent from '@/components/event/ScheduleContent.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGetEvents } from '@/api/generated/client'
import EventEditor from '@/components/event/EventEditor.vue'

const { getCampByDisplayId, isOperable: isCampOperable } = useCamps()
const route = useRoute()

const displayCamp = computed(() => {
  return getCampByDisplayId(route.params.campname as string)
})

const isOperable = computed(() => {
  return isCampOperable(displayCamp.value)
})

const { data: events } = useGetEvents(() => displayCamp.value.id)
</script>

<template>
  <div :class="$style.container">
    <v-dialog v-if="isOperable" fullscreen transition="dialog-bottom-transition">
      <template #activator="{ props: activatorProps }">
        <v-card
          color="transparent"
          variant="flat"
          :class="$style.newEventMobile"
          v-bind="activatorProps"
        >
          <div class="d-flex flex-column align-center justify-center h-100">
            <v-icon icon="mdi-plus" size="60" />
            <span class="font-weight-bold my-2">新規イベント作成</span>
          </div>
        </v-card>
      </template>
      <template #default="{ isActive }">
        <event-editor :event="null" @close="isActive.value = false" />
      </template>
    </v-dialog>
    <schedule-content :camp="displayCamp" :events="events || []" />
  </div>
</template>

<style module>
.container {
  position: relative;
  max-width: 800px;
  margin: auto;
  padding: 20px 10px;
}

.newEventMobile {
  height: 120px;
}
</style>

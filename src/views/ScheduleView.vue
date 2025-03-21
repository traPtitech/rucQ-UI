<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDayStringNoPad, getTimeStringNoPad } from '@/lib/date'
import type { components } from '@/api/schema'
import { getLayout, type DayGroup } from '@/lib/event-layout'
import EventBlock from '@/components/event/EventBlock.vue'
import EventDialog from '@/components/event/EventDialog.vue'
import EventEditor from '@/components/event/EventEditor.vue'
// import { events, camp } from '@/lib/sample-data'
import { apiClient } from '@/api/apiClient'
import { useCampStore } from '@/store'

const route = useRoute()
const router = useRouter()

const campStore = useCampStore()
const currentTime = ref<Date>(new Date())

const dayGroups = ref<DayGroup[]>([])
const isDialogActive = ref(false)

watch(
  () => route.query.action,
  () => {
    if (route.query.action === 'newevent') {
      isDialogActive.value = true
      router.replace({ path: route.path, query: {} })
    }
  },
  { immediate: true },
)

const events = ref<components['schemas']['Event'][]>()

const refresh = async () => {
  events.value = (await apiClient.GET('/api/events')).data
  dayGroups.value = getLayout(events.value!, campStore.camp!, currentTime.value)
}

onMounted(async () => {
  await refresh()
  const interval = setInterval(() => {
    currentTime.value = new Date()
    dayGroups.value = getLayout(events.value!, campStore.camp!, currentTime.value)
  }, 10000) // 10 秒ごと

  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})
</script>

<template>
  <div :class="$style.container" v-if="dayGroups.length > 0">
    <div v-for="(dayGroup, i) in dayGroups" :key="i">
      <h2 style="margin: 20px 0 10px 0; font-weight: 900">
        {{ `Day ${i + 1} - ${getDayStringNoPad(dayGroup.date)}` }}
      </h2>
      <div
        v-for="(eventGroup, j) in dayGroup.eventGroups"
        :key="j"
        :style="{
          display: 'grid',
          gridTemplateColumns: `42px repeat(${Math.max(eventGroup.columns, 1)}, 1fr)`,
        }"
      >
        <div
          v-for="(space, k) in eventGroup.spaces"
          :key="k"
          :style="{
            gridRow: k + 1,
            gridColumn: 1,
            minHeight: `${space.minHeight === 'wide' ? 24 : 12}px`,
          }"
        >
          <div v-if="space.stamp !== 'none'" :class="`h-100 d-flex pr-1 align-${space.stamp}`">
            <div class="w-100 h-0 position-relative d-flex align-center justify-center">
              <h5
                v-if="space.time.getTime() !== currentTime.getTime()"
                style="font-weight: 900; width: fit-content; font-family: Roboto"
              >
                {{ getTimeStringNoPad(space.time) }}
              </h5>
              <div v-else style="position: relative">
                <v-icon
                  icon="mdi-menu-right"
                  color="red"
                  style="transform: scaleX(4); position: absolute; top: -10.5px; left: -10px"
                  height="20px"
                ></v-icon>
                <div
                  style="
                    top: -0.5px;
                    width: 30px;
                    height: 0px;
                    border-top: 2px solid var(--color-red);
                    position: absolute;
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="(space, k) in eventGroup.spaces"
          :key="k"
          :style="{
            gridRow: k + 1,
            gridColumn: `2 / ${eventGroup.columns + 2}`,
          }"
        >
          <hr
            v-if="space.line"
            :style="{
              border: '0px',
              marginTop: '-0.5px',
              borderTop:
                space.time.getTime() === currentTime.getTime()
                  ? '2px solid var(--color-red)'
                  : '1px dashed var(--color-line)',
            }"
          />
        </div>
        <EventBlock
          v-for="(event, k) in eventGroup.events"
          :key="k"
          :event="event.content"
          :style="{
            gridRow: `${event.startRow + 1} / ${event.endRow + 1}`,
            gridColumn: event.column + 2,
          }"
          @refresh="refresh"
        />
        <div
          v-for="(moment, k) in eventGroup.moments"
          :key="k"
          :style="{
            gridRow: moment.startRow + 1,
            gridColumn: moment.column + 2,
            display: 'flex',
            alignItems: 'center',
          }"
        >
          <v-dialog max-width="800">
            <template v-slot:activator="{ props: activatorProps }">
              <h5
                :class="$style.momentText"
                :style="
                  new Date(moment.content.time_start).getTime() === currentTime.getTime()
                    ? 'color: var(--color-red)'
                    : ''
                "
                v-bind="activatorProps"
              >
                {{ moment.content.name }}
              </h5>
            </template>
            <template v-slot:default="{ isActive }">
              <EventDialog :event="moment.content" @close="isActive.value = false" />
            </template>
          </v-dialog>
        </div>
      </div>
    </div>
  </div>

  <v-dialog v-model="isDialogActive" fullscreen transition="dialog-bottom-transition">
    <EventEditor
      :event="null"
      @close="isDialogActive = false"
      @refresh="(refresh(), (isDialogActive = false))"
    />
  </v-dialog>
</template>

<style module>
.container {
  height: 100%;
  overflow: hidden;
  width: 100%;
  margin: auto;
  padding: 20px 10px;
  max-width: 600px;
}

.momentText {
  font-weight: 500;
  padding-left: 4px;
  cursor: pointer;
}

.momentText:hover {
  text-decoration: underline;
}
</style>

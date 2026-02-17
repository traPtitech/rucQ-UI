<script setup lang="ts">
import ActivityLayout from '@/components/activity/ActivityLayout.vue'
import type { components } from '@/api/schema'
import { getJSTDate, getMonthDayStringNoPad } from '@/utils/date'

type QuestionCreatedActivity = components['schemas']['QuestionCreatedActivity']

defineProps<{
  activity: QuestionCreatedActivity
}>()
</script>

<template>
  <activity-layout
    :type="activity.type"
    :date="new Date(activity.time)"
    :active="activity.needsResponse"
  >
    <template #default="{ color }">
      <div class="w-100 h-100 d-flex justify-space-between ga-2 align-center">
        <div>
          <div :class="`text-${color}`">回答項目「{{ activity.name }}」</div>
          <div v-if="activity.needsResponse" class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-alert-circle-outline" color="red" />
            <span class="ml-1 text-caption" :class="$style.caption">未回答</span>
          </div>
          <div v-else class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-check" color="green" />
            <span class="ml-1 text-caption" :class="$style.caption">回答済み</span>
          </div>
        </div>

        <div class="d-flex align-center ga-1 flex-shrink-0">
          <span
            class="text-body-2 font-weight-bold"
            :class="activity.needsResponse ? 'text-red' : 'text-blue'"
          >
            {{ getMonthDayStringNoPad(getJSTDate(activity.due)) }}
          </span>
          <v-icon
            size="18"
            icon="mdi-clock-outline"
            :color="activity.needsResponse ? 'red' : 'blue'"
          />
        </div>
      </div>
    </template>
  </activity-layout>
</template>

<style module>
.caption {
  margin-bottom: 1.5px;
}
</style>

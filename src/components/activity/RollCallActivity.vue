<script setup lang="ts">
import ActivityLayout from '@/components/activity/ActivityLayout.vue'
import type { components } from '@/api/schema'
import { useRoute } from 'vue-router'

type RollCallCreatedActivity = components['schemas']['RollCallCreatedActivity']

const route = useRoute()

defineProps<{
  activity: RollCallCreatedActivity
}>()
</script>

<template>
  <activity-layout :type="activity.type" :date="new Date(activity.time)" :active="activity.isSubject">
    <template #default="{ color }">
      <div class="w-100 h-100 d-flex justify-space-between ga-2 align-center">
        <div>
          <div :class="`text-${color}`">{{ activity.name }}</div>
          <div v-if="activity.isSubject && activity.answered" class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-check" color="green" />
            <span class="ml-1 text-caption" :class="$style.caption">回答済み</span>
          </div>
          <div v-else-if="activity.isSubject && !activity.answered" class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-alert-circle-outline" color="red" />
            <span class="ml-1 text-caption" :class="$style.caption">未回答</span>
          </div>
          <div v-else class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-minus-circle-outline" color="grey" />
            <span class="ml-1 text-caption" :class="$style.caption">対象外</span>
          </div>
        </div>
        <v-btn
          :variant="activity.isSubject && !activity.answered ? 'flat' : 'outlined'"
          color="primary"
          :to="`/${route.params.campname as string}/rollcall/${activity.rollCallId}`"
        >
          {{ activity.isSubject && !activity.answered ? '回答する' : '確認する' }}
        </v-btn>
      </div>
    </template>
  </activity-layout>
</template>

<style module>
.caption {
  margin-bottom: 1.5px;
}
</style>

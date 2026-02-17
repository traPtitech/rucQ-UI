<script setup lang="ts">
import ActivityLayout from '@/components/activity/ActivityLayout.vue'
import RollCallActivity from '@/components/activity/RollCallActivity.vue'
import QuestionActivity from '@/components/activity/QuestionActivity.vue'
import { apiClient } from '@/api/apiClient'
import { qk } from '@/api/queries/keys'
import type { components } from '@/api/schema'
import { getDayStringNoPad } from '@/utils/date'
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useCampStore } from '@/store'
import { useRoute } from 'vue-router'

type Activity = components['schemas']['ActivityResponse']

const campStore = useCampStore()
const route = useRoute()

const displayCamp = computed(() =>
  campStore.getCampByDisplayId(route.params.campname as string),
)

const { data: activities } = useQuery<Activity[], Error>({
  queryKey: computed(() =>
    qk.camps.activities(displayCamp.value.id),
  ),
  enabled: computed(() => Boolean(displayCamp.value.id)),
  staleTime: 0,
  queryFn: async () => {
    const { data, error } = await apiClient.GET('/api/camps/{campId}/activities', {
      params: { path: { campId: displayCamp.value.id } },
    })
    if (error) throw new Error(`アクティビティの取得に失敗しました: ${error.message}`)
    return data
  },
})

const dailyLogs = computed(() => {
  if (!activities.value) return []
  const grouped = new Map<string, Activity[]>()

  for (const activity of activities.value) {
    const dateKey = new Date(activity.time).toDateString()
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }
    grouped.get(dateKey)!.push(activity)
  }

  return Array.from(grouped.entries())
    .map(([dateKey, activities]) => ({
      date: new Date(dateKey),
      activities: activities.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
      ),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
})
</script>

<template>
  <div class="pa-4" :class="$style.container">
    <template v-for="day in dailyLogs" :key="day.date.toISOString()">
      <h3 class="mb-2 mt-8" :class="$style.dayHeader">
        {{ getDayStringNoPad(day.date) }}
      </h3>
      <div class="d-flex flex-column ga-3">
        <template v-for="activity in day.activities" :key="`${activity.id}-${activity.time}`">
          <activity-layout v-if="activity.type === 'room_created'" :type="activity.type" :date="new Date(activity.time)">
            <template #default="{ color }">
              <span :class="`text-${color}`"> 部屋情報が公開されました </span>
            </template>
          </activity-layout>
          <activity-layout v-if="activity.type === 'payment_created'" :type="activity.type" :date="new Date(activity.time)">
            <template #default="{ color }">
              <span :class="`text-${color}`">
                {{ activity.amount.toLocaleString() }} 円の支払いが作成されました
              </span>
            </template>
          </activity-layout>
          <activity-layout v-if="activity.type === 'payment_amount_changed'" :type="activity.type" :date="new Date(activity.time)">
            <template #default="{ color }">
              <span :class="`text-${color}`">
                支払い金額が {{ activity.amount.toLocaleString() }} 円に変更されました
              </span>
            </template>
          </activity-layout>
          <activity-layout v-if="activity.type === 'payment_paid_changed'" :type="activity.type" :date="new Date(activity.time)">
            <template #default="{ color }">
              <span :class="`text-${color}`">
                合宿係が {{ activity.amount.toLocaleString() }} 円の振込を確認しました
              </span>
            </template>
          </activity-layout>
          <roll-call-activity v-if="activity.type === 'roll_call_created'" :activity="activity" />
          <question-activity v-if="activity.type === 'question_created'" :activity="activity" />
        </template>
      </div>
    </template>
  </div>
</template>

<style module>
.container {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.dayHeader {
  font-family: 'Reddit Sans Variable', sans-serif;
  font-weight: 900;
  letter-spacing: 0.075em;
}
</style>

<script setup lang="ts">
import ActivityLayout from '@/components/activity/ActivityLayout.vue'
import RollCallActivity from '@/components/activity/RollCallActivity.vue'
import { getDayStringNoPad } from '@/utils/date'
import { computed } from 'vue'
const dummyLogs = [
  {
    id: 1,
    type: 'room-reveal' as const,
    time: new Date('2024-07-01T10:00:00'),
  },
  {
    id: 2,
    type: 'transfer-confirm' as const,
    time: new Date('2024-07-01T12:30:00'),
    amount: 15000,
  },
  {
    id: 3,
    type: 'rollcall' as const,
    time: new Date('2024-07-02T14:00:00'),
    rollcall_id: 2,
    name: '大学出発時点呼',
    is_subject: true,
    answered: true,
  },
  {
    id: 4,
    type: 'rollcall' as const,
    time: new Date('2024-07-02T14:00:00'),
    rollcall_id: 3,
    name: '宿到着時点呼',
    is_subject: true,
    answered: false,
  },
  {
    id: 5,
    type: 'rollcall' as const,
    time: new Date('2024-07-02T14:00:00'),
    rollcall_id: 4,
    name: 'バスを使わなかった人の点呼',
    is_subject: false,
    answered: false,
  },
  {
    id: 6,
    type: 'question' as const,
    time: new Date('2024-07-01T15:30:00'),
  },
]

const dailyLogs = computed(() => {
  const grouped = new Map<string, typeof dummyLogs>()

  for (const log of dummyLogs) {
    const dateKey = log.time.toDateString()
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }
    grouped.get(dateKey)!.push(log)
  }

  return Array.from(grouped.entries())
    .map(([dateKey, logs]) => ({
      date: new Date(dateKey),
      logs: logs.sort((a, b) => a.time.getTime() - b.time.getTime()),
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
        <template v-for="log in day.logs" :key="log.time.toISOString()">
          <activity-layout v-if="log.type === 'room-reveal'" :type="log.type" :date="log.time">
            <template #default="{ color }">
              <span :class="`text-${color}`"> 部屋情報が公開されました </span>
            </template>
          </activity-layout>
          <activity-layout v-if="log.type === 'transfer-confirm'" :type="log.type" :date="log.time">
            <template #default="{ color }">
              <span :class="`text-${color}`">
                合宿係が {{ log.amount.toLocaleString() }} 円の振込を確認しました
              </span>
            </template>
          </activity-layout>
          <roll-call-activity v-if="log.type === 'rollcall'" :log="log" />
          <activity-layout v-if="log.type === 'question'" :type="log.type" :date="log.time">
            <template #default="{ color }">
              <span :class="`text-${color}`">回答項目「バス」</span>
            </template>
          </activity-layout>
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

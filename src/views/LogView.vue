<script setup lang="ts">
import LogBox from '@/components/log/LogLayout.vue'
import { getDayStringNoPad } from '@/utils/date'
import { computed } from 'vue'
const dummyLogs = [
  {
    type: 'room-reveal' as const,
    date: new Date('2024-07-01T10:00:00'),
  },
  {
    type: 'transfer-confirmed' as const,
    date: new Date('2024-07-01T12:30:00'),
    cost: 15000,
  },
  {
    type: 'rollcall' as const,
    date: new Date('2024-07-02T14:00:00'),
  },
  {
    type: 'question' as const,
    date: new Date('2024-07-01T15:30:00'),
  },
]

const dailyLogs = computed(() => {
  const grouped = new Map<string, typeof dummyLogs>()

  for (const log of dummyLogs) {
    const dateKey = log.date.toDateString()
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, [])
    }
    grouped.get(dateKey)!.push(log)
  }

  return Array.from(grouped.entries())
    .map(([dateKey, logs]) => ({
      date: new Date(dateKey),
      logs: logs.sort((a, b) => a.date.getTime() - b.date.getTime()),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
})
</script>

<template>
  <div class="pa-4" :class="$style.container">
    <template v-for="day in dailyLogs" :key="day.date.toISOString()">
      <h3 class="mb-4 mt-8">
        {{ getDayStringNoPad(day.date) }}
      </h3>
      <div class="d-flex flex-column ga-3">
        <template v-for="log in day.logs" :key="log.date.toISOString()">
          <log-box v-if="log.type === 'room-reveal'" :type="log.type" :date="log.date">
            <template #default="{ color }">
              <span :class="`text-${color}`">部屋情報が公開されました</span>
            </template>
          </log-box>
          <log-box v-if="log.type === 'transfer-confirmed'" :type="log.type" :date="log.date">
            <template #default="{ color }">
              <span :class="`text-${color}`"
                >合宿係が {{ log.cost.toLocaleString() }} 円の振込を確認しました</span
              >
            </template>
          </log-box>
          <log-box v-if="log.type === 'rollcall'" :type="log.type" :date="log.date">
            <template #default="{ color }">
              <span :class="`text-${color}`">大学出発時点呼</span>
            </template>
          </log-box>
          <log-box v-if="log.type === 'question'" :type="log.type" :date="log.date">
            <template #default="{ color }">
              <span :class="`text-${color}`">回答項目「バス」</span>
            </template>
          </log-box>
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
</style>

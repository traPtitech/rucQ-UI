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
    title: '大学出発時点呼',
    status: 'answered' as const,
    rollcall_id: 2,
  },
  {
    type: 'rollcall' as const,
    date: new Date('2024-07-02T14:00:00'),
    title: '宿到着時点呼',
    status: 'unanswered' as const,
    rollcall_id: 3,
  },
  {
    type: 'rollcall' as const,
    date: new Date('2024-07-02T14:00:00'),
    title: 'バスを使わなかった人の点呼',
    status: 'excluded' as const,
    rollcall_id: 3,
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
              <span :class="`text-${color}`"> 部屋情報が公開されました </span>
            </template>
          </log-box>
          <log-box v-if="log.type === 'transfer-confirmed'" :type="log.type" :date="log.date">
            <template #default="{ color }">
              <span :class="`text-${color}`">
                合宿係が {{ log.cost.toLocaleString() }} 円の振込を確認しました
              </span>
            </template>
          </log-box>
          <log-box v-if="log.type === 'rollcall'" :type="log.type" :date="log.date">
            <template #default="{ color }">
              <div class="w-100 h-100 d-flex justify-space-between align-center">
                <div>
                  <div :class="`text-${color}`">{{ log.title }}</div>
                  <div v-if="log.status === 'answered'" class="d-flex align-center gap-1">
                    <v-icon size="16" icon="mdi-check" color="green" />
                    <span class="ml-1 text-caption" :class="$style.caption">回答済み</span>
                  </div>
                  <div v-else-if="log.status === 'unanswered'" class="d-flex align-center gap-1">
                    <v-icon size="16" icon="mdi-alert-circle-outline" color="red" />
                    <span class="ml-1 text-caption" :class="$style.caption">未回答</span>
                  </div>
                  <div v-else class="d-flex align-center gap-1">
                    <v-icon size="16" icon="mdi-minus-circle-outline" color="grey" />
                    <span class="ml-1 text-caption" :class="$style.caption">対象外</span>
                  </div>
                </div>
                <v-btn
                  v-if="log.status === 'unanswered'"
                  variant="flat"
                  color="primary"
                  :to="`/rollcall/${log.rollcall_id}`"
                >
                  回答する
                </v-btn>
                <v-btn
                  v-else
                  variant="outlined"
                  color="primary"
                  :to="`/rollcall/${log.rollcall_id}`"
                >
                  確認する
                </v-btn>
              </div>
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

.caption {
  margin-bottom: 1.5px;
}
</style>

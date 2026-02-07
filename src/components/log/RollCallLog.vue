<script setup lang="ts">
import LogBox from '@/components/log/LogLayout.vue'
defineProps<{
  log: {
    type: 'rollcall'
    date: Date
    title: string
    status: 'answered' | 'unanswered' | 'excluded'
    rollcallId: number
  }
}>()
</script>

<template>
  <log-box
    v-if="log.type === 'rollcall'"
    :type="log.type"
    :date="log.date"
    :active="log.status !== 'excluded'"
  >
    <template #default="{ color }">
      <div class="w-100 h-100 d-flex justify-space-between align-center">
        <div>
          <div :class="`text-${color}`">{{ log.title }}</div>
          <div v-if="log.status === 'answered'" class="d-flex align-center gap-1">
            <v-icon size="16" icon="check" color="green" />
            <span class="ml-1 text-caption" :class="$style.caption">回答済み</span>
          </div>
          <div v-else-if="log.status === 'unanswered'" class="d-flex align-center gap-1">
            <v-icon size="16" icon="error" color="red" />
            <span class="ml-1 text-caption" :class="$style.caption">未回答</span>
          </div>
          <div v-else class="d-flex align-center gap-1">
            <v-icon size="16" icon="do_not_disturb_on" color="grey" />
            <span class="ml-1 text-caption" :class="$style.caption">対象外</span>
          </div>
        </div>
        <v-btn
          v-if="log.status === 'unanswered'"
          variant="flat"
          color="primary"
          :to="`/rollcall/${log.rollcallId}`"
        >
          回答する
        </v-btn>
        <v-btn v-else variant="outlined" color="primary" :to="`/rollcall/${log.rollcallId}`">
          確認する
        </v-btn>
      </div>
    </template>
  </log-box>
</template>

<style module>
.caption {
  margin-bottom: 1.5px;
}
</style>

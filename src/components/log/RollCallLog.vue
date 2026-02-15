<script setup lang="ts">
import LogBox from '@/components/log/LogLayout.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

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
      <div class="w-100 h-100 d-flex justify-space-between ga-2 align-center">
        <div>
          <div :class="`text-${color}`">{{ log.title }}</div>
          <div v-if="log.status === 'answered'" class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-check" color="green" />
            <span class="ml-1 text-caption" :class="$style.caption">回答済み</span>
          </div>
          <div v-else-if="log.status === 'unanswered'" class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-alert-circle-outline" color="red" />
            <span class="ml-1 text-caption" :class="$style.caption">未回答</span>
          </div>
          <div v-else class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-minus-circle-outline" color="grey" />
            <span class="ml-1 text-caption" :class="$style.caption">対象外</span>
          </div>
        </div>
        <v-btn
          :variant="log.status === 'unanswered' ? 'flat' : 'outlined'"
          color="primary"
          :to="`/${route.params.campname as string}/rollcall/${log.rollcallId}`"
        >
          {{ log.status === 'unanswered' ? '回答する' : '確認する' }}
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

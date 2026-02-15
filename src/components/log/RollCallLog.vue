<script setup lang="ts">
import LogBox from '@/components/log/LogLayout.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

defineProps<{
  log: {
    id: number
    type: 'rollcall'
    time: Date
    rollcall_id: number
    name: string
    is_subject: boolean
    answered: boolean
  }
}>()
</script>

<template>
  <log-box :type="log.type" :date="log.time" :active="log.is_subject">
    <template #default="{ color }">
      <div class="w-100 h-100 d-flex justify-space-between ga-2 align-center">
        <div>
          <div :class="`text-${color}`">{{ log.name }}</div>
          <div v-if="log.is_subject && log.answered" class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-check" color="green" />
            <span class="ml-1 text-caption" :class="$style.caption">回答済み</span>
          </div>
          <div v-else-if="log.is_subject && !log.answered" class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-alert-circle-outline" color="red" />
            <span class="ml-1 text-caption" :class="$style.caption">未回答</span>
          </div>
          <div v-else class="d-flex align-center ga-1">
            <v-icon size="16" icon="mdi-minus-circle-outline" color="grey" />
            <span class="ml-1 text-caption" :class="$style.caption">対象外</span>
          </div>
        </div>
        <v-btn
          :variant="log.is_subject && !log.answered ? 'flat' : 'outlined'"
          color="primary"
          :to="`/${route.params.campname as string}/rollcall/${log.rollcall_id}`"
        >
          {{ log.is_subject && !log.answered ? '回答する' : '確認する' }}
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

<script setup lang="ts">
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const { user } = storeToRefs(useUserStore())
const props = defineProps<{ id?: string; size?: number }>()

const imageStyle = computed(
  () =>
    ({
      width: `${props.size}px`,
      height: `${props.size}px`,
      objectFit: 'contain',
      borderRadius: `${props.size || 0}px`,
      display: 'block',
    }) as const,
)
</script>

<template>
  <img :style="imageStyle" :src="`https://q.trap.jp/api/v3/public/icon/${id || user?.id}`" />
</template>

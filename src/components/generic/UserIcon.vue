<script setup lang="ts">
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(useUserStore())
defineProps<{ id?: string; size?: number }>()
</script>

<template>
  <img
    :style="`width: ${size}px; height: ${size}px; object-fit: contain; border-radius: ${size || 0}px`"
    :src="`https://q.trap.jp/api/v3/public/icon/${id || user?.traq_id}`"
  />
</template>

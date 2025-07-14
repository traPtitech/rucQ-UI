<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'
import type { components } from '@/api/schema'

type Camp = components['schemas']['CampResponse']

const props = defineProps<{ camp: Camp }>()
const campStore = useCampStore()
const router = useRouter()
const { latestCamp } = storeToRefs(campStore)

const isViewingLatestCamp = computed(() => props.camp.id === latestCamp.value.id)
</script>

<template>
  <v-list dense>
    <v-list-item @click="router.push('/?back=true')" prepend-icon="mdi-arrow-right">
      トップページに戻る
    </v-list-item>
    <v-divider v-if="isViewingLatestCamp" :class="$style.divider" />
  </v-list>
</template>

<style module>
.divider {
  margin: 8px 0;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCampStore, useTimeStore } from '@/store'

const route = useRoute()
const campStore = useCampStore()
const timeStore = useTimeStore()

const displayCamp = computed(() => {
  const campname = route.params.campname as string | undefined
  if (!campname) return null
  return campStore.getCampByDisplayId(campname)
})

const isArchived = computed(() => {
  return displayCamp.value ? timeStore.isCampEnded(displayCamp.value) : false
})

const campName = computed(() => displayCamp.value?.name)
</script>

<template>
  <v-sheet v-if="isArchived" elevation="2" color="primaryLight" :class="$style.banner">
    <v-icon>mdi-archive</v-icon>
    <span class="ml-3">{{ campName }} はアーカイブ済みです</span>
  </v-sheet>
</template>

<style module>
.banner {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center !important;
  gap: 8px;
  padding: 16px 0;
  padding-inline-start: 0 !important;
  text-align: center;
  font-size: 16px;
  margin-bottom: 16px;
}
</style>

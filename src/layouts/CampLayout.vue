<script setup lang="ts">
import HeaderButton from '@/components/layout/HeaderButton.vue'
import PageNavigation from '@/components/layout/PageNavigation.vue'
import ArchiveBanner from '@/components/layout/ArchiveBanner.vue'
import BackgroundPattern from '@/components/generic/BackgroundPattern.vue'
import { useCampStore, useTimeStore } from '@/store'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const campStore = useCampStore()
const timeStore = useTimeStore()
const route = useRoute()

const displayCamp = computed(() => {
  const campname = route.params.campname as string | undefined
  if (!campname) return null
  try {
    return campStore.getCampByDisplayId(campname)
  } catch {
    return null
  }
})

const isArchived = computed(() => {
  return displayCamp.value ? timeStore.isCampEnded(displayCamp.value) : false
})

const routerViewMargin = computed(() => {
  return isArchived.value ? '50px' : '0px'
})

const campName = computed(() => displayCamp.value?.name)
</script>

<template>
  <background-pattern variant="light" />
  <v-app>
    <header-button :style="{ marginTop: routerViewMargin }" />
    <page-navigation />
    <v-main>
      <archive-banner v-if="isArchived" :camp-name="campName" />
      <router-view :style="{ marginTop: routerViewMargin }" />
    </v-main>
  </v-app>
</template>

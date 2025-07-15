<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import PageNavigation from '@/components/layout/PageNavigation.vue'
import HeaderButton from '@/components/layout/HeaderButton.vue'
import BackgroundPattern from '@/components/generic/BackgroundPattern.vue'
import ArchiveBanner from '@/components/layout/ArchiveBanner.vue'
import { useCampStore, useTimeStore } from '@/store'

const route = useRoute()
const campStore = useCampStore()
const timeStore = useTimeStore()

const showLayout = computed(() => route.meta?.showLayout)

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

const campName = computed(() => displayCamp.value?.name)

// アーカイブバナーの高さ分のマージンを計算
const routerViewMargin = computed(() => {
  return isArchived.value ? '50px' : '0px'
})
</script>

<template>
  <background-pattern :variant="showLayout ? 'light' : 'primary'" />
  <v-app>
    <header-button v-if="showLayout" :style="{ marginTop: routerViewMargin }" />
    <page-navigation v-if="showLayout" />
    <v-main>
      <archive-banner v-if="isArchived" :camp-name="campName" />
      <router-view :style="{ marginTop: routerViewMargin }" />
    </v-main>
  </v-app>
</template>

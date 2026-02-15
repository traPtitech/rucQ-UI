<script setup lang="ts">
import HeaderButton from '@/components/layout/HeaderButton.vue'
import PageNavigation from '@/components/layout/PageNavigation.vue'
import BackgroundPattern from '@/components/generic/BackgroundPattern.vue'
import { useCampStore, useTimeStore } from '@/store'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

const campStore = useCampStore()
const timeStore = useTimeStore()
const route = useRoute()
const { xs } = useDisplay()

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
  <header-button />
  <page-navigation />
  <v-main>
    <div
      v-if="isArchived && !xs"
      :class="[$style.banner, $style.bannerDesktop]"
      class="bg-primaryLight"
    >
      <v-icon>mdi-archive</v-icon>
      <span>{{ campName }} はアーカイブ済みです</span>
    </div>
    <router-view :style="{ marginTop: routerViewMargin }" />
  </v-main>
</template>

<style module>
.banner {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.bannerDesktop {
  position: fixed;
  top: 0;
  left: 270px;
  right: 0;
}

.bannerMobile {
  position: fixed;
  top: 56px; /* v-app-barの高さ分下げる */
  left: 0;
  right: 0;
}
</style>

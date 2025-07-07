<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useCampStore } from '@/store'
import { computed } from 'vue'
import HeaderButtonList from './HeaderButtonList.vue'

const route = useRoute()
const { xs } = useDisplay()

const campStore = useCampStore()

const displayCamp = computed(() => {
  const campname = route.params.campname as string
  return campStore.getCampByDisplayId(campname)
})
</script>

<template>
  <v-app-bar v-if="xs" elevation="2" color="white" density="comfortable">
    <template v-slot:prepend>
      <img src="/icons/icon-transparent.svg" alt="rucQ Icon" :class="$style.icon" />
    </template>
    <v-app-bar-title class="text-primary">
      <span :class="$style.routeTitle">{{ route.name }}</span>
    </v-app-bar-title>
    <v-menu>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn icon="mdi-dots-horizontal" v-bind="activatorProps" color="primary"></v-btn>
      </template>
      <header-button-list :camp="displayCamp" />
    </v-menu>
  </v-app-bar>
  <div v-else :class="$style.button">
    <v-menu>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          density="comfortable"
          icon="mdi-dots-horizontal"
          v-bind="activatorProps"
          color="white"
          baseColor="white"
          :class="`text-primary`"
        ></v-btn>
      </template>
      <header-button-list :camp="displayCamp" />
    </v-menu>
  </div>
</template>

<style module>
.icon {
  height: 80%;
  margin-right: 6px;
}

.button {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 3;
}

.routeTitle {
  font-weight: bold;
}
</style>

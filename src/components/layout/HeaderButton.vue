<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import HeaderButtonList from './HeaderButtonList.vue'
import { useTimeStore } from '@/store'
import { computed } from 'vue'
import { useCampStore } from '@/store'
const route = useRoute()
const { xs } = useDisplay()
const timeStore = useTimeStore()
const campStore = useCampStore()

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

const campIconUrl = computed(() => {
  if (isArchived.value) {
    return '/icons/icon-transparent-archived.svg'
  } else {
    return '/icons/icon-transparent.svg'
  }
})
</script>

<template>
  <v-app-bar v-if="xs" elevation="2" color="white" density="comfortable" :class="$style.appBar">
    <template #prepend>
      <img
        :src="campIconUrl"
        alt="rucQ Icon"
        width="44"
        height="44"
        :class="$style.icon"
      />
    </template>
    <v-app-bar-title :class="isArchived ? $style.archivedTitle : 'text-primary'">
      <span :class="$style.routeTitle">{{ route.name }} </span>
    </v-app-bar-title>
    <v-menu>
      <template #activator="{ props: activatorProps }">
        <v-btn icon="mdi-dots-horizontal" v-bind="activatorProps" color="primary"></v-btn>
      </template>
      <header-button-list />
    </v-menu>
  </v-app-bar>
  <div v-else :class="$style.button">
    <v-menu>
      <template #activator="{ props: activatorProps }">
        <v-btn
          density="comfortable"
          icon="mdi-dots-horizontal"
          v-bind="activatorProps"
          color="white"
          base-color="white"
          :class="`text-primary`"
        ></v-btn>
      </template>
      <header-button-list />
    </v-menu>
  </div>
</template>

<style module>
.icon {
  margin-right: 6px;
}

.button {
  position: fixed;
  top: 25px;
  transform: translateY(-50%);
  right: 10px;
  z-index: 3;
}

.routeTitle {
  font-weight: bold;
}

.archivedTitle {
  color: #8d8d8d;
}

.appBar {
  position: fixed !important;
  top: 0 !important;
}
</style>

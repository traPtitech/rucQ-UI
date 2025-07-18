<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import HeaderButtonList from './HeaderButtonList.vue'

const route = useRoute()
const { xs } = useDisplay()
</script>

<template>
  <v-app-bar v-if="xs" elevation="2" color="white" density="comfortable" :class="$style.appBar">
    <template #prepend>
      <img src="/icons/icon-transparent.svg" alt="rucQ Icon" :class="$style.icon" />
    </template>
    <v-app-bar-title class="text-primary">
      <span :class="$style.routeTitle">{{ route.name }}</span>
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
  height: 80%;
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

.appBar {
  position: fixed !important;
  top: 0 !important;
}
</style>

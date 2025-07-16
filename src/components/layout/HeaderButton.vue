<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import HeaderButtonList from './HeaderButtonList.vue'

const route = useRoute()
const { xs } = useDisplay()
</script>

<template>
  <v-app-bar v-if="xs" elevation="2" color="white" density="comfortable" :class="$style.appBar">
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
      <header-button-list />
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
  top: 10px;
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

<script setup lang="ts">
import { RouterView } from 'vue-router'
import PageNavigation from '@/components/layout/PageNavigation.vue'
import HeaderButton from '@/components/layout/HeaderButton.vue'
</script>

<template>
  <v-app>
    <header-button />
    <page-navigation />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

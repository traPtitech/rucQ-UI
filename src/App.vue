<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import PageNavigation from '@/components/layout/PageNavigation.vue'
import HeaderButton from '@/components/layout/HeaderButton.vue'

const route = useRoute()
const showLayout = computed(() => route.meta?.showLayout)
</script>

<template>
  <v-app>
    <header-button v-if="showLayout" />
    <page-navigation v-if="showLayout" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

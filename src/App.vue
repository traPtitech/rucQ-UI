<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import PageNavigation from '@/components/layout/PageNavigation.vue'
import HeaderButton from '@/components/layout/HeaderButton.vue'
import BackgroundPattern from '@/components/generic/BackgroundPattern.vue'
import ArchiveBanner from '@/components/layout/ArchiveBanner.vue'

const route = useRoute()
const showLayout = computed(() => route.meta?.showLayout)
</script>

<template>
  <background-pattern :variant="showLayout ? 'light' : 'primary'" />
  <v-app>
    <header-button v-if="showLayout" />
    <page-navigation v-if="showLayout" />
    <v-main>
      <archive-banner v-if="showLayout" />
      <router-view />
    </v-main>
  </v-app>
</template>

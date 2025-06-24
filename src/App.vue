<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import PageNavigation from '@/components/layout/PageNavigation.vue'
import HeaderButton from '@/components/layout/HeaderButton.vue'
import BackgroundPattern from '@/components/generic/BackgroundPattern.vue'

const route = useRoute()
const showLayout = computed(() => route.meta?.showLayout)
</script>

<template>
  <background-pattern
    :logo-color="showLayout ? '#FFFFFF' : '#FF8200'"
    :bg-color="showLayout ? '#F6F6F6' : '#FF7300'"
    :is-global="true"
  />
  <v-app>
    <header-button v-if="showLayout" />
    <page-navigation v-if="showLayout" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import HeaderButton from '@/components/layout/HeaderButton.vue'
import PageNavigation from '@/components/layout/PageNavigation.vue'
import BackgroundPattern from '@/components/generic/BackgroundPattern.vue'


</script>

<template>
  <background-pattern variant="light" />
  <header-button />
  <page-navigation />
  <v-main>
    <router-view />
  </v-main>
</template>

<style module></style>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <v-list dense>
    <v-list-item @click="router.push('/?back=true')" prepend-icon="mdi-arrow-right">
      トップページに戻る
    </v-list-item>
  </v-list>
</template>

<style module>
.divider {
  margin: 8px 0;
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <v-list dense>
    <v-list-item prepend-icon="mdi-arrow-right" @click="router.push('/?back=true')">
      トップページに戻る
    </v-list-item>
  </v-list>
</template>

<style module>
.divider {
  margin: 8px 0;
}
</style>

<template>
  <v-app>
    <router-view />
    <VueQueryDevtools />
  </v-app>
</template>

<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import localforage from 'localforage'
import { onMounted } from 'vue'
const queryClient = useQueryClient()

onMounted(async () => {
  // indexed db の内容表示（デバッグ用）

  // Method 1: IndexedDB直叩き
  console.group('🔍 IndexedDB Cache (Direct Access)')
  try {
    const keys = await localforage.keys()
    console.log(`Found ${keys.length} keys in IndexedDB`)

    for (const key of keys) {
      const value = await localforage.getItem(key)
      console.log(`Key: ${key}`, value)
    }
  } catch (err) {
    console.error('Failed to read from IndexedDB:', err)
  }
  console.groupEnd()

  // Method 2: queryClient経由
  console.group('🔍 QueryClient Cache (via getQueryCache)')
  try {
    const cache = queryClient.getQueryCache()
    const queries = cache.getAll()
    console.log(`Found ${queries.length} queries in cache`)

    queries.forEach((query) => {
      console.log('Query:', {
        queryKey: query.queryKey,
        state: query.state,
        dataUpdatedAt: new Date(query.state.dataUpdatedAt),
        error: query.state.error,
        status: query.state.status,
      })
      console.log('Data:', query.state.data)
    })
  } catch (err) {
    console.error('Failed to read from QueryClient:', err)
  }
  console.groupEnd()
})
</script>

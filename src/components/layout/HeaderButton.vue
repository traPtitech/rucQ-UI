<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(useUserStore())

const route = useRoute()
const router = useRouter()
const { xs } = useDisplay()

const options = computed(() => [
  {
    name: '新規イベント作成',
    func: () => {
      router.push({ path: `/${route.params.campname}/schedule`, query: { action: 'newevent' } })
    },
  },
  ...(user.value?.is_staff
    ? [
        {
          name: '管理者ツール',
          func: () => router.push(`/${route.params.campname}/admin`),
        },
      ]
    : []),
  // { name: '別の合宿を表示', func: () => router.push(`/camps`) },
])
</script>

<template>
  <v-app-bar v-if="xs" elevation="2" color="white" density="comfortable">
    <template v-slot:prepend>
      <img src="/icons/icon-transparent.svg" alt="rucQ Icon" :class="$style.icon" />
    </template>

    <v-app-bar-title class="text-theme"
      ><span style="font-weight: bold">{{ route.name }}</span></v-app-bar-title
    >
    <v-menu>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn icon="mdi-dots-horizontal" v-bind="activatorProps" color="theme"></v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(option, i) in options" :key="i" @click="option.func">
          <v-list-item-title>{{ option.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
  <div
    v-if="!xs && route.name !== 'ノート'"
    style="position: fixed; top: 10px; right: 10px; z-index: 3"
  >
    <v-menu>
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          density="comfortable"
          icon="mdi-dots-horizontal"
          v-bind="activatorProps"
          color="white"
          baseColor="white"
          :class="`text-theme`"
        ></v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(option, i) in options" :key="i" @click="option.func">
          <v-list-item-title>{{ option.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style module>
.icon {
  height: 80%;
  margin-right: 6px;
}
</style>

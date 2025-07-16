<script setup lang="ts">
import UserIcon from '@/components/generic/UserIcon.vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

import BackgroundPattern from '@/components/generic/BackgroundPattern.vue'

const { xs } = useDisplay()
const router = useRouter()
const route = useRoute()

const currentPath = computed(() => route.path)
const fullPath = (path: string) => `/${route.params.campname}/${path}`
const isActive = (itemPath: string) => currentPath.value === fullPath(itemPath)

// 選択されたアイテムの配列を管理
const selectedItems = computed(() => [currentPath.value])

const navItems = [
  {
    path: '',
    title: '合宿のしおり',
    iconActive: 'mdi-book-open-blank-variant',
    icon: 'mdi-book-open-blank-variant-outline',
  },
  {
    path: 'schedule',
    title: 'スケジュール',
    iconActive: 'mdi-clock',
    icon: 'mdi-clock-outline',
  },
  {
    path: 'rooms',
    title: '部屋情報',
    iconActive: 'mdi-view-grid',
    icon: 'mdi-view-grid-outline',
  },
  {
    path: 'info',
    title: 'ユーザー情報',
    iconActive: null,
    icon: null,
  },
]
</script>

<template>
  <v-bottom-navigation v-if="xs" color="primary" v-model="currentPath" mandatory grow>
    <v-btn
      v-for="item in navItems"
      :value="fullPath(item.path)"
      :key="item.path"
      @click="router.push(fullPath(item.path))"
    >
      <v-icon
        v-if="item.icon"
        size="24"
        :icon="isActive(item.path) ? item.iconActive : item.icon"
      />
      <user-icon v-else :size="24" />
    </v-btn>
  </v-bottom-navigation>
  <v-navigation-drawer
    v-else
    width="270"
    color="primary"
    permanent
    :class="$style.drawer"
    app
  >
    <background-pattern style="z-index: -1" variant="primary" />
    <img src="/logo/logo-white.svg" alt="rucQ Icon" :class="$style.logo" />
    <v-list dense v-model:selected="selectedItems" mandatory>
      <v-list-item
        v-for="item in navItems"
        :value="fullPath(item.path)"
        :key="item.path"
        @click="router.push(fullPath(item.path))"
        color="white"
      >
        <div :class="$style.headerTab">
          <v-icon
            v-if="item.icon"
            class="mr-3"
            :icon="isActive(item.path) ? item.iconActive : item.icon"
          />
          <UserIcon
            v-else
            :size="22"
            class="mr-3"
            :style="{ outline: `${isActive(item.path) ? 2 : 1}px solid white` }"
          ></UserIcon>
          <span
            :class="$style.headerTitle"
            :style="{ fontWeight: isActive(item.path) ? 'bold' : 'normal' }"
          >
            {{ item.title }}
          </span>
        </div>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style module>
.headerTab {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 30px;
}

.headerTitle {
  font-size: 17px;
  font-weight: normal;
}

.logo {
  margin: auto;
  display: flex;
  margin-top: 45px;
  margin-bottom: 30px;
  width: 50%;
}

.drawer {
  z-index: 1001;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  height: 100vh !important;
  overflow: hidden;
}
</style>

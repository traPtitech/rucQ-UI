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
    iconActive: 'mdi-information',
    icon: 'mdi-information-outline',
  },
]

const fullPath = (path: string) => `/${route.params.campname}/${path}`
</script>

<template>
  <v-bottom-navigation v-if="xs" color="primary" v-model="currentPath" mandatory grow>
    <v-btn
      v-for="(item, i) in navItems"
      :value="fullPath(item.path)"
      :key="i"
      @click="router.push(fullPath(item.path))"
    >
      <v-icon v-if="item.path !== 'info'" size="24">{{
        currentPath === fullPath(item.path) ? item.iconActive : item.icon
      }}</v-icon>
      <UserIcon v-else :size="24"></UserIcon>
    </v-btn>
  </v-bottom-navigation>
  <v-navigation-drawer
    floating
    width="230"
    color="primary"
    permanent
    v-else
    style="z-index: 1; overflow: hidden"
    app
  >
  <background-pattern logo-color="#FF8200" bg-color="#FF7300" />
    <img src="/logo/logo.svg" alt="rucQ Icon" :class="$style.logo" />
    <v-list dense mandatory v-model="currentPath">
      <v-list-item
        v-for="(item, i) in navItems"
        :value="fullPath(item.path)"
        :key="i"
        @click="router.push(fullPath(item.path))"
      >
        <div :class="[
          $style.headerTab,
          { [$style.active]: currentPath === fullPath(item.path) }
        ]">
          <v-icon
            class="mr-3"
            :style="{ color: currentPath === fullPath(item.path) ? '#000' : 'inherit' }"
          >{{
            currentPath === fullPath(item.path) ? item.iconActive : item.icon
          }}</v-icon>
          <span
            :class="[
              [$style.headerTitle],
              { [$style.headerTitleActive]: currentPath === fullPath(item.path) },
            ]"
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
  align-items: center; /* 垂直方向の中央揃え */
  gap: 10px; /* アイコンと文字の間隔 */
  margin-left: 30px;
}

.headerTab.active {
  color: #000000; /* 黒文字 */
}

.headerTitle {
  font-size: 17px; /* テキストサイズを調整 */
  font-weight: normal; /* デフォルトは通常の太さ */
}

.headerTitleActive {
  font-weight: bold; /* 選択中の文字を太くする */
  color: #000000; /* 黒文字 */
}

.logo {
  margin: auto;
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 50%;
}
</style>

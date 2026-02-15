<script setup lang="ts">
import { useCampStore, useTimeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { getDayStringNoPad } from '@/utils/date'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import { useRouter } from 'vue-router'
import type { Camp } from '@/typeAliases'
import BackgroundPattern from '@/components/generic/BackgroundPattern.vue'

const version = __APP_VERSION__

const router = useRouter()
const campStore = useCampStore()
const timeStore = useTimeStore()

const { allCamps, hasRegisteredLatest } = storeToRefs(campStore)

// RegistrationView においてだけは latestCamp が存在しない可能性があるので、ラップする
const latestCamp = computed(() => {
  try {
    return campStore.latestCamp
  } catch (error) {
    console.error(error)
    return undefined
  }
})

const isLatestCampEnded = computed(() => {
  if (!latestCamp.value) return false
  return timeStore.isCampEnded(latestCamp.value)
})

const registerAndOpen = async () => {
  if (!latestCamp.value) return
  await openCamp(latestCamp.value)
}

const openCamp = async (camp: Camp) => {
  await router.push(`/${camp.displayId}/info`)
}
</script>

<template>
  <background-pattern variant="primary" />
  <div :class="$style.container">
    <template v-if="latestCamp">
      <img :src="`/logo/logo-white.svg`" :class="$style.logo" />
      <v-expansion-panels>
        <v-expansion-panel :class="$style.panel">
          <v-expansion-panel-title>
            <div :class="$style.title">
              <span :class="$style.titleText">{{ latestCamp.name }}</span>
              <span>
                {{ getDayStringNoPad(new Date(latestCamp.dateStart)) }} -
                {{ getDayStringNoPad(new Date(latestCamp.dateEnd)) }}
              </span>
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div :class="$style.content">
              <div :class="$style.guidebook">
                <markdown-preview :mdtext="latestCamp.guidebook" />
              </div>
              <v-btn
                elevation="0"
                prepend-icon="mdi-arrow-right"
                base-color="transparent"
                variant="flat"
                color="primary"
                :class="[$style.save, 'font-weight-bold']"
                @click="registerAndOpen"
              >
                <span
                  v-if="!hasRegisteredLatest && latestCamp.isRegistrationOpen"
                  class="font-weight-medium"
                  >合宿を表示する（参加受付中）</span
                >
                <span
                  v-else-if="hasRegisteredLatest && !isLatestCampEnded"
                  class="font-weight-medium"
                  >参加中の合宿を開く</span
                >
                <span
                  v-else-if="!hasRegisteredLatest && !isLatestCampEnded"
                  class="font-weight-medium"
                  >開催中の合宿を閲覧する</span
                >
                <span v-else class="font-weight-medium">終了した合宿を見る</span>
              </v-btn>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <div v-if="allCamps.length > 1" :class="$style.archives">
        <span :class="$style.head">合宿アーカイブ</span>
        <div :class="$style.archiveList">
          <v-card
            v-for="camp in allCamps.slice(1)"
            :key="camp.id"
            link
            elevation="0"
            color="transparent"
            class="w-100 my-2"
            @click="openCamp(camp)"
          >
            <div :class="$style.archiveBtnInner">
              <div>{{ camp.name }}</div>
              <div style="font-size: 12px">
                {{ getDayStringNoPad(new Date(camp.dateStart)) }} -
                {{ getDayStringNoPad(new Date(camp.dateEnd)) }}
              </div>
            </div>
          </v-card>
        </div>
      </div>
    </template>
    <template v-else>
      <img :src="`/logo/logo-white.svg`" style="width: 200px" />
      <div>
        <v-alert type="error" :class="$style.alert">
          最新の合宿が見つかりませんでした。管理者にお問い合わせください
        </v-alert>
      </div>
    </template>
    <span :class="$style.version">{{ `rucQ-UI v${version}` }}</span>
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 64px 16px;
  position: relative;
}

.version {
  font-family: 'Reddit Sans Variable', sans-serif;
  position: absolute;
  bottom: 24px;
  font-size: 14px;
  color: white;
}

.logo {
  width: 200px;
  z-index: 1;
}

.panel {
  margin-top: 40px;
  max-width: 600px !important;
  width: 80%;
}

.content {
  position: relative;
}

.save {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
}

.guidebook {
  height: 480px;
  overflow: auto;
  padding-bottom: 40px;
}

.title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding-right: 16px;
}

.titleText {
  font-weight: bold;
}

.alert {
  margin-top: 40px;
}

.archives {
  margin-top: 40px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.head {
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 0.2em !important;
  color: white;
}

.archiveList {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin-top: 16px;
}

.archiveBtnInner {
  height: 40px;
  color: white;
  border: 1px solid white;
  border-radius: 4px;
  display: flex;
  padding: 0 12px;
  justify-content: space-between;
  align-items: center;
}
</style>

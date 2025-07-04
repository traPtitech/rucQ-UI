<script setup lang="ts">
import { useCampStore, useTimeStore } from '@/store'
import { storeToRefs } from 'pinia'
import { getDayStringNoPad } from '@/lib/date'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import { apiClient } from '@/api/apiClient'
import { useRouter } from 'vue-router'
import { onBeforeMount, computed } from 'vue'
import type { components } from '@/api/schema'

type Camp = components['schemas']['CampResponse']

const router = useRouter()
const { displayCamp, latestCamp, allCamps, hasRegisteredLatest } = storeToRefs(useCampStore())
const { currentTime } = storeToRefs(useTimeStore())

// 参加登録申込期限を過ぎていて、かつまだ終わっていない合宿は表示不可能とする
const isViewable = computed(() => {
  if (!latestCamp.value) return false
  const endDate = new Date(latestCamp.value.dateEnd)
  endDate.setDate(endDate.getDate() + 1)
  return latestCamp.value.isRegistrationOpen || currentTime.value > endDate
})

const register = async () => {
  if (!latestCamp.value) return
  const { error } = await apiClient.POST('/api/camps/{campId}/register', {
    params: { path: { campId: latestCamp.value.id } },
  })
  if (error) throw error
  hasRegisteredLatest.value = true
  await openCamp(latestCamp.value)
}

const openCamp = async (camp: Camp) => {
  displayCamp.value = camp
  await router.push(`/${camp.displayId}/info`)
}

onBeforeMount(async () => {
  if (displayCamp.value) openCamp(displayCamp.value)
})
</script>

<template>
  <div :class="$style.container" v-if="latestCamp">
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
              v-if="!hasRegisteredLatest && latestCamp.isRegistrationOpen"
              elevation="0"
              prepend-icon="mdi-arrow-right"
              baseColor="transparent"
              variant="flat"
              color="primary"
              :class="[$style.save, 'font-weight-bold']"
              @click="register"
            >
              <span class="font-weight-medium">この合宿に参加する</span>
            </v-btn>
            <v-btn
              v-else-if="isViewable"
              elevation="0"
              prepend-icon="mdi-arrow-right"
              baseColor="transparent"
              variant="flat"
              color="primary"
              :class="[$style.save, 'font-weight-bold']"
              @click="openCamp(latestCamp)"
            >
              <span class="font-weight-medium">この合宿を表示する</span>
            </v-btn>
            <v-btn
              v-else
              elevation="0"
              prepend-icon="mdi-close"
              baseColor="transparent"
              variant="flat"
              color="grey"
              disabled
              :class="[$style.save, 'font-weight-bold']"
            >
              <span class="font-weight-medium">参加申込期限を過ぎています</span>
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
          :class="$style.archiveBtn"
          @click="openCamp(camp)"
        >
          <div>{{ camp.name }}</div>
          <div style="font-size: 12px">
            {{ getDayStringNoPad(new Date(camp.dateStart)) }} -
            {{ getDayStringNoPad(new Date(camp.dateEnd)) }}
          </div>
        </v-card>
      </div>
    </div>
  </div>
  <div :class="$style.container" v-else>
    <img :src="`/logo/logo-white.svg`" style="width: 200px" />
    <div>
      <v-alert type="error" :class="$style.alert">
        最新の合宿が見つかりませんでした。管理者にお問い合わせください
      </v-alert>
    </div>
  </div>
</template>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 64px 16px;
}

.logo {
  width: 200px;
}

.panel {
  margin-top: 40px;
  max-width: 600px;
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
  letter-spacing: 0.2em;
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

.archiveBtn {
  height: 40px !important;
  width: 100%;
  background-color: transparent;
  color: white;
  border: 1px solid white;
  margin: 8px 0;
  display: flex;
  padding: 0 12px;
  justify-content: space-between;
  align-items: center;
}
</style>

<!-- 参加登録・合宿選択 View -->
<!-- すでにユーザーが最新の合宿の参加登録を済ませている場合は GuidebookView へリダイレクトする -->
<script setup lang="ts">
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'
import { getDayStringNoPad } from '@/lib/date'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import { apiClient } from '@/api/apiClient'
import { useRouter } from 'vue-router'
import type { components } from '@/api/schema'

type Camp = components['schemas']['CampResponse']

const router = useRouter()
const { displayCamp, pastCamps } = storeToRefs(useCampStore())

const register = async () => {
  const { data, error } = await apiClient.POST('/api/camps/{campId}/register', {
    params: { path: { campId: displayCamp.value!.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to register for camp')
  await router.push(`/${displayCamp.value!.displayId}/info`)
}

const showPastCamps = async (camp: Camp) => {
  displayCamp.value = camp
  await router.push(`/${displayCamp.value!.displayId}/info`)
}
</script>

<template>
  <div :class="$style.container" v-if="displayCamp">
    <img :src="`/logo/logo-white.svg`" :class="$style.logo" />
    <v-expansion-panels>
      <v-expansion-panel :class="$style.panel">
        <v-expansion-panel-title>
          <span :class="$style.title">{{ displayCamp.name }}</span>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <div :class="$style.content">
            <div :class="$style.guidebook">
              <markdown-preview v-model:text="displayCamp.description" />
            </div>
            <v-btn
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
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-if="pastCamps.length > 0" :class="$style.archives">
      <span :class="$style.head">その他の合宿</span>
      <div :class="$style.archiveList">
        <v-card
          v-for="camp in pastCamps.filter((c) => c.id !== displayCamp!.id)"
          :key="camp.id"
          link
          elevation="0"
          :class="$style.archiveBtn"
          @click="showPastCamps(camp)"
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

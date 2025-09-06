<script setup lang="ts">
import UserIcon from '@/components/generic/UserIcon.vue'
import { computed } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const props = defineProps<{
  title: string
  userIds: string[]
  textColor?: string
}>()

const MAX_VISIBLE_USER_COUNT = 6

// userIds に自分の ID が含まれているかどうか
const isMyReaction = computed(() => props.userIds.includes(userStore.user.id))

// 自分が含まれている場合は自分を先頭、その後に他のユーザー
const orderedUserIds = computed(() => {
  return isMyReaction.value
    ? [userStore.user.id, ...props.userIds.filter((id) => id !== userStore.user.id)]
    : props.userIds
})
</script>

<template>
  <div :class="[$style.container, `text-${props.textColor}`]">
    <div :class="$style.title">{{ title ?? '' }}</div>
    <div :class="$style.iconRow">
      <user-icon
        v-for="id in orderedUserIds.slice(0, MAX_VISIBLE_USER_COUNT)"
        :id="id"
        :key="id"
        id-tooltip
        :size="28"
        :class="[id === userStore.user.id ? $style.myIcon : '', 'mr-2']"
      />
      <v-dialog max-width="800">
        <template #activator="{ props: activatorProps }">
          <v-btn
            v-if="userIds.length > MAX_VISIBLE_USER_COUNT"
            density="comfortable"
            elevation="0"
            variant="text"
            icon="mdi-chevron-right"
            v-bind="activatorProps"
          ></v-btn>
        </template>
        <template #default="{ isActive }">
          <v-card class="pa-2">
            <div class="w-100 d-flex align-center justify-center">
              <div :class="$style.title">{{ title }}</div>
              <v-btn
                :class="$style.closeButton"
                density="comfortable"
                elevation="0"
                icon="mdi-close"
                base-color="transparent"
                @click="isActive.value = false"
              ></v-btn>
            </div>
            <div class="mt-2 d-flex flex-wrap justify-center">
              <user-icon
                v-for="id in orderedUserIds"
                :id="id"
                :key="id"
                id-tooltip
                :size="28"
                :class="[id === userStore.user.id ? $style.myIcon : '', 'ma-1']"
              />
            </div>
          </v-card>
        </template>
      </v-dialog>
    </div>
    <div :class="$style.count">{{ userIds.length }}人</div>
  </div>
</template>

<style module>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-align: center;
}

.iconRow {
  position: relative;
  width: 100%;
  height: 36px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.myIcon {
  box-sizing: content-box;
  border: 2px solid white;
}

.closeButton {
  position: absolute !important;
  right: 4px;
  top: 4px;
}

.count {
  margin-top: 6px;
  font-weight: 700;
  text-align: center;
}
</style>

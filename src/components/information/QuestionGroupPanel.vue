<script setup lang="ts">
import type { components } from '@/api/schema'

type QuestionGroup = components['schemas']['QuestionGroupResponse']

defineProps<{
  questionGroup: QuestionGroup
}>()

import { ref, computed } from 'vue'
const inEditMode = ref(false)

const cardColor = computed(() => (inEditMode.value ? 'theme' : 'themePale'))
const titleColor = computed(() => (inEditMode.value ? 'white' : 'theme'))
</script>

<template>
  <v-card :color="cardColor" elevation="0" :class="$style.card">
    <template v-slot:title>
      <div :class="$style.title">
        <span :class="['font-weight-bold', `text-${titleColor}`]">{{ questionGroup.name }}</span>
        <v-btn
          v-if="!inEditMode"
          density="comfortable"
          elevation="0"
          icon="mdi-square-edit-outline"
          baseColor="transparent"
          class="text-theme"
          @click="inEditMode = true"
        ></v-btn>
      </div>
    </template>
    <v-card-text v-if="inEditMode" class="bg-white pt-4">
      <div>{{ questionGroup.description }}</div>
      <div :class="$style.editContent">
        <div v-for="question in questionGroup.questions" :key="question.id">
          <v-text-field
            v-if="question.type === 'free_text'"
            :label="question.title"
            :messages="[question.description ?? '']"
            :rules="[(v) => !!v || '必須項目です']"
            variant="underlined"
          ></v-text-field>
          <v-number-input
            v-if="question.type === 'free_number'"
            :label="question.title"
            :messages="[question.description ?? '']"
            :rules="[(v) => !!v || '必須項目です']"
            variant="underlined"
            control-variant="hidden"
          ></v-number-input>
          <v-select
            v-if="question.type === 'single'"
            :label="question.title"
            :messages="[question.description ?? '']"
            :rules="[(v) => !!v || '必須項目です']"
            variant="underlined"
            :items="question.options"
            item-value="id"
            item-title="content"
          ></v-select>
          <v-select
            v-if="question.type === 'multiple'"
            :label="question.title"
            :messages="[question.description ?? '']"
            :rules="[(v) => !!v || '必須項目です']"
            variant="underlined"
            multiple
            :items="question.options"
            item-value="id"
            item-title="content"
          ></v-select>
        </div>
      </div>
      <v-btn
        elevation="0"
        append-icon="mdi-check"
        baseColor="transparent"
        variant="flat"
        color="theme"
        :class="[$style.save, 'text-bold']"
        @click="inEditMode = false"
        >保存</v-btn
      >
    </v-card-text>
    <v-card-text v-else class="bg-white pt-4">
      <div>{{ questionGroup.description }}</div>
    </v-card-text>
  </v-card>
</template>

<style module>
.card {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  margin: 0 8px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  letter-spacing: 2px;
  width: 100%;
}

.card :global(.v-card-item) {
  height: 40px !important;
  padding-right: 4px !important;
}

.save {
  width: 100%;
  margin-top: 16px;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 2px;
}

.editContent {
  width: 100%;
  display: flex;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  align-items: flex-start;
  margin-top: 8px;
}
</style>

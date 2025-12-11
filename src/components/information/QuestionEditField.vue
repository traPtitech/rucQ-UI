<script setup lang="ts">
import type { components } from '@/api/schema'

type Question = components['schemas']['QuestionResponse']

defineProps<{ question: Question }>()
const value = defineModel<string | number | number[]>('value')

// 必須バリデーション関数（undefined / null のみエラー）
const requiredRule = (v: unknown) => (v === undefined || v === null ? '必須項目です' : true)
</script>

<!-- prettier-ignore -->
<template>
  <v-text-field
    v-if="question.type === 'free_text'"
    v-model="(value as string)"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[requiredRule]"
    :disabled="!question.isOpen"
    variant="underlined"
    :class="$style.wrapText"
  ></v-text-field>
  <v-number-input
    v-if="question.type === 'free_number'"
    v-model="(value as number)"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[requiredRule]"
    :disabled="!question.isOpen"
    variant="underlined"
    control-variant="hidden"
    :class="$style.wrapText"
  ></v-number-input>
  <v-select
    v-if="question.type === 'single'"
    v-model="(value as number)"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[requiredRule]"
    :disabled="!question.isOpen"
    variant="underlined"
    :items="question.options"
    :item-value="(option) => option.id"
    :item-title="(option) => option.content"
    :class="$style.wrapText"
  ></v-select>
  <v-select
    v-if="question.type === 'multiple'"
    v-model="(value as number[])"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[requiredRule]"
    :disabled="!question.isOpen"
    variant="underlined"
    multiple
    :items="question.options"
    :item-value="(option) => option.id"
    :item-title="(option) => option.content"
    :class="$style.wrapText"
  ></v-select>
</template>

<style module>
.wrapText :global(.v-select__selection-text) {
  white-space: normal !important;
}

:global(.v-overlay-container) :global(.v-list-item-title) {
  white-space: normal;
}
</style>

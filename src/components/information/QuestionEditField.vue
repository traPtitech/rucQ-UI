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
    :model-value="(value as string)"
    v-if="question.type === 'free_text'"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[requiredRule]"
    :disabled="!question.isOpen"
    variant="underlined"
  ></v-text-field>
  <v-number-input
    :model-value="(value as number)"
    v-if="question.type === 'free_number'"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[requiredRule]"
    :disabled="!question.isOpen"
    variant="underlined"
    control-variant="hidden"
  ></v-number-input>
  <v-select
    :model-value="(value as number)"
    v-if="question.type === 'single'"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[requiredRule]"
    :disabled="!question.isOpen"
    variant="underlined"
    :items="question.options"
    :item-value="(option) => option.id"
    :item-title="(option) => option.content"
  ></v-select>
  <v-select
    :model-value="(value as number[])"
    v-if="question.type === 'multiple'"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[requiredRule]"
    :disabled="!question.isOpen"
    variant="underlined"
    multiple
    :items="question.options"
    :item-value="(option) => option.id"
    :item-title="(option) => option.content"
  ></v-select>
</template>

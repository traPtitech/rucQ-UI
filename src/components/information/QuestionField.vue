<script setup lang="ts">
import type { components } from '@/api/schema'
import { defineModel, defineProps } from 'vue'

type Question = components['schemas']['QuestionResponse']

defineProps<{ question: Question }>()
const value = defineModel<string | number | number[]>('value')
</script>

<!-- prettier-ignore -->
<template>
  <v-text-field
    v-model="(value as string)"
    v-if="question.type === 'free_text'"
    v-bind="$attrs"
    :label="question.title"
    :messages="[question.description ?? '']"
    variant="underlined"
  ></v-text-field>
  <v-number-input
    v-model="(value as number)"
    v-if="question.type === 'free_number'"
    v-bind="$attrs"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[(v) => !!v || '必須項目です']"
    variant="underlined"
    control-variant="hidden"
  ></v-number-input>
  <v-select
    v-model="(value as number)"
    v-if="question.type === 'single'"
    v-bind="$attrs"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[(v) => !!v || '必須項目です']"
    variant="underlined"
    :items="question.options"
    :item-value="(option) => option.id"
    :item-title="(option) => option.content"
  ></v-select>
  <v-select
    v-model="(value as number[])"
    v-if="question.type === 'multiple'"
    v-bind="$attrs"
    :label="question.title"
    :messages="[question.description ?? '']"
    :rules="[(v) => !!v || '必須項目です']"
    variant="underlined"
    multiple
    :items="question.options"
    :item-value="(option) => option.id"
    :item-title="(option) => option.content"
  ></v-select>
</template>

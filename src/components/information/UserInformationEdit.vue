<script setup lang="ts">
import type { components } from '@/api/schema'

type QuestionItem = components['schemas']['Question'] & {
  content?: string
  contentNew?: string
}

const props = defineProps<{
  questionItem: QuestionItem
  staff: boolean
}>()
const answer = defineModel<string>('')

const disabled = !(props.staff || props.questionItem.is_open)
const hint = `${props.questionItem.description ?? ''}${props.questionItem.is_public ? '' : ' (private)'}`
const selectionItems = props.questionItem.options?.map((option) => option.content) ?? []
</script>

<template>
  <v-text-field
    :label="questionItem.title"
    v-if="questionItem.type === 'free_number'"
    v-model="answer"
    :disabled="disabled"
    variant="underlined"
    :hint="hint"
    :rules="[(v) => !!v || `${questionItem.title}は必須です`]"
    required
  />

  <v-text-field
    :label="questionItem.title"
    v-if="questionItem.type === 'free_text'"
    v-model="answer"
    :disabled="disabled"
    variant="underlined"
    :hint="hint"
    :rules="[(v) => !!v || `${questionItem.title}は必須です`]"
    required
  />

  <v-select
    v-if="questionItem.type === 'single'"
    :label="questionItem.title"
    v-model="answer"
    :disabled="disabled"
    :items="selectionItems"
    hide-label="auto"
    variant="underlined"
    :hint="hint"
    :rules="[(v) => !!v || `${questionItem.title}は必須です`]"
    required
  />
</template>

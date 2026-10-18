<script setup lang="ts">
import {
  FreeNumberQuestionResponseType,
  FreeTextQuestionResponseType,
  MultipleChoiceQuestionResponseType,
  SingleChoiceQuestionResponseType,
} from '@/api/generated/client.schemas'
import type { QuestionResponse as Question } from '@/api/generated/client.schemas'

import { computed } from 'vue'

const props = defineProps<{
  question: Question
  value: string | number | number[] | undefined
  isReady: boolean
}>()

// isReady が false のうちは仮の要素を表示し、true になった瞬間に切り替える
// 初回読み込み時の v-label の移動アニメーションを発生させないようにするため

const displayValue = computed(() => {
  switch (props.question.type) {
    case FreeTextQuestionResponseType.free_text:
      return props.value as string
    case FreeNumberQuestionResponseType.free_number:
      return String(props.value)
    case SingleChoiceQuestionResponseType.single:
      return props.question.options.find((option) => option.id === props.value)?.content ?? ''
    case MultipleChoiceQuestionResponseType.multiple:
      return props.question.options
        .filter((option) => Array.isArray(props.value) && props.value.includes(option.id))
        .map((option) => option.content)
        .join(', ')
    default:
      return ''
  }
})
</script>

<template>
  <div v-if="isReady">
    <v-text-field
      :key="props.question.id"
      :label="props.question.title"
      variant="underlined"
      :model-value="displayValue"
      disabled
      :class="$style.showAnswer"
    ></v-text-field>
  </div>
  <div v-else>
    <v-text-field
      :key="props.question.id"
      :label="props.question.title"
      variant="underlined"
      disabled
      :class="$style.hideAnswer"
    ></v-text-field>
  </div>
</template>

<style module>
.showAnswer :global(.v-field) {
  opacity: 1;
}

.hideAnswer :global(.v-field) {
  opacity: 0;
}
</style>

<script setup lang="ts">
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import { onMounted, ref } from 'vue'
import UserIcon from '../generic/UserIcon.vue'

type Question = components['schemas']['QuestionResponse']

const getAnswers = async (question: Question) => {
  const { data, error } = await apiClient.GET('/api/questions/{questionId}/answers', {
    params: { path: { questionId: question.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch answers')
  return data
}

const props = defineProps<{
  question: Question
}>()

// 回答別 Answer[]
const traQIDsByAnswer = ref<Record<string, string[]>>({})

onMounted(async () => {
  try {
    const byAnswer: Record<string, string[]> = {}
    const answers = await getAnswers(props.question)
    // 回答を回答内容ごとにグループ化
    switch (props.question.type) {
      case 'single': {
        for (const option of props.question.options) {
          byAnswer[option.content] = []
        }
        for (const answer of answers) {
          if (answer.type !== 'single') continue
          byAnswer[answer.selectedOption.content].push(answer.userId)
        }
        break
      }
      case 'multiple': {
        for (const option of props.question.options) {
          byAnswer[option.content] = []
        }
        for (const answer of answers) {
          if (answer.type !== 'multiple') continue
          for (const selectedOption of answer.selectedOptions) {
            byAnswer[selectedOption.content].push(answer.userId)
          }
        }
        break
      }
      case 'free_text': {
        for (const answer of answers) {
          if (answer.type !== 'free_text') continue
          byAnswer[answer.content].push(answer.userId)
        }
        break
      }
      case 'free_number': {
        for (const answer of answers) {
          if (answer.type !== 'free_number') continue
          byAnswer[answer.content.toString()].push(answer.userId)
        }
        break
      }
    }

    traQIDsByAnswer.value = byAnswer
  } catch (error) {
    console.error('Error fetching answers:', error)
  }
})
</script>

<template>
  <v-table v-if="props.question.type === 'single'">
    <thead>
      <tr>
        <th class="text-left">回答</th>
        <th class="text-left">回答者</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(ids, text) in traQIDsByAnswer" :key="text">
        <td>{{ text }}</td>
        <td>
          <user-icon v-for="id in ids" :key="id" :id="id" :size="30" />
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style module></style>

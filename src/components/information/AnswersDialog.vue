<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { apiClient } from '@/api/apiClient'
import AnswersDialogContent from './AnswersDialogContent.vue'
import type { components } from '@/api/schema'
const { xs } = useDisplay()

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Question = components['schemas']['QuestionResponse']

const props = defineProps<{
  questionGroup: QuestionGroup
}>()

const openPanel = ref<number | undefined>(0)

// 与えられた質問に対する回答を回答テキスト別 ID の配列として取得
const getAnswers = async (question: Question) => {
  const { data, error } = await apiClient.GET('/api/questions/{questionId}/answers', {
    params: { path: { questionId: question.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch answers')
  const byAnswer: Record<string, string[]> = {}

  switch (question.type) {
    case 'single': {
      for (const option of question.options) byAnswer[option.content] = []
      for (const answer of data) {
        if (answer.type !== 'single') continue
        byAnswer[answer.selectedOption.content].push(answer.userId)
      }
      break
    }
    case 'multiple': {
      for (const option of question.options) byAnswer[option.content] = []
      for (const answer of data) {
        if (answer.type !== 'multiple') continue
        for (const selectedOption of answer.selectedOptions) {
          byAnswer[selectedOption.content].push(answer.userId)
        }
      }
      break
    }
    case 'free_text': {
      for (const answer of data) {
        if (answer.type !== 'free_text') continue
        byAnswer[answer.content] ??= []
        byAnswer[answer.content].push(answer.userId)
      }
      break
    }
    case 'free_number': {
      for (const answer of data) {
        if (answer.type !== 'free_number') continue
        byAnswer[answer.content.toString()] ??= []
        byAnswer[answer.content.toString()].push(answer.userId)
      }
      break
    }
  }
  return byAnswer
}

// 設問 ID 別 [回答テキスト別 回答者 ID の配列 の連想配列] の連想配列
const traQIDsByAnswer = reactive<Record<number, Record<string, string[]>>>({})

const publicQuestions = computed(() => {
  return props.questionGroup.questions.filter((q) => q.isPublic)
})

onMounted(async () => {
  for (const question of props.questionGroup.questions) {
    if (!question.isPublic) continue
    traQIDsByAnswer[question.id] = await getAnswers(question)
  }
})

const closeBtnProps = {
  density: 'comfortable',
  elevation: 0,
  icon: 'mdi-close',
  baseColor: 'transparent',
  class: 'text-secondary',
} as const
</script>

<template>
  <v-dialog
    :fullscreen="xs"
    :transition="xs ? 'dialog-bottom-transition' : undefined"
    :max-width="xs ? undefined : 800"
  >
    <template v-slot:activator="{ props: activatorProps }">
      <div :class="$style.button" v-bind="activatorProps">参加者の回答を見る</div>
    </template>

    <template v-slot:default="{ isActive }">
      <div class="bg-white h-100" v-if="xs">
        <div :class="$style.heading">
          <v-btn @click="isActive.value = false" v-bind="closeBtnProps" />
        </div>
        <v-expansion-panels variant="accordion" v-model="openPanel">
          <answers-dialog-content
            v-for="q in publicQuestions"
            :key="q.id"
            :question="q"
            :answers="traQIDsByAnswer[q.id]"
            :isSelected="openPanel === publicQuestions.indexOf(q)"
          />
        </v-expansion-panels>
      </div>
      <div v-else>
        <v-card>
          <div :class="$style.heading">
            <v-btn @click="isActive.value = false" v-bind="closeBtnProps" />
          </div>
          <v-expansion-panels variant="accordion" v-model="openPanel">
            <answers-dialog-content
              v-for="q in publicQuestions"
              :key="q.id"
              :question="q"
              :answers="traQIDsByAnswer[q.id]"
              :isSelected="openPanel === publicQuestions.indexOf(q)"
            />
          </v-expansion-panels>
        </v-card>
      </div>
    </template>
  </v-dialog>
</template>

<style module>
.heading {
  display: flex;
  justify-content: flex-end;
  padding: 4px;
}

.button {
  margin-top: 10px;
  width: 100%;
  text-align: end;
  font-size: 12px;
  font-weight: 400;
  color: #0066ff;
  cursor: pointer;
}

.content {
  border: 1px solid red;
  margin: 0;
  padding: 0;
  width: 100%;
}
</style>

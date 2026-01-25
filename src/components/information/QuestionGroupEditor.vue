<script setup lang="ts">
import type { components } from '@/api/schema'
import QuestionEditField from '@/components/information/QuestionEditField.vue'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import AnswersDialog from '@/components/information/AnswersDialog.vue'
import { computed } from 'vue'
import { getDayString } from '@/utils/date'

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Question = components['schemas']['QuestionResponse']

type AnswerData = { id?: number; value?: number | string | number[] }

const props = defineProps<{
  questionGroup: QuestionGroup
  answersMap: Record<number, AnswerData>
  allChecked: boolean
  isAnswered: boolean
  getQuestionUnits: (questions: Question[]) => {
    size: 1 | 2
    questions: Question[]
  }[]
}>()

const emit = defineEmits<{
  save: []
  close: []
  'update:answer': [
    {
      questionId: number
      value: string | number | number[]
    },
  ]
}>()

const questionUnits = computed(() => props.getQuestionUnits(props.questionGroup.questions))

// 各設問の v-model 用 computed（親に更新を委譲）
const answerModel = (questionId: number) =>
  computed({
    get: () => props.answersMap[questionId]!.value,
    set: (v) => emit('update:answer', { questionId, value: v! }),
  })
</script>

<template>
  <v-card color="primary" elevation="0" :class="$style.card">
    <template #title>
      <div :class="$style.title">
        <span class="font-weight-bold text-white">{{ questionGroup.name }}</span>
        <div>
          <v-btn
            v-if="props.isAnswered"
            density="comfortable"
            elevation="0"
            icon="mdi-close"
            base-color="transparent"
            class="text-white"
            @click="emit('close')"
          />
          <div v-else :class="$style.deadline">
            {{ getDayString(new Date(questionGroup.due)) }}
            <v-icon icon="mdi-calendar-clock"></v-icon>
          </div>
        </div>
      </div>
    </template>
    <v-card-text class="bg-white pt-4">
      <markdown-preview :mdtext="questionGroup.description ?? ''" />
      <div :class="$style.editContent">
        <div v-for="(unit, index) in questionUnits" :key="index">
          <div v-if="unit.size === 1" :class="$style.unitColumns">
            <question-edit-field
              v-for="question in unit.questions"
              :key="question.id"
              :question="question"
              :value="answerModel(question.id).value"
              @update:value="
                (v) => emit('update:answer', { questionId: question.id, value: v as any })
              "
            />
          </div>
          <question-edit-field
            v-for="question in unit.questions"
            v-else
            :key="question.id"
            :question="question"
            :value="answerModel(question.id).value"
            @update:value="
              (v) => emit('update:answer', { questionId: question.id, value: v as any })
            "
          />
        </div>
      </div>
      <answers-dialog :question-group="props.questionGroup" />
      <v-btn
        elevation="0"
        append-icon="mdi-check"
        base-color="transparent"
        variant="flat"
        color="primary"
        :class="$style.save"
        :disabled="!props.allChecked"
        @click="emit('save')"
      >
        <span class="font-weight-medium">保存</span>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<style module>
.card {
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1) !important;
  margin: 0 4px;
  transition: none !important;
}

.card :global(.v-card-item) {
  height: 40px !important;
  padding-right: 4px !important;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  letter-spacing: 0.1em;
  width: 100%;
}

.deadline {
  font-family: 'Reddit Sans Variable';
  margin-right: 6px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.editContent {
  margin-top: 8px;
}

.unitColumns {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  align-items: flex-start;
}

.save {
  width: 100%;
  margin-top: 8px;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 0.1em;
}
</style>

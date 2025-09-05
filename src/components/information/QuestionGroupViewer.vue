<script setup lang="ts">
import type { components } from '@/api/schema'
import QuestionShowField from '@/components/information/QuestionShowField.vue'
import { computed } from 'vue'
import AnswerDialog from '@/components/information/AnswersDialog.vue'

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Question = components['schemas']['QuestionResponse']

type AnswerData = { id?: number; value?: number | string | number[] }

const props = defineProps<{
  questionGroup: QuestionGroup
  answersMap: Record<number, AnswerData>
  isReady: boolean
  isEditable: boolean
  getQuestionUnits: (questions: Question[]) => {
    size: 1 | 2
    questions: Question[]
  }[]
}>()
const emit = defineEmits<{ edit: [] }>()

const questionUnits = computed(() => props.getQuestionUnits(props.questionGroup.questions))
</script>

<template>
  <v-card color="primaryLight" elevation="0" :class="$style.card">
    <template #title>
      <div :class="$style.title">
        <span :class="'font-weight-bold text-primary'">{{ props.questionGroup.name }}</span>
        <v-btn
          density="comfortable"
          elevation="0"
          icon="mdi-square-edit-outline"
          base-color="transparent"
          :class="props.isEditable ? ['text-primary'] : ['text-primary', $style.disabledEdit]"
          :disabled="!props.isEditable"
          @click="emit('edit')"
        />
      </div>
    </template>
    <v-card-text class="bg-white pt-4">
      <div :class="$style.showContent">
        <div v-for="(unit, index) in questionUnits" :key="index">
          <div v-if="unit.size === 1" :class="$style.unitColumns">
            <question-show-field
              v-for="question in unit.questions"
              :key="question.id"
              :question="question"
              :value="props.answersMap[question.id]?.value"
              :is-ready="props.isReady"
            />
          </div>
          <question-show-field
            v-for="question in unit.questions"
            v-else
            :key="question.id"
            :question="question"
            :value="props.answersMap[question.id]?.value"
            :is-ready="props.isReady"
          />
        </div>
      </div>
      <answer-dialog :question-group="props.questionGroup" />
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

.showContent {
  margin-bottom: -16px;
}

.unitColumns {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  align-items: flex-start;
}

.disabledEdit {
  opacity: 0.5 !important;
}

.disabledEdit :global(.v-btn__overlay) {
  background-color: transparent !important;
}
</style>

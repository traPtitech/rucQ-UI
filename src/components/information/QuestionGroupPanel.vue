<script setup lang="ts">
import type { components } from '@/api/schema'
import { getDayString } from '@/lib/date'
import { apiClient } from '@/api/apiClient'
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, reactive } from 'vue'

const { camp } = storeToRefs(useCampStore())

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Answer = components['schemas']['AnswerResponse']

const props = defineProps<{
  questionGroup: QuestionGroup
}>()

const inEditMode = ref(false)

const cardColor = computed(() => (inEditMode.value ? 'theme' : 'themePale'))
const titleColor = computed(() => (inEditMode.value ? 'white' : 'theme'))

const answers = reactive<Record<number, Answer>>({})

const getMyAnswers = async () => {
  if (!camp.value) throw new Error('Camp is not selected')
  const { data, error } = await apiClient.GET('/api/me/question-groups/{questionGroupId}/answers', {
    params: { path: { campId: camp.value.id, questionGroupId: props.questionGroup.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch answers')
  return data
}

const refreshAnswers = async () => {
  const answersData = await getMyAnswers()
  Object.assign(
    answers,
    Object.fromEntries(answersData.map((answer) => [answer.questionId, answer])),
  )
}

const answerTexts = computed(() => {
  const answerTexts = ref<Record<number, string>>({})
  for (const question of props.questionGroup.questions) {
    const answer = answers[question.id]
    if (!answer) continue
    switch (answer.type) {
      case 'free_text':
      case 'free_number':
        answerTexts.value[question.id] = String(answer.content)
        break
      case 'single':
        answerTexts.value[question.id] = String(answer.content.content)
        break
      case 'multiple':
        answerTexts.value[question.id] = answer.content.map((option) => option.content).join(', ')
        break
      default:
        answerTexts.value[question.id] = ''
    }
  }
  return answerTexts
})

onMounted(refreshAnswers)
</script>

<template>
  <v-card :color="cardColor" elevation="0" :class="$style.card">
    <template v-slot:title>
      <div :class="$style.title">
        <span :class="['font-weight-bold', `text-${titleColor}`]">{{ questionGroup.name }}</span>
        <div v-if="inEditMode" :class="$style.deadline">
          {{ getDayString(new Date(questionGroup.due)) }}
          <v-icon icon="mdi-calendar-clock" :class="$style.timeIcon"></v-icon>
        </div>
        <v-btn
          v-else
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
        :class="[$style.save, 'font-weight-bold']"
        @click="inEditMode = false"
      >
        <span class="font-weight-medium">保存</span>
      </v-btn>
    </v-card-text>
    <v-card-text v-else class="bg-white pt-4">
      <div :class="$style.showContent">
        <div v-for="question in questionGroup.questions" :key="question.id">
          <v-text-field
            :label="question.title"
            variant="underlined"
            v-model="answerTexts.value[question.id]"
            disabled
            :class="$style.showAnswer"
          ></v-text-field>
        </div>
      </div>
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

.deadline {
  font-family: 'Reddit Sans';
  margin-right: 6px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0px;
  display: flex;
  align-items: center;
  gap: 8px;
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

.showContent {
  width: 100%;
  display: flex;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
  align-items: flex-start;
  margin-bottom: -16px;
}

.showAnswer :global(.v-field) {
  opacity: 1;
}
</style>

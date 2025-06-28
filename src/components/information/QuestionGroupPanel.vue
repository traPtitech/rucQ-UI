<script setup lang="ts">
import type { components } from '@/api/schema'
import { getDayString } from '@/lib/date'
import { apiClient } from '@/api/apiClient'
import { useCampStore } from '@/store'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted, reactive } from 'vue'
import QuestionField from '@/components/information/QuestionField.vue'

const { camp } = storeToRefs(useCampStore())

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Question = components['schemas']['QuestionResponse']

const props = defineProps<{ questionGroup: QuestionGroup }>()

const inEditMode = ref(false) // 編集モードであるか
const isAnswered = ref(false) // すでに一度回答を送信したことがあるか

// Vuetify の v-select に対応した形式で回答を保存する
// { questionId: answerId（あれば）, 答えそのもの | optionId | optionId[] }
const answersMap = reactive<Record<number, { id?: number; value?: number | string | number[] }>>({})

const getMyAnswers = async () => {
  if (!camp.value) throw new Error('Camp is not selected')
  const { data, error } = await apiClient.GET('/api/me/question-groups/{questionGroupId}/answers', {
    params: { path: { campId: camp.value.id, questionGroupId: props.questionGroup.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch answers')
  return data
}

// getMyAnswers の結果をリアクティブ変数 answersMap に格納する
const refreshAnswersMap = async () => {
  for (const question of props.questionGroup.questions) {
    answersMap[question.id] = {
      value: question.type === 'multiple' ? [] : undefined,
    } // 初期化
  }

  for (const answer of await getMyAnswers()) {
    isAnswered.value = true // すでに回答済み
    switch (answer.type) {
      case 'free_text':
        answersMap[answer.questionId] = { id: answer.id, value: answer.content as string }
        break
      case 'free_number':
        answersMap[answer.questionId] = { id: answer.id, value: answer.content as number }
        break
      case 'single':
        answersMap[answer.questionId] = { id: answer.id, value: answer.content.id }
        break
      case 'multiple':
        answersMap[answer.questionId] = {
          id: answer.id,
          value: answer.content.map((option) => option.id),
        }
        break
    }
  }

  if (!isAnswered.value) {
    inEditMode.value = true // まだ回答が存在しない場合、デフォルトで編集モードにする
  }
}

// すべての質問に適切な回答が与えられているか
const allChecked = computed(() => {
  let result = true
  for (const question of props.questionGroup.questions) {
    const answer = answersMap[question.id]
    if (!answer || answer.value === undefined || answer.value === null) {
      result = false
      break
    }
  }
  return result
})

// 非編集モードで回答を表示するための questionId: answerText のマップ
const answerTextsMap = computed(() => {
  const map = ref<Record<number, string>>({})
  for (const question of props.questionGroup.questions) {
    const answer = answersMap[question.id] ?? { value: '' } // デフォルトで空文字
    switch (question.type) {
      case 'free_text':
        map.value[question.id] = answer.value as string
        break
      case 'free_number':
        map.value[question.id] = String(answer.value)
        break
      case 'single':
        map.value[question.id] =
          question.options.find((option) => option.id === answer.value)?.content ?? ''
        break
      case 'multiple':
        map.value[question.id] = question.options
          .filter((option) => (answer.value as number[]).includes(option.id))
          .map((option) => option.content)
          .join(', ')
        break
    }
  }
  return map
})

onMounted(refreshAnswersMap)

const getAnswerBody = (question: Question, value: unknown) => {
  switch (question.type) {
    case 'free_text':
      return { questionId: question.id, type: question.type, content: value as string } as const
    case 'free_number':
      return { questionId: question.id, type: question.type, content: value as number } as const
    case 'single':
      return { questionId: question.id, type: question.type, content: value as number } as const
    case 'multiple':
      return { questionId: question.id, type: question.type, content: value as number[] } as const
  }
}

// 変更を破棄
const discard = async () => {
  inEditMode.value = false
  if (!import.meta.env.DEV) {
    await refreshAnswersMap()
  }
}

// 回答の更新
const sendAnswers = async () => {
  for (const question of props.questionGroup.questions) {
    const answer = answersMap[question.id]
    const body = getAnswerBody(question, answer.value)

    if (answer.id === undefined) {
      const { error } = await apiClient.POST('/api/answers', { body })
      if (error) throw error
    } else {
      const { error } = await apiClient.PUT('/api/answers/{answerId}', {
        params: { path: { answerId: answer.id } },
        body,
      })
      if (error) throw error
    }
  }
  await discard()
}
</script>

<template>
  <v-card :color="inEditMode ? 'theme' : 'themePale'" elevation="0" :class="$style.card">
    <template v-slot:title>
      <div :class="$style.title">
        <span :class="['font-weight-bold', `text-${inEditMode ? 'white' : 'theme'}`]">{{
          questionGroup.name
        }}</span>
        <div v-if="inEditMode">
          <v-btn
            v-if="isAnswered"
            density="comfortable"
            elevation="0"
            icon="mdi-close"
            baseColor="transparent"
            class="text-white"
            @click="discard"
          ></v-btn>
          <div v-else :class="$style.deadline">
            {{ getDayString(new Date(questionGroup.due)) }}
            <v-icon icon="mdi-calendar-clock" :class="$style.timeIcon"></v-icon>
          </div>
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
        <question-field
          v-for="question in questionGroup.questions"
          :key="question.id"
          v-model:value="answersMap[question.id].value"
          :question="question"
          :class="$style.questionField"
        ></question-field>
      </div>
      <v-btn
        elevation="0"
        append-icon="mdi-check"
        baseColor="transparent"
        variant="flat"
        color="theme"
        :class="[$style.save, 'font-weight-bold']"
        @click="sendAnswers"
        :disabled="!allChecked"
      >
        <span class="font-weight-medium">保存</span>
      </v-btn>
    </v-card-text>
    <v-card-text v-else class="bg-white pt-4">
      <div :class="$style.showContent">
        <div v-for="question in questionGroup.questions" :key="question.id">
          <v-text-field
            v-if="answersMap[question.id]"
            :label="question.title"
            variant="underlined"
            v-model="answerTextsMap.value[question.id]"
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
  margin: 0 4px;
  transition: none !important;
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

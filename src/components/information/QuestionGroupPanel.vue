<script setup lang="ts">
import type { components } from '@/api/schema'
import { getDayString } from '@/lib/date'
import { apiClient } from '@/api/apiClient'
import { ref, computed, onMounted, reactive, toRaw } from 'vue'
import QuestionEditField from '@/components/information/QuestionEditField.vue'
import QuestionShowField from '@/components/information/QuestionShowField.vue'
import MarkdownPreview from '@/components/markdown/MarkdownPreview.vue'
import AnswersDialog from '@/components/information/AnswersDialog.vue'

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Question = components['schemas']['QuestionResponse']
type Camp = components['schemas']['CampResponse']

const props = defineProps<{
  questionGroup: QuestionGroup
  camp: Camp
}>()

const inEditMode = ref(false) // 編集モードであるか
const isAnswered = ref(false) // すでに一度回答を送信したことがあるか
const isReady = ref(false) // 質問のデータが読み込まれたか

const getMyAnswers = async () => {
  const { data, error } = await apiClient.GET('/api/me/question-groups/{questionGroupId}/answers', {
    params: { path: { campId: props.camp.id, questionGroupId: props.questionGroup.id } },
  })
  if (error || !data) throw error ?? new Error('Failed to fetch answers')
  return data
}

// Vuetify の v-select に対応した形式で回答を保存する
type AnswerData = { id?: number; value?: number | string | number[] }
const answersMap = reactive<Record<number, AnswerData>>({})
const originalMap = reactive<Record<number, AnswerData>>({})

// getMyAnswers の結果をリアクティブ変数 answersMap に格納する
const refreshAnswersMap = async () => {
  for (const question of props.questionGroup.questions) {
    switch (question.type) {
      case 'free_text':
        answersMap[question.id] = { value: '' } // 空文字で初期化
        break
      case 'free_number':
        answersMap[question.id] = { value: undefined } // undefined で初期化
        break
      case 'single':
        answersMap[question.id] = { value: undefined } // 初期化
        break
      case 'multiple':
        answersMap[question.id] = { value: [] } // 空配列で初期化
        break
    }
  }

  const myAnswers = await getMyAnswers()
  for (const answer of myAnswers) {
    isAnswered.value = true // すでに回答済み
    switch (answer.type) {
      case 'free_text': {
        answersMap[answer.questionId] = { id: answer.id, value: answer.content as string }
        break
      }
      case 'free_number': {
        answersMap[answer.questionId] = { id: answer.id, value: answer.content as number }
        break
      }
      case 'single': {
        answersMap[answer.questionId] = { id: answer.id, value: answer.selectedOption.id }
        break
      }
      case 'multiple': {
        answersMap[answer.questionId] = {
          id: answer.id,
          value: answer.selectedOptions.map((option) => option.id),
        }
        break
      }
    }
  }

  // originalMap にディープコピーを追加
  Object.assign(originalMap, structuredClone(toRaw(answersMap)))

  if (!isAnswered.value) {
    inEditMode.value = true // まだ回答が一つも存在しない場合、デフォルトで編集モードにする
  }

  isReady.value = true
}

// すべての質問に適切な回答が与えられているか
const allChecked = computed(() => {
  let result = true
  for (const question of props.questionGroup.questions) {
    const answer = answersMap[question.id]
    if (!answer || answer.value === undefined || answer.value === null) {
      result = false // multiple の [], free_text の '' は falsy だが回答済みとみなす
      break
    }
  }
  return result
})

// isOpen が true の質問が 1 つ以上存在するか。もし false ならばそもそも編集モードに入れない
const isEditable = computed(() => props.questionGroup.questions.some((question) => question.isOpen))

// 回答が変更されたかどうかを判定
const isAnswerChanged = (questionId: number) => {
  const current = answersMap[questionId]
  const original = originalMap[questionId]

  if (Array.isArray(current.value) && Array.isArray(original.value)) {
    if (current.value.length !== original.value.length) return true
    return current.value.some((val, index) => val !== (original.value as number[])[index])
  } else {
    return current.value !== original.value
  }
}

// 編集を終了
const quitEditMode = async () => {
  inEditMode.value = false
  await refreshAnswersMap()
}

// 回答の更新
const sendAnswers = async () => {
  const getAnswerBody = (question: Question, value: string | number | number[]) => {
    switch (question.type) {
      case 'free_text':
        return { questionId: question.id, type: question.type, content: value as string } as const
      case 'free_number':
        return { questionId: question.id, type: question.type, content: value as number } as const
      case 'single':
        return { questionId: question.id, type: question.type, optionId: value as number } as const
      case 'multiple':
        return {
          questionId: question.id,
          type: question.type,
          optionIds: value as number[],
        } as const
    }
  }

  if (isAnswered.value) {
    // 変更された回答のPUTリクエストを並列で実行
    const updatePromises = props.questionGroup.questions
      .filter((question: Question) => isAnswerChanged(question.id))
      .map(async (question) => {
        const answer = answersMap[question.id]
        const resp = await apiClient.PUT('/api/answers/{answerId}', {
          params: { path: { answerId: answer.id! } },
          body: getAnswerBody(question, answer.value!),
        })
        const { error } = resp

        if (error) throw error
      })

    await Promise.all(updatePromises)
  } else {
    // 初回回答の場合、全回答を POST で送信
    const { error } = await apiClient.POST('/api/question-groups/{questionGroupId}/answers', {
      params: { path: { questionGroupId: props.questionGroup.id } },
      body: props.questionGroup.questions.map((question: Question) =>
        getAnswerBody(question, answersMap[question.id].value!),
      ),
    })

    if (error) throw error
  }

  await quitEditMode()
}

// 質問を見やすく並べるための構造化
const questionUnits = computed(() => {
  const units: { size: 1 | 2; questions: Question[] }[] = []
  for (const question of props.questionGroup.questions) {
    if (question.type === 'free_text' || question.type === 'multiple') {
      units.push({ size: 2, questions: [question] }) // 常に横幅いっぱいに表示
    } else {
      if (units.length === 0 || units[units.length - 1].size === 2) {
        units.push({ size: 1, questions: [question] })
      } else {
        units[units.length - 1].questions.push(question)
      }
    }
  }

  // size 1 の unit の質問が奇数個ならば、最後の質問を size 2 の unit として独立させて余白を埋める
  for (let i = 0; i < units.length; i++) {
    if (units[i].size === 1 && units[i].questions.length % 2 === 1) {
      const question = units[i].questions.pop() as Question
      units.splice(i + 1, 0, { size: 2, questions: [question] })
      if (units[i].questions.length === 0) {
        units.splice(i, 1)
      } else {
        i++
      }
    }
  }

  return units
})

onMounted(refreshAnswersMap)
</script>

<template>
  <v-card :color="inEditMode ? 'primary' : 'primaryLight'" elevation="0" :class="$style.card">
    <template v-slot:title>
      <div :class="$style.title">
        <span :class="['font-weight-bold', `text-${inEditMode ? 'white' : 'primary'}`]">{{
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
            @click="quitEditMode"
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
          :class="isEditable ? ['text-primary'] : ['text-primary', $style.disabledEdit]"
          @click="inEditMode = true"
          :disabled="!isEditable"
        ></v-btn>
      </div>
    </template>
    <v-card-text v-if="inEditMode" class="bg-white pt-4">
      <markdown-preview :mdtext="questionGroup.description ?? ''" />
      <div :class="$style.editContent">
        <div v-for="(unit, index) in questionUnits" :key="index">
          <div :class="$style.unitColumns" v-if="unit.size === 1">
            <question-edit-field
              v-for="question in unit.questions"
              :key="question.id"
              v-model:value="answersMap[question.id].value"
              :question="question"
            ></question-edit-field>
          </div>
          <question-edit-field
            v-else
            v-for="question in unit.questions"
            :key="question.id"
            v-model:value="answersMap[question.id].value"
            :question="question"
          ></question-edit-field>
        </div>
      </div>
      <answers-dialog />
      <v-btn
        elevation="0"
        append-icon="mdi-check"
        baseColor="transparent"
        variant="flat"
        color="primary"
        :class="[$style.save, 'font-weight-bold']"
        @click="sendAnswers"
        :disabled="!allChecked"
      >
        <span class="font-weight-medium">保存</span>
      </v-btn>
    </v-card-text>
    <v-card-text v-else class="bg-white pt-4">
      <div :class="$style.showContent">
        <div v-for="(unit, index) in questionUnits" :key="index">
          <div :class="$style.unitColumns" v-if="unit.size === 1">
            <question-show-field
              v-for="question in unit.questions"
              :key="question.id"
              :question="question"
              :value="answersMap[question.id]?.value"
              :is-ready="isReady"
            />
          </div>
          <question-show-field
            v-else
            v-for="question in unit.questions"
            :key="question.id"
            :question="question"
            :value="answersMap[question.id]?.value"
            :is-ready="isReady"
          />
        </div>
      </div>
      <question-answers />
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

.save {
  width: 100%;
  margin-top: 8px;
  font-weight: bold;
  font-size: 16px;
  letter-spacing: 2px;
}

.editContent {
  margin-top: 8px;
}

.showContent {
  margin-bottom: -16px;
}

.unitColumns {
  width: 100%;
  display: flex;
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

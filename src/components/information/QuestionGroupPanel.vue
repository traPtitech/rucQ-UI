<script setup lang="ts">
import {
  FreeNumberAnswerResponseType,
  FreeNumberQuestionResponseType,
  FreeTextAnswerResponseType,
  FreeTextQuestionResponseType,
  MultipleChoiceAnswerResponseType,
  MultipleChoiceQuestionResponseType,
  SingleChoiceAnswerResponseType,
  SingleChoiceQuestionResponseType,
} from '@/api/generated/client.schemas'
import type {
  CampResponse as Camp,
  QuestionGroupResponse as QuestionGroup,
  QuestionResponse as Question,
} from '@/api/generated/client.schemas'

import { useCamps } from '@/composables/camps'
import {
  getGetMyAnswersQueryOptions,
  putAnswer,
  postAnswers,
  getGetMyAnswersQueryKey,
  getGetAnswersQueryKey,
} from '@/api/generated/client'
import { ref, computed, onMounted, reactive, toRaw } from 'vue'
import QuestionGroupEditor from '@/components/information/QuestionGroupEditor.vue'
import QuestionGroupViewer from '@/components/information/QuestionGroupViewer.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()

const props = defineProps<{
  questionGroup: QuestionGroup
  camp: Camp
}>()

const { hasRegisteredLatest, isOperable: isCampOperable } = useCamps()

const inEditMode = ref(false) // 編集モードであるか
const isAnswered = ref(false) // すでに一度回答を送信したことがあるか
const isReady = ref(false) // 質問のデータが読み込まれたか

// 表示中の合宿が（未来の合宿かつ参加登録済みであるかの意味で）編集可能かどうか
const isOperable = computed(() => isCampOperable(props.camp))

const getMyAnswers = () =>
  queryClient.fetchQuery(getGetMyAnswersQueryOptions(props.questionGroup.id))

// Vuetify の v-select に対応した形式で回答を保存する
type AnswerData = { id?: number; value?: number | string | number[] }
const answersMap = reactive<Record<number, AnswerData>>({})
const originalMap = reactive<Record<number, AnswerData>>({})

// getMyAnswers の結果をリアクティブ変数 answersMap に格納する
const refreshAnswersMap = async () => {
  for (const question of props.questionGroup.questions) {
    switch (question.type) {
      case FreeTextQuestionResponseType.free_text:
        answersMap[question.id] = { value: '' } // 空文字で初期化
        break
      case FreeNumberQuestionResponseType.free_number:
        answersMap[question.id] = { value: undefined } // undefined で初期化
        break
      case SingleChoiceQuestionResponseType.single:
        answersMap[question.id] = { value: undefined } // 初期化
        break
      case MultipleChoiceQuestionResponseType.multiple:
        answersMap[question.id] = { value: [] } // 空配列で初期化
        break
    }
  }

  const myAnswers = await getMyAnswers()
  for (const answer of myAnswers) {
    isAnswered.value = true // すでに回答済み
    switch (answer.type) {
      case FreeTextAnswerResponseType.free_text: {
        answersMap[answer.questionId] = { id: answer.id, value: answer.content }
        break
      }
      case FreeNumberAnswerResponseType.free_number: {
        answersMap[answer.questionId] = { id: answer.id, value: answer.content }
        break
      }
      case SingleChoiceAnswerResponseType.single: {
        answersMap[answer.questionId] = { id: answer.id, value: answer.selectedOption.id }
        break
      }
      case MultipleChoiceAnswerResponseType.multiple: {
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

  if (!isAnswered.value && isOperable.value) {
    // まだ回答が一つも存在せず、かつ操作可能な場合デフォルトで編集モードにする
    inEditMode.value = true
  }

  isReady.value = true
}

// 質問配列を 1 列 / 2 列ユニットに整形する
const getQuestionUnits = (questions: Question[]): { size: 1 | 2; questions: Question[] }[] => {
  const units: { size: 1 | 2; questions: Question[] }[] = []
  for (const question of questions) {
    if (
      question.type === FreeTextQuestionResponseType.free_text ||
      question.type === MultipleChoiceQuestionResponseType.multiple
    ) {
      units.push({ size: 2, questions: [question] })
    } else {
      if (units.length === 0 || units.at(-1)!.size === 2) {
        units.push({ size: 1, questions: [question] })
      } else {
        units.at(-1)!.questions.push(question)
      }
    }
  }

  // size 1 のユニットが奇数個のときは最後の 1 つを 2 列にして余白を埋める
  for (let i = units.length - 1; i >= 0; i--) {
    const unit = units[i]!
    if (unit.size === 1 && unit.questions.length % 2 === 1) {
      const q = unit.questions.pop()!
      units.splice(i + 1, 0, { size: 2, questions: [q] })
      if (unit.questions.length === 0) units.splice(i, 1)
    }
  }

  return units
}

// すべての質問に適切な回答が与えられているか
const allChecked = computed(() => {
  let result = true
  for (const question of props.questionGroup.questions) {
    const answer = answersMap[question.id]
    if (answer?.value === undefined) {
      result = false // multiple の [], free_text の '' は falsy だが回答済みとみなす
      break
    }
  }
  return result
})

// 回答受付中の質問が 1 つ以上存在するか。もし false ならばそもそも編集モードに入れない
const isEditable = computed(
  () => hasRegisteredLatest.value && props.questionGroup.questions.some((q) => q.isOpen),
)

// 回答が変更されたかどうかを判定
const isAnswerChanged = (questionId: number) => {
  const current = answersMap[questionId]!
  const original = originalMap[questionId]!

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
const getAnswerBody = (question: Question, value: string | number | number[]) => {
  switch (question.type) {
    case FreeTextQuestionResponseType.free_text:
      return { questionId: question.id, type: question.type, content: value as string } as const
    case FreeNumberQuestionResponseType.free_number:
      return { questionId: question.id, type: question.type, content: value as number } as const
    case SingleChoiceQuestionResponseType.single:
      return { questionId: question.id, type: question.type, optionId: value as number } as const
    case MultipleChoiceQuestionResponseType.multiple:
      return {
        questionId: question.id,
        type: question.type,
        optionIds: value as number[],
      } as const
  }
}

// 回答の更新
const saveAnswersMutation = useMutation({
  mutationFn: async () => {
    if (isAnswered.value) {
      // 変更された回答の PUT を並列実行
      const updatePromises = props.questionGroup.questions
        .filter((question: Question) => isAnswerChanged(question.id))
        .map(async (question) => {
          const answer = answersMap[question.id]!
          await putAnswer(answer.id!, getAnswerBody(question, answer.value!))
        })
      await Promise.all(updatePromises)
    } else {
      // 初回回答: 全回答を POST で送信
      await postAnswers(
        props.questionGroup.id,
        props.questionGroup.questions.map((question: Question) =>
          getAnswerBody(question, answersMap[question.id]!.value!),
        ),
      )
    }
  },
  onSuccess: async () => {
    // 回答を保存した後は必ず最新データを取得するために invalidate
    await queryClient.invalidateQueries({
      queryKey: getGetMyAnswersQueryKey(props.questionGroup.id),
    })
    // 質問グループに含まれる全質問の回答データも無効化し、AnswersDialog に反映
    for (const question of props.questionGroup.questions) {
      await queryClient.invalidateQueries({
        queryKey: getGetAnswersQueryKey(question.id),
      })
    }
    await quitEditMode()
  },
})

onMounted(refreshAnswersMap) // 初回はクエリの invalidate を行わない
</script>

<template>
  <question-group-editor
    v-if="inEditMode"
    :question-group="props.questionGroup"
    :answers-map="answersMap"
    :all-checked="allChecked"
    :is-answered="isAnswered"
    :get-question-units="getQuestionUnits"
    @update:answer="({ questionId, value }) => (answersMap[questionId]!.value = value)"
    @save="saveAnswersMutation.mutateAsync()"
    @close="quitEditMode"
  />
  <question-group-viewer
    v-else
    :question-group="props.questionGroup"
    :answers-map="answersMap"
    :is-ready="isReady"
    :is-editable="isEditable"
    :get-question-units="getQuestionUnits"
    @edit="inEditMode = true"
  />
</template>

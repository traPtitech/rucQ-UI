<script setup lang="ts">
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import { ref, computed, onMounted, reactive, toRaw } from 'vue'
import { useCampStore } from '@/store'
import QuestionGroupEditor from '@/components/information/QuestionGroupEditor.vue'
import QuestionGroupViewer from '@/components/information/QuestionGroupViewer.vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { qk } from '@/api/queries/keys'

type QuestionGroup = components['schemas']['QuestionGroupResponse']
type Question = components['schemas']['QuestionResponse']
type Camp = components['schemas']['CampResponse']

const queryClient = useQueryClient()

const props = defineProps<{
  questionGroup: QuestionGroup
  camp: Camp
}>()

const campStore = useCampStore()

const inEditMode = ref(false) // 編集モードであるか
const isAnswered = ref(false) // すでに一度回答を送信したことがあるか
const isReady = ref(false) // 質問のデータが読み込まれたか

// 表示中の合宿が（未来の合宿かつ参加登録済みであるかの意味で）編集可能かどうか
const isOperable = computed(() => campStore.isOperable(props.camp))

const getMyAnswers = async () => {
  // クエリキーを定義し、fetchQuery で取得
  const key = qk.me.questionGroupAnswers(props.questionGroup.id)
  const data = await queryClient.fetchQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await apiClient.GET(
        '/api/me/question-groups/{questionGroupId}/answers',
        {
          params: { path: { questionGroupId: props.questionGroup.id } },
        },
      )
      if (error) throw new Error(`自分の回答の取得に失敗しました: ${error.message}`)
      return data
    },
  })
  return data
}

// Vuetify の v-select に対応した形式で回答を保存する
type AnswerData = { id?: number; value?: number | string | number[] }
const answersMap = reactive<Record<number, AnswerData>>({})
const originalMap = reactive<Record<number, AnswerData>>({})

// getMyAnswers の結果をリアクティブ変数 answersMap に格納する
const refreshAnswersMap = async () => {
  // 回答取得クエリキーを invalidate
  await queryClient.invalidateQueries({
    queryKey: qk.me.questionGroupAnswers(props.questionGroup.id),
  })

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
        answersMap[answer.questionId] = { id: answer.id, value: answer.content }
        break
      }
      case 'free_number': {
        answersMap[answer.questionId] = { id: answer.id, value: answer.content }
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

  if (!isAnswered.value && isOperable.value) {
    // まだ回答が一つも存在せず、かつ操作可能な場合デフォルトで編集モードにする
    inEditMode.value = true
  }

  isReady.value = true
}

// 質問配列を 1 列 / 2 列ユニットに整形する純粋関数
const getQuestionUnits = (questions: Question[]): { size: 1 | 2; questions: Question[] }[] => {
  const units: { size: 1 | 2; questions: Question[] }[] = []
  for (const question of questions) {
    if (question.type === 'free_text' || question.type === 'multiple') {
      units.push({ size: 2, questions: [question] })
    } else {
      if (units.length === 0 || units[units.length - 1].size === 2) {
        units.push({ size: 1, questions: [question] })
      } else {
        units[units.length - 1].questions.push(question)
      }
    }
  }

  // size 1 のユニットが奇数個のときは最後の 1 つを 2 列にして余白を埋める
  for (let i = 0; i < units.length; i++) {
    if (units[i].size === 1 && units[i].questions.length % 2 === 1) {
      const q = units[i].questions.pop()!
      units.splice(i + 1, 0, { size: 2, questions: [q] })
      if (units[i].questions.length === 0) {
        units.splice(i, 1)
      } else {
        i++
      }
    }
  }

  return units
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

// 回答受付中の質問が 1 つ以上存在するか。もし false ならばそもそも編集モードに入れない
const isEditable = computed(
  () => campStore.hasRegisteredLatest && props.questionGroup.questions.some((q) => q.isOpen),
)

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

// 回答の更新
const saveAnswersMutation = useMutation({
  mutationFn: async () => {
    if (isAnswered.value) {
      // 変更された回答の PUT を並列実行
      const updatePromises = props.questionGroup.questions
        .filter((question: Question) => isAnswerChanged(question.id))
        .map(async (question) => {
          const answer = answersMap[question.id]
          const resp = await apiClient.PUT('/api/answers/{answerId}', {
            params: { path: { answerId: answer.id! } },
            body: getAnswerBody(question, answer.value!),
          })
          const { error } = resp
          if (error) throw new Error(`回答の更新に失敗しました: ${error.message}`)
        })
      await Promise.all(updatePromises)
    } else {
      // 初回回答: 全回答を POST で送信
      const { error } = await apiClient.POST('/api/question-groups/{questionGroupId}/answers', {
        params: { path: { questionGroupId: props.questionGroup.id } },
        body: props.questionGroup.questions.map((question: Question) =>
          getAnswerBody(question, answersMap[question.id].value!),
        ),
      })
      if (error) throw new Error(`回答の送信に失敗しました: ${error.message}`)
    }
  },
  onSuccess: async () => {
    await quitEditMode()
  },
})

onMounted(refreshAnswersMap)
</script>

<template>
  <question-group-editor
    v-if="inEditMode"
    :question-group="props.questionGroup"
    :answers-map="answersMap"
    :all-checked="allChecked"
    :is-answered="isAnswered"
    :get-question-units="getQuestionUnits"
    @update:answer="({ questionId, value }) => (answersMap[questionId].value = value)"
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

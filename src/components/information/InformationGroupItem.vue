<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { components } from '@/api/schema'
import { apiClient } from '@/api/apiClient'
import UserInformationEdit from '@/components/information/UserInformationEdit.vue'
import { getDayStringNoPad } from '@/lib/date'
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()

type QuestionItem = components['schemas']['Question'] & {
  content?: string
  contentNew?: string
}

// バリデーション関数未搭載

const groupColor = computed(() => {
  if (questionItems.value[0]?.content !== undefined && questionItems.value[0]?.content !== null) {
    return 'orange'
  } else {
    return date > now ? 'orange' : 'red'
  }
})

// targetIdは、undefined: 自分, null: 選択なし
const props = defineProps<{
  questionGroup: components['schemas']['QuestionGroup']
  targetId?: string | null
}>()

const questionItems = ref<QuestionItem[]>([])
const date = new Date(props.questionGroup.due)
const now = new Date()

const editMode = ref<boolean>(false)

const constructQuestionItems = async () => {
  const res: QuestionItem[] = []
  for (const question of props.questionGroup.questions) {
    const answer = await getAnswer(question.id)
    res.push({
      ...question,
      content: answer?.content as string,
      contentNew: answer?.content as string,
    })
  }
  return res
}

// 入力を送信する
const submit = async () => {
  for (const questionItem of questionItems.value) {
    await editAnswer(questionItem)
  }
  editMode.value = false
}

// 入力をなかったことにする
const cancel = () => {
  questionItems.value.forEach((questionItem) => {
    questionItem.contentNew = questionItem.content
  })
  editMode.value = false
}

const getAnswer = async (questionId: number) => {
  if (props.targetId === null) return null
  const { data, error } =
    props.targetId === undefined
      ? await apiClient.GET('/api/me/answers/{question_id}', {
          params: { path: { question_id: questionId } },
        })
      : await apiClient.GET('/api/users/{traq_id}/answers/{question_id}', {
          params: { path: { traq_id: props.targetId, question_id: questionId } },
        })
  if (error) console.error('Failed to fetch question answer:', error.message)
  return data
}

const editAnswer = async (questionItem: QuestionItem) => {
  if (props.targetId === null) return false
  const { error } =
    props.targetId === undefined
      ? await apiClient.PUT('/api/me/answers/{question_id}', {
          params: { path: { question_id: questionItem.id } },
          body: { content: questionItem.contentNew },
        })
      : await apiClient.PUT('/api/users/{traq_id}/answers/{question_id}', {
          params: { path: { traq_id: props.targetId, question_id: questionItem.id } },
          body: { content: questionItem.contentNew },
        })
  if (error) console.error('Failed to edit question answer:', error.message)
  else questionItem.content = questionItem.contentNew
}

watch(
  () => props.targetId,
  async () => {
    questionItems.value = await constructQuestionItems()
    editMode.value =
      questionItems.value[0]?.content === undefined || questionItems.value[0]?.content === null
  },
  { immediate: true },
)
</script>

<template>
  <v-sheet v-if="!editMode" :class="`${!xs ? 'mx-4' : ''} mb-4 pt-1`" color="white">
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex flex-column">
        <v-card-title>
          <span style="font-size: 20px; font-weight: bold">{{ questionGroup.name }}</span>
        </v-card-title>
      </div>
      <v-btn
        @click="editMode = true"
        density="comfortable"
        elevation="0"
        icon="mdi-pencil"
        color="orange"
        variant="text"
        :disabled="targetId === null"
        style="margin-right: 8px; font-size: 12px"
      >
      </v-btn>
    </div>

    <div style="padding-bottom: 8px">
      <div style="display: grid; grid-template-columns: 1fr 1fr">
        <div
          :style="`grid-row: 1 / ${questionItems.length + 2}; grid-column: 1; border-right: 1px solid var(--color-gray)`"
        ></div>
        <div
          v-for="(qItem, i) in questionItems"
          :key="qItem.id"
          :style="`align-self: center; grid-row: ${i + 1}; grid-column: 1; margin: 4px 16px;`"
        >
          {{ qItem.title }}
        </div>
        <div
          v-for="(qItem, i) in questionItems"
          :key="qItem.id"
          :style="`grid-row: ${i + 1}; grid-column: 2; margin: 0 16px;`"
        >
          <div style="font-weight: bold; margin: 4px 0">
            {{ qItem.content }}
          </div>
        </div>
      </div>
    </div>
  </v-sheet>

  <v-sheet
    v-else
    :class="`mb-4 ${!xs ? 'mx-4' : ''} pt-1`"
    :color="`${groupColor}Pale`"
    :rounded="!xs"
  >
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex flex-column">
        <v-card-title>
          <span style="font-size: 20px; font-weight: bold">{{ questionGroup.name }}</span>
        </v-card-title>
      </div>
      <div
        v-if="questionItems[0]?.content === undefined || questionItems[0]?.content === null"
        style="display: flex; align-items: center; margin-right: 16px"
      >
        <div :style="`color: var(--color-${groupColor}); font-weight: bold; margin-right: 8px`">
          {{ getDayStringNoPad(new Date(questionGroup.due)) }}
        </div>
        <v-icon size="24" icon="mdi-clock-outline" :color="groupColor"></v-icon>
      </div>
      <v-btn
        v-else
        @click="cancel"
        density="comfortable"
        elevation="0"
        icon="mdi-close"
        baseColor="transparent"
        class="text-black"
        style="margin: 8px"
      ></v-btn>
    </div>

    <div style="padding: 0 16px; overflow-wrap: break-word; line-height: 1.4em; margin-bottom: 8px">
      {{ questionGroup.description }}
    </div>

    <div style="padding: 0 16px">
      <div v-for="qItem in questionItems" :key="qItem.id">
        <user-information-edit
          :question-item="qItem"
          :staff="targetId != null"
          v-model="qItem.contentNew"
        />
      </div>
      <v-btn
        elevation="0"
        prepend-icon="mdi-check"
        variant="flat"
        :color="groupColor"
        @click="submit"
        style="width: 100%; font-size: 16px; margin: 12px 0"
      >
        保存
      </v-btn>
    </div>
  </v-sheet>
</template>
